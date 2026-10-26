"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { countries, checkCountryAnswer, type Country } from "@/lib/countries-data"
import { Mic, Volume2, Type, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface RandomCountryGameProps {
  onGameEnd?: () => void
}

const MAX_DIFFICULTY = 5

// Speech errors that mean the mic can't be used, so we stop auto-restarting it
const BLOCKING_SPEECH_ERRORS = ["not-allowed", "service-not-allowed", "audio-capture", "network"]

const MIC_BLOCKED_MESSAGE =
  "Microphone is blocked. Click the icon at the left of the address bar, allow Microphone, then press Start Listening Again. If it's already allowed, check your computer's microphone privacy settings. You can also type your answer below."

const toLetters = (text: string): string[] => text.replace(/[^A-Za-z]/g, "").toUpperCase().split("")

// Fisher-Yates shuffle, retried so the letters don't come out already solved
const jumbleLetters = (text: string): string[] => {
  const original = toLetters(text)
  let letters = [...original]
  for (let attempt = 0; attempt < 10; attempt++) {
    letters = [...original]
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    if (letters.join("") !== original.join("")) break
  }
  return letters
}

const countriesForDifficulty = (difficulty: number) => countries.filter(c => c.difficulty === difficulty)

export const RandomCountryGame = ({ onGameEnd }: RandomCountryGameProps) => {
  const router = useRouter()
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null)
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(1)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [typedAnswer, setTypedAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [availableCountries, setAvailableCountries] = useState<Country[]>([])
  const [jumbledLetters, setJumbledLetters] = useState<string[]>([])
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const [micBlocked, setMicBlocked] = useState(false)
  const [micReady, setMicReady] = useState(false)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [showManualAnswer, setShowManualAnswer] = useState(false)
  const [animatedLetters, setAnimatedLetters] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [letterSize, setLetterSize] = useState<"normal" | "large">("normal")
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set())
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Speech recognition callbacks are registered once, so they call the latest handler through this ref
  const onSpeechResultRef = useRef<(answer: string) => void>(() => {})

  const schedule = (fn: () => void, ms: number) => {
    const timer = setTimeout(() => {
      timersRef.current.delete(timer)
      fn()
    }, ms)
    timersRef.current.add(timer)
  }

  const stopAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current)
      animationRef.current = null
    }
  }

  const clearPending = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current.clear()
    stopAnimation()
  }

  const stopListening = () => {
    try {
      recognitionRef.current?.abort()
    } catch {
      // Ignore errors when stopping
    }
  }

  // Animate letters from jumbled to correct order, one position per tick
  const animateToCorrect = (from: string[], countryName: string, onComplete: () => void) => {
    stopAnimation()
    const target = toLetters(countryName)
    const working = [...from]
    setAnimatedLetters([...working])
    setIsAnimating(true)

    let step = 0
    animationRef.current = setInterval(() => {
      if (step < target.length) {
        // Only look at positions not yet placed, so repeated letters don't get swapped back out
        const sourceIndex = working.findIndex((letter, idx) => idx >= step && letter === target[step])
        if (sourceIndex > step) {
          ;[working[step], working[sourceIndex]] = [working[sourceIndex], working[step]]
        }
        setAnimatedLetters([...working])
        step++
      } else {
        stopAnimation()
        setIsAnimating(false)
        setAnimatedLetters(target)
        onComplete()
      }
    }, 80) // 80ms per letter animation
  }

  // Show a question from the pool, moving up a difficulty when the pool is empty
  const loadQuestion = (pool: Country[], difficulty: number) => {
    clearPending()
    stopListening()

    let nextDifficulty = difficulty
    let nextPool = pool
    while (nextPool.length === 0 && nextDifficulty < MAX_DIFFICULTY) {
      nextDifficulty++
      nextPool = countriesForDifficulty(nextDifficulty)
    }

    setTranscript("")
    setTypedAnswer("")
    setShowAnswer(false)
    setIsCorrect(null)
    setShowManualAnswer(false)
    setAnimatedLetters([])
    setIsAnimating(false)
    setSpeechError(null)

    if (nextPool.length === 0) {
      // Game complete
      setCurrentCountry(null)
      setAvailableCountries([])
      onGameEnd?.()
      return
    }

    const selected = nextPool[Math.floor(Math.random() * nextPool.length)]
    setCurrentDifficulty(nextDifficulty)
    setAvailableCountries(nextPool)
    setCurrentCountry(selected)
    setJumbledLetters(jumbleLetters(selected.name))
  }

  const advance = (answered: Country, pool: Country[], difficulty: number) => {
    setQuestionNumber(prev => prev + 1)
    loadQuestion(pool.filter(c => c.name !== answered.name), difficulty)
  }

  const submitAnswer = (rawAnswer: string) => {
    const answer = rawAnswer.trim().replace(/^["']|["']$/g, "").replace(/\.$/, "").trim()
    if (!currentCountry || showAnswer || !answer) return

    const country = currentCountry
    const pool = availableCountries
    const difficulty = currentDifficulty
    const correct = checkCountryAnswer(answer, country)

    stopListening()
    setTranscript(answer)
    setTypedAnswer("")
    setIsCorrect(correct)
    setShowAnswer(true)

    if (correct) {
      setScore(prev => prev + 1)
      animateToCorrect(jumbledLetters, country.name, () => {
        // Wait 1 second after animation to show the green letters
        schedule(() => advance(country, pool, difficulty), 1000)
      })
    } else {
      // Keep the same letters so the answer isn't given away, then let them try again
      schedule(() => {
        setShowAnswer(false)
        setIsCorrect(null)
        setTranscript("")
      }, 1500)
    }
  }

  useEffect(() => {
    onSpeechResultRef.current = submitAnswer
  })

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition ||
      null

    if (!SpeechRecognition) {
      setIsSpeechSupported(false)
      return
    }

    try {
      const recognition: SpeechRecognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setSpeechError(null)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const detected = event.results?.[0]?.[0]?.transcript?.trim()
        if (detected) {
          onSpeechResultRef.current(detected)
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false)

        // "aborted" happens whenever we stop listening ourselves, and "no-speech" just restarts
        if (event.error === "aborted" || event.error === "no-speech") return

        let errorMessage: string
        switch (event.error) {
          case "not-allowed":
          case "service-not-allowed":
            errorMessage = MIC_BLOCKED_MESSAGE
            break
          case "audio-capture":
            errorMessage = "No microphone found. Check your microphone, or type your answer below."
            break
          case "network":
            errorMessage = "Network error with voice recognition. Check your connection, or type your answer below."
            break
          default:
            errorMessage = `Speech recognition error: ${event.error}`
        }
        if (BLOCKING_SPEECH_ERRORS.includes(event.error)) {
          setMicBlocked(true)
        }
        setSpeechError(errorMessage)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      setIsSpeechSupported(true)
    } catch (error) {
      console.error("Failed to initialize speech recognition:", error)
      setIsSpeechSupported(false)
    }

    return () => {
      const recognition = recognitionRef.current
      if (recognition) {
        recognition.onstart = null
        recognition.onresult = null
        recognition.onerror = null
        recognition.onend = null
        try {
          recognition.abort()
        } catch {
          // Ignore errors when stopping
        }
      }
      recognitionRef.current = null
    }
  }, [])

  // Clear timers, animation and speech on unmount
  useEffect(() => {
    return () => {
      clearPending()
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep listening while a question is waiting for an answer
  useEffect(() => {
    const shouldListen =
      gameStarted &&
      currentCountry &&
      !showAnswer &&
      !isListening &&
      !isSpeaking &&
      !micBlocked &&
      micReady &&
      isSpeechSupported

    if (!shouldListen) return

    const timer = setTimeout(() => {
      try {
        recognitionRef.current?.start()
      } catch {
        // Already started - expected in some race conditions
      }
    }, 600)
    return () => clearTimeout(timer)
  }, [gameStarted, currentCountry, showAnswer, isListening, isSpeaking, micBlocked, micReady, isSpeechSupported])

  // Ask for the mic once up front (from a click), so the browser shows its permission prompt
  // before speech recognition starts and stops in the background
  const requestMicAccess = async (): Promise<boolean> => {
    if (!navigator.mediaDevices?.getUserMedia) return true

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setMicBlocked(false)
      setSpeechError(null)
      setMicReady(true)
      return true
    } catch (error: any) {
      setMicBlocked(true)
      setSpeechError(
        error?.name === "NotFoundError"
          ? "No microphone found. Check your microphone, or type your answer below."
          : MIC_BLOCKED_MESSAGE
      )
      return false
    }
  }

  const startListening = async () => {
    if (!recognitionRef.current || isListening) return
    if (!(await requestMicAccess())) return

    try {
      recognitionRef.current.start()
    } catch (error: any) {
      if (error?.name !== "InvalidStateError") {
        setSpeechError("Failed to start voice recognition. Please try again.")
      }
    }
  }

  const handleShowAnswer = () => {
    if (!currentCountry || showAnswer) return

    const country = currentCountry
    const pool = availableCountries
    const difficulty = currentDifficulty

    stopListening()
    setShowManualAnswer(true)
    setIsCorrect(false)
    setShowAnswer(true)
    setTranscript("")

    animateToCorrect(jumbledLetters, country.name, () => {
      schedule(() => advance(country, pool, difficulty), 2000)
    })
  }

  const startGame = () => {
    setGameStarted(true)
    setScore(0)
    setQuestionNumber(1)
    loadQuestion(countriesForDifficulty(1), 1)
    if (isSpeechSupported && !micReady) {
      requestMicAccess()
    }
  }

  const resetGame = () => {
    clearPending()
    stopListening()
    setGameStarted(false)
    setCurrentCountry(null)
    setScore(0)
    setQuestionNumber(0)
    setCurrentDifficulty(1)
  }

  const speakCountry = () => {
    if (!currentCountry || !("speechSynthesis" in window)) return

    // Pause the mic so it doesn't hear the spoken name as an answer
    stopListening()
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(currentCountry.name)
    utterance.lang = "en-US"
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Random Country Game</CardTitle>
          <CardDescription className="text-lg">
            Test your geography knowledge! Answer the country names using your voice or by typing.
            Start with the easiest countries and progress to harder ones.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Button onClick={startGame} size="lg" className="w-full">
            Start Game
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!currentCountry) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Congratulations!</CardTitle>
          <CardDescription className="text-lg">
            You've completed all countries! Final Score: {score}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="flex gap-2 w-full">
            <Button onClick={resetGame} size="lg" className="flex-1">
              Play Again
            </Button>
            <Button onClick={onGameEnd ?? (() => router.push("/games"))} size="lg" variant="outline" className="flex-1">
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const correctOrder = toLetters(currentCountry.name)
  const displayedLetters = showAnswer && animatedLetters.length > 0 ? animatedLetters : jumbledLetters
  const isWrongAnswer = showAnswer && isCorrect === false && !showManualAnswer

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-4">
          <div className="text-left">
            <p className="text-sm text-muted-foreground">Question {questionNumber}</p>
            <p className="text-sm text-muted-foreground">Score: {score}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Difficulty: {currentDifficulty}/{MAX_DIFFICULTY}</p>
            <p className="text-sm text-muted-foreground">
              Remaining: {availableCountries.length}
            </p>
          </div>
        </div>
        <CardTitle className="text-2xl">What country is this?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-center mb-2">
            Unscramble the letters to find the country:
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg">
            {displayedLetters.map((letter, index) => {
              const isSolved = showAnswer && !isAnimating && animatedLetters[index] === correctOrder[index]

              return (
                <Badge
                  key={`letter-${index}`}
                  variant="outline"
                  className={cn(
                    "font-bold px-4 py-2 min-w-[3rem] text-center border-2 transition-all duration-300",
                    letterSize === "large" ? "text-4xl min-w-[4rem] px-6 py-4" : "text-2xl",
                    isSolved && isCorrect
                      ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400 scale-110"
                      : isSolved && showManualAnswer
                      ? "bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400"
                      : showAnswer && isAnimating
                      ? "bg-accent/20 border-accent/50 animate-pulse"
                      : isWrongAnswer
                      ? "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400"
                      : "bg-secondary border-accent/30 hover:border-accent/50"
                  )}
                >
                  {letter}
                </Badge>
              )
            })}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-2">
            {jumbledLetters.length} letters
          </p>
        </div>

        {transcript && showAnswer && !showManualAnswer && (
          <div className="w-full p-3 bg-muted/50 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              You said: <span className="font-medium text-foreground">"{transcript}"</span>
            </p>
          </div>
        )}

        {isWrongAnswer && (
          <div className="w-full p-3 bg-red-50 dark:bg-red-950 border border-red-500 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
              Not quite. Try again!
            </p>
          </div>
        )}

        {showManualAnswer && (
          <div className="w-full p-3 bg-blue-50 dark:bg-blue-950 border border-blue-500 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
              Answer revealed. Moving to next question...
            </p>
          </div>
        )}

        {showAnswer && isCorrect && (
          <div className="w-full p-3 bg-green-50 dark:bg-green-950 border border-green-500 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400 text-center font-medium">
              ✓ Correct! Moving to next question...
            </p>
          </div>
        )}

        {!showAnswer && (
          <div className="flex flex-col items-center gap-4">
            {!isSpeechSupported && (
              <div className="w-full p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-500 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ Voice answers aren't supported in this browser (try Chrome, Edge, or Safari). You can type your answer instead.
                </p>
              </div>
            )}
            {speechError && (
              <div className="w-full p-3 bg-red-50 dark:bg-red-950 border border-red-500 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {speechError}
                </p>
              </div>
            )}
            {isListening && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mic className="h-6 w-6 text-orange-500 animate-pulse" />
                Listening...
              </div>
            )}
            {!isListening && isSpeechSupported && micBlocked && (
              <Button
                onClick={startListening}
                size="lg"
                variant="outline"
                className="w-full"
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Listening Again
              </Button>
            )}

            <form
              className="flex w-full gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                submitAnswer(typedAnswer)
              }}
            >
              <Input
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Or type your answer"
                aria-label="Your answer"
                autoComplete="off"
              />
              <Button type="submit" disabled={!typedAnswer.trim()}>
                Check
              </Button>
            </form>

            <Button
              onClick={handleShowAnswer}
              size="lg"
              variant="outline"
              className="w-full border-dashed"
            >
              Show Answer
            </Button>
          </div>
        )}

        <div className="flex justify-center gap-2">
          <Button
            onClick={speakCountry}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <Volume2 className="mr-2 h-4 w-4" />
            Hear the country name
          </Button>
          <Button
            onClick={() => setLetterSize(prev => prev === "normal" ? "large" : "normal")}
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            title={letterSize === "normal" ? "Make letters bigger" : "Make letters smaller"}
          >
            {letterSize === "normal" ? (
              <>
                <ZoomIn className="mr-2 h-4 w-4" />
                Bigger Letters
              </>
            ) : (
              <>
                <Type className="mr-2 h-4 w-4" />
                Normal Letters
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult
  length: number
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative
  length: number
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}
