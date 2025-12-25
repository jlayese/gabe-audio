"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { countries, checkCountryAnswer, type Country } from "@/lib/countries-data"
import { Mic, MicOff, CheckCircle2, XCircle, ArrowRight, Volume2, Type, ZoomIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface RandomCountryGameProps {
  onGameEnd?: () => void
}

export const RandomCountryGame = ({ onGameEnd }: RandomCountryGameProps) => {
  const router = useRouter()
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null)
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(1)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [questionNumber, setQuestionNumber] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [availableCountries, setAvailableCountries] = useState<Country[]>([])
  const [jumbledLetters, setJumbledLetters] = useState<string[]>([])
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const [speechError, setSpeechError] = useState<string | null>(null)
  const [showManualAnswer, setShowManualAnswer] = useState(false)
  const [animatedLetters, setAnimatedLetters] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [letterSize, setLetterSize] = useState<"normal" | "large">("normal")
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const nextCountriesRef = useRef<Country[] | null>(null)

  // Function to jumble/scramble letters
  const jumbleLetters = (text: string): string[] => {
    // Remove spaces and convert to uppercase
    const letters = text.replace(/\s+/g, "").toUpperCase().split("")
    // Fisher-Yates shuffle algorithm
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    return letters
  }

  // Function to animate letters from jumbled to correct order
  const animateToCorrect = (countryName: string, onComplete?: () => void) => {
    setIsAnimating(true)
    const correctLetters = countryName.replace(/\s+/g, "").toUpperCase().split("")
    const currentJumbled = [...jumbledLetters]
    
    // Initialize animatedLetters with current jumbled letters so rendering picks it up immediately
    setAnimatedLetters([...currentJumbled])
    
    // Create a mapping of correct positions
    const letterPositions: { [key: string]: number[] } = {}
    correctLetters.forEach((letter, index) => {
      if (!letterPositions[letter]) {
        letterPositions[letter] = []
      }
      letterPositions[letter].push(index)
    })
    
    // Animate step by step
    let step = 0
    const totalSteps = correctLetters.length
    const animationInterval = setInterval(() => {
      if (step < totalSteps) {
        // Find the correct letter for this position
        const targetLetter = correctLetters[step]
        // Find where this letter is in the jumbled array
        const jumbledIndex = currentJumbled.findIndex((l, idx) => {
          // Check if this letter hasn't been placed yet and matches
          const remainingPositions = letterPositions[targetLetter]?.filter(pos => pos >= step) || []
          return l === targetLetter && remainingPositions.length > 0
        })
        
        if (jumbledIndex !== -1 && jumbledIndex !== step) {
          // Swap letters
          ;[currentJumbled[step], currentJumbled[jumbledIndex]] = [currentJumbled[jumbledIndex], currentJumbled[step]]
        }
        
        setAnimatedLetters([...currentJumbled])
        step++
      } else {
        clearInterval(animationInterval)
        setIsAnimating(false)
        setAnimatedLetters(correctLetters)
        
        // Call onComplete callback if provided (for correct answers to proceed to next country)
        if (onComplete) {
          setTimeout(() => {
            onComplete()
          }, 1000) // Wait 1 second after animation to show the green letters
        }
        
        // After animation completes, if answer was incorrect, reset state and restart listening
        if (showAnswer && !isCorrect && !onComplete) {
          setTimeout(() => {
            // Reset all answer-related state to original state
            setShowAnswer(false)
            setTranscript("")
            setIsCorrect(null)
            setAnimatedLetters([])
            // Regenerate jumbled letters for the same country
            setCurrentCountry(prevCountry => {
              if (prevCountry) {
                setJumbledLetters(jumbleLetters(prevCountry.name))
              }
              return prevCountry
            })
            
            // Restart listening after state is reset
            setTimeout(() => {
              if (isSpeechSupported && recognitionRef.current) {
                setCurrentCountry(prevCountry => {
                  if (prevCountry) {
                    try {
                      recognitionRef.current?.start()
                    } catch (error: any) {
                      // Silently handle errors
                      if (error?.name !== "InvalidStateError" && !error?.message?.includes("already started")) {
                        // Only log unexpected errors
                      }
                    }
                  }
                  return prevCountry
                })
              }
            }, 300)
          }, 1500) // Wait 1.5 seconds after animation to show the incorrect answer
        }
      }
    }, 80) // 80ms per letter animation
  }

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check for speech recognition support
    const SpeechRecognition = 
      (window as any).webkitSpeechRecognition || 
      (window as any).SpeechRecognition ||
      null

    if (!SpeechRecognition) {
      setIsSpeechSupported(false)
      setSpeechError("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.")
      return
    }

    setIsSpeechSupported(true)
    
    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setSpeechError(null)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        if (event.results && event.results.length > 0 && event.results[0].length > 0) {
          const detectedTranscript = event.results[0][0].transcript.trim()
          setTranscript(detectedTranscript)
          setIsListening(false)
          // Small delay to show the detected text before checking answer
          setTimeout(() => {
            // Get the current country from state to avoid closure issues
            setCurrentCountry((country) => {
              if (country) {
                // Process answer directly here with fresh country value
                const cleanedAnswer = detectedTranscript
                  .trim()
                  .replace(/^["']|["']$/g, "")
                  .replace(/\.$/, "")
                  .trim()
                
                const correct = checkCountryAnswer(cleanedAnswer, country)
                setIsCorrect(correct)
                setShowAnswer(true)
                
                // Always animate to show correct answer, regardless of whether user was correct or not
                if (correct) {
                  // For correct answers, proceed to next country after animation completes
                  setScore(prev => prev + 1)
                  // Remove the country from available list
                  setAvailableCountries(prev => {
                    const updated = prev.filter(c => c.name !== country.name)
                    // Store in ref to avoid closure issues
                    nextCountriesRef.current = updated
                    console.log('Filtered countries and stored in ref:', updated.length, updated.map(c => c.name))
                    return updated
                  })
                  // Small delay to ensure state updates are processed before starting animation
                  setTimeout(() => {
                    animateToCorrect(country.name, () => {
                      // This callback runs after animation completes
                      console.log('Animation callback executing, moving to next country')
                      setQuestionNumber(prevNum => prevNum + 1)
                      setTranscript("")
                      setShowAnswer(false)
                      setIsCorrect(null)
                      // Get the filtered list from ref (should be set by now)
                      const countriesToUse = nextCountriesRef.current || []
                      console.log('Countries to use:', countriesToUse.length, countriesToUse)
                      // Call selectRandomCountry with the filtered list
                      selectRandomCountry(countriesToUse)
                    })
                  }, 200) // Small delay to ensure showAnswer state is set
                } else {
                  // For incorrect answers, just animate (restart listening is handled in animateToCorrect)
                  setTimeout(() => {
                    animateToCorrect(country.name)
                  }, 200) // Increased delay to ensure showAnswer state is set
                }
                // For incorrect answers, we'll reset state and restart listening after animation completes
                // This is handled in the animateToCorrect function
              }
              return country
            })
          }, 500)
        } else {
          setIsListening(false)
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
        
        let errorMessage = "Speech recognition error occurred."
        switch (event.error) {
          case "not-allowed":
            errorMessage = "Microphone permission denied. Please enable microphone access in your browser settings."
            break
          case "no-speech":
            errorMessage = "No speech detected. Please try again and speak clearly."
            break
          case "audio-capture":
            errorMessage = "No microphone found. Please check your microphone connection."
            break
          case "network":
            errorMessage = "Network error. Please check your internet connection."
            break
          case "aborted":
            errorMessage = "Speech recognition was aborted."
            break
          default:
            errorMessage = `Speech recognition error: ${event.error}`
        }
        setSpeechError(errorMessage)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    } catch (error) {
      console.error("Failed to initialize speech recognition:", error)
      setIsSpeechSupported(false)
      setSpeechError("Failed to initialize speech recognition. Please refresh the page.")
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (error) {
          // Ignore errors when stopping
        }
      }
    }
  }, [])

  // Initialize available countries when difficulty changes
  useEffect(() => {
    if (gameStarted) {
      const countriesByDifficulty = countries.filter(c => c.difficulty === currentDifficulty)
      if (countriesByDifficulty.length > 0 && availableCountries.length === 0) {
        setAvailableCountries([...countriesByDifficulty])
        selectRandomCountry(countriesByDifficulty)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDifficulty, gameStarted])

  // Auto-restart listening when not listening and game is active
  useEffect(() => {
    // Auto-restart if:
    // 1. Game is started and we have a country
    // 2. No answer shown yet (normal case) OR answer is shown but incorrect and animation is done (user can try again)
    // 3. Not currently listening
    // 4. No transcript being processed
    const shouldRestart = gameStarted && 
      currentCountry && 
      ((!showAnswer) || (showAnswer && !isCorrect && !isAnimating)) && 
      !isListening && 
      !transcript && 
      isSpeechSupported && 
      recognitionRef.current

    if (shouldRestart) {
      // Longer delay if showing incorrect answer (wait for animation to complete)
      const delay = showAnswer && !isCorrect ? 2500 : 800
      const timer = setTimeout(() => {
        // Double-check state hasn't changed before starting
        if (recognitionRef.current && !isListening && currentCountry) {
          try {
            recognitionRef.current.start()
          } catch (error: any) {
            // Silently ignore if already started - this is expected in some race conditions
            if (error?.name !== "InvalidStateError" && !error?.message?.includes("already started")) {
              // Only log unexpected errors
            }
          }
        }
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [gameStarted, currentCountry, showAnswer, isListening, transcript, isSpeechSupported, isCorrect, isAnimating])

  const selectRandomCountry = (countryList: Country[]) => {
    console.log('selectRandomCountry called with', countryList.length, 'countries')
    // Stop any ongoing recognition first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        // Ignore errors when stopping
      }
    }
    setIsListening(false)
    
    if (countryList.length === 0) {
      // Move to next difficulty if no countries left
      if (currentDifficulty < 5) {
        setCurrentDifficulty(prev => {
          const nextDifficulty = prev + 1
          const countriesByDifficulty = countries.filter(c => c.difficulty === nextDifficulty)
          if (countriesByDifficulty.length > 0) {
            setAvailableCountries([...countriesByDifficulty])
            const randomIndex = Math.floor(Math.random() * countriesByDifficulty.length)
            const selected = countriesByDifficulty[randomIndex]
            setCurrentCountry(selected)
            const jumbled = jumbleLetters(selected.name)
            setJumbledLetters(jumbled)
            setAnimatedLetters(jumbled)
            setIsAnimating(false)
            setShowAnswer(false)
            setIsCorrect(null)
            setTranscript("")
            setSpeechError(null)
            // Auto-start listening for new country
            setTimeout(() => {
              if (isSpeechSupported && recognitionRef.current) {
                startListening()
              }
            }, 500)
          }
          return nextDifficulty
        })
        return
      } else {
        // Game complete
        setCurrentCountry(null)
        if (onGameEnd) {
          onGameEnd()
        }
        return
      }
    }

    const randomIndex = Math.floor(Math.random() * countryList.length)
    const selected = countryList[randomIndex]
    console.log('Selecting new country:', selected.name)
    setCurrentCountry(selected)
    const jumbled = jumbleLetters(selected.name)
    setJumbledLetters(jumbled)
    setAnimatedLetters(jumbled)
    setIsAnimating(false)
    setShowAnswer(false)
    setIsCorrect(null)
    setTranscript("")
    setShowManualAnswer(false)
    setSpeechError(null)
    // Update available countries to match the list we're using
    setAvailableCountries(countryList)
    // Auto-start listening for new country
    setTimeout(() => {
      if (isSpeechSupported && recognitionRef.current) {
        startListening()
      }
    }, 500)
  }

  const checkAnswer = (userAnswer: string) => {
    if (!currentCountry) {
      return
    }

    // Clean the user answer - remove quotes, periods, and extra whitespace
    const cleanedAnswer = userAnswer
      .trim()
      .replace(/^["']|["']$/g, "") // Remove surrounding quotes
      .replace(/\.$/, "") // Remove trailing period
      .trim()

    const correct = checkCountryAnswer(cleanedAnswer, currentCountry)
    
    // Update state immediately
    setIsCorrect(correct)
    setShowAnswer(true)
    
    // Start animation when showing answer (with a small delay to ensure state is set)
    setTimeout(() => {
      if (currentCountry) {
        animateToCorrect(currentCountry.name)
      }
    }, 100)

    if (correct) {
      setScore(prev => prev + 1)
      // Remove the country from available list and get updated list
      setAvailableCountries(prev => {
        const updated = prev.filter(c => c.name !== currentCountry.name)
        
        // Auto-advance after 2 seconds
        setTimeout(() => {
          setQuestionNumber(prevNum => prevNum + 1)
          setTranscript("") // Clear transcript for next question
          selectRandomCountry(updated)
          // Auto-start listening for next question
          setTimeout(() => {
            if (isSpeechSupported && recognitionRef.current && !isListening) {
              startListening()
            }
          }, 300)
        }, 2000)
        
        return updated
      })
    }
  }

  const startListening = () => {
    if (!isSpeechSupported) {
      setSpeechError("Speech recognition is not supported in your browser.")
      return
    }

    if (!recognitionRef.current) {
      setSpeechError("Speech recognition is not initialized. Please refresh the page.")
      return
    }

    if (isListening) {
      return
    }

    try {
      setSpeechError(null)
      recognitionRef.current.start()
    } catch (error: any) {
      // Silently handle "already started" errors - this is expected in some cases
      if (error?.name === "InvalidStateError" || error?.message?.includes("already started")) {
        // Recognition is already running, which is fine
        return
      }
      // Only show error for unexpected errors
      setSpeechError("Failed to start voice recognition. Please try again.")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const handleNext = () => {
    setQuestionNumber(prev => prev + 1)
    setTranscript("") // Clear transcript for next question
    setShowManualAnswer(false)
    setAvailableCountries(prev => {
      const updated = prev.filter(c => currentCountry && c.name !== currentCountry.name)
      selectRandomCountry(updated)
      // Auto-restart listening for next question
      setTimeout(() => {
        if (isSpeechSupported && recognitionRef.current && !isListening) {
          startListening()
        }
      }, 500)
      return updated
    })
  }

  const handleShowAnswer = () => {
    if (!currentCountry) return
    
    setShowManualAnswer(true)
    setIsCorrect(false) // Mark as incorrect since they're using manual override
    setShowAnswer(true)
    stopListening() // Stop listening when showing answer
    
    // Start animation and proceed to next country after animation completes
    animateToCorrect(currentCountry.name, () => {
      // This callback runs after animation completes
      setQuestionNumber(prev => prev + 1)
      setTranscript("")
      setShowManualAnswer(false)
      setAvailableCountries(prev => {
        const updated = prev.filter(c => currentCountry && c.name !== currentCountry.name)
        selectRandomCountry(updated)
        return updated
      })
    })
  }

  const startGame = () => {
    setGameStarted(true)
    setCurrentDifficulty(1)
    setScore(0)
    setQuestionNumber(1)
    const countriesByDifficulty = countries.filter(c => c.difficulty === 1)
    setAvailableCountries([...countriesByDifficulty])
    selectRandomCountry(countriesByDifficulty)
    // Auto-start listening when game starts (with delay to ensure recognition is ready)
    setTimeout(() => {
      if (isSpeechSupported && recognitionRef.current) {
        startListening()
      }
    }, 800)
  }

  const speakCountry = () => {
    if (currentCountry && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(currentCountry.name)
      utterance.lang = "en-US"
      window.speechSynthesis.speak(utterance)
    }
  }

  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Random Country Game</CardTitle>
          <CardDescription className="text-lg">
            Test your geography knowledge! Answer the country names using your voice.
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
            <Button 
              onClick={() => {
                setGameStarted(false)
                setCurrentCountry(null)
                setScore(0)
                setQuestionNumber(0)
                setCurrentDifficulty(1)
              }} 
              size="lg" 
              className="flex-1"
            >
              Play Again
            </Button>
            {onGameEnd ? (
              <Button onClick={onGameEnd} size="lg" variant="outline" className="flex-1">
                Back to Games
              </Button>
            ) : (
              <Button onClick={() => router.push("/games")} size="lg" variant="outline" className="flex-1">
                Back to Games
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-between items-center mb-4">
          <div className="text-left">
            <p className="text-sm text-muted-foreground">Question {questionNumber}</p>
            <p className="text-sm text-muted-foreground">Score: {score}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Difficulty: {currentDifficulty}/5</p>
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
            {(!showAnswer ? jumbledLetters : animatedLetters.length > 0 ? animatedLetters : jumbledLetters).map((letter, index) => {
              const correctOrder = currentCountry.name.replace(/\s+/g, "").toUpperCase().split("")
              const isInCorrectPosition = showAnswer && !isAnimating && animatedLetters.length > 0 && animatedLetters[index] === correctOrder[index]
              
              return (
                <Badge
                  key={`jumbled-${letter}-${index}`}
                  variant="outline"
                  className={cn(
                    "font-bold px-4 py-2 min-w-[3rem] text-center border-2 transition-all duration-300",
                    letterSize === "large" ? "text-4xl min-w-[4rem] px-6 py-4" : "text-2xl",
                    showAnswer && isInCorrectPosition && isCorrect
                      ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400 scale-110"
                      : showAnswer && isAnimating
                      ? "bg-accent/20 border-accent/50 animate-pulse"
                      : showAnswer && !isCorrect && !isAnimating
                      ? "bg-red-500/20 border-red-500 text-red-700 dark:text-red-400"
                      : "bg-secondary border-accent/30 hover:border-accent/50"
                  )}
                  style={{
                    transition: "all 0.3s ease-in-out",
                  }}
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

        {transcript && !showManualAnswer && showAnswer && (
          <div className="w-full p-3 bg-muted/50 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              You said: <span className="font-medium text-foreground">"{transcript}"</span>
            </p>
          </div>
        )}

        {showManualAnswer && (
          <div className="w-full p-3 bg-blue-50 dark:bg-blue-950 border border-blue-500 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
              Answer revealed. Moving to next question in 3 seconds...
            </p>
          </div>
        )}

        {showAnswer && isCorrect && !showManualAnswer && (
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
                  ⚠️ Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
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
              <div className="flex justify-center">
                <Mic className="h-6 w-6 text-orange-500 animate-pulse" />
              </div>
            )}
            {!isListening && !showAnswer && isSpeechSupported && transcript === "" && (
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
            
            {/* Show detected speech text - only show if answer hasn't been processed yet */}
            {transcript && !showAnswer && (
              <div className="w-full p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Detected:</p>
                <p className="text-lg font-semibold text-foreground">
                  "{transcript}"
                </p>
                <p className="text-xs text-muted-foreground mt-2 animate-pulse">
                  Processing your answer...
                </p>
              </div>
            )}
            
            {/* Show Answer button for manual override */}
            {!showAnswer && (
              <Button
                onClick={handleShowAnswer}
                size="lg"
                variant="outline"
                className="w-full border-dashed"
              >
                Show Answer
              </Button>
            )}
          </div>
        )}

        {showAnswer && !isCorrect && !showManualAnswer && (
          <Button onClick={handleNext} size="lg" className="w-full" variant="outline">
            <ArrowRight className="mr-2 h-5 w-5" />
            Next Question
          </Button>
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
  start(): void
  stop(): void
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

