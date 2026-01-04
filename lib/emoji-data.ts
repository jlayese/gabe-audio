export interface EmojiSongPuzzle {
  id: string
  emoji: string
  answer: string
  artist: string
  category: "Party Classics" | "Rock" | "Pop" | "Hip Hop" | "R&B" | "Country" | "Jazz" | "Electronic"
  difficulty: "easy" | "medium" | "hard"
  alternativeAnswers?: string[]
}

export const emojiSongPuzzles: EmojiSongPuzzle[] = [
  // Party Classics
  { id: "song-1", emoji: "💃🕺👑", answer: "Dancing Queen", artist: "ABBA", category: "Party Classics", difficulty: "easy" },
  { id: "song-2", emoji: "🎉🎊", answer: "Celebration", artist: "Kool & The Gang", category: "Party Classics", difficulty: "easy" },
  { id: "song-3", emoji: "🕺🌙", answer: "Stayin' Alive", artist: "Bee Gees", category: "Party Classics", difficulty: "easy", alternativeAnswers: ["Staying Alive"] },
  { id: "song-4", emoji: "💃🕺", answer: "Dancing in the Street", artist: "Martha and the Vandellas", category: "Party Classics", difficulty: "easy" },
  { id: "song-5", emoji: "🎤🎵", answer: "I Will Survive", artist: "Gloria Gaynor", category: "Party Classics", difficulty: "easy" },
  { id: "song-6", emoji: "🕺🔥", answer: "Hot Stuff", artist: "Donna Summer", category: "Party Classics", difficulty: "easy" },
  { id: "song-7", emoji: "💃💃", answer: "Girls Just Want to Have Fun", artist: "Cyndi Lauper", category: "Party Classics", difficulty: "easy" },
  { id: "song-8", emoji: "🎉🎵", answer: "Party Rock Anthem", artist: "LMFAO", category: "Party Classics", difficulty: "easy" },
  { id: "song-9", emoji: "🕺🌃", answer: "Night Fever", artist: "Bee Gees", category: "Party Classics", difficulty: "easy" },
  { id: "song-10", emoji: "💃💫", answer: "Super Freak", artist: "Rick James", category: "Party Classics", difficulty: "easy" },
  
  // Rock
  { id: "song-11", emoji: "🔥❤️", answer: "Burning Love", artist: "Elvis Presley", category: "Rock", difficulty: "easy" },
  { id: "song-12", emoji: "👁️🐯", answer: "Eye of the Tiger", artist: "Survivor", category: "Rock", difficulty: "easy" },
  { id: "song-13", emoji: "🎸🔥", answer: "Highway to Hell", artist: "AC/DC", category: "Rock", difficulty: "easy" },
  { id: "song-14", emoji: "⚡👑", answer: "Thunderstruck", artist: "AC/DC", category: "Rock", difficulty: "easy" },
  { id: "song-15", emoji: "🎸🤘", answer: "Sweet Child O' Mine", artist: "Guns N' Roses", category: "Rock", difficulty: "easy", alternativeAnswers: ["Sweet Child of Mine"] },
  { id: "song-16", emoji: "🔥🚗", answer: "Born to Be Wild", artist: "Steppenwolf", category: "Rock", difficulty: "easy" },
  { id: "song-17", emoji: "🎸⭐", answer: "Stairway to Heaven", artist: "Led Zeppelin", category: "Rock", difficulty: "medium" },
  { id: "song-18", emoji: "🤘🔥", answer: "We Will Rock You", artist: "Queen", category: "Rock", difficulty: "easy" },
  { id: "song-19", emoji: "👑🎸", answer: "Bohemian Rhapsody", artist: "Queen", category: "Rock", difficulty: "medium" },
  { id: "song-20", emoji: "🎸🌙", answer: "Hotel California", artist: "Eagles", category: "Rock", difficulty: "easy" },
  
  // Pop
  { id: "song-21", emoji: "🌧️☔", answer: "Purple Rain", artist: "Prince", category: "Pop", difficulty: "easy" },
  { id: "song-22", emoji: "🕺🌙", answer: "Blinding Lights", artist: "The Weeknd", category: "Pop", difficulty: "easy", alternativeAnswers: ["Blinding Light"] },
  { id: "song-23", emoji: "💃💃", answer: "Single Ladies", artist: "Beyoncé", category: "Pop", difficulty: "easy", alternativeAnswers: ["Single Ladies (Put a Ring on It)"] },
  { id: "song-24", emoji: "🎤💫", answer: "Shake It Off", artist: "Taylor Swift", category: "Pop", difficulty: "easy" },
  { id: "song-25", emoji: "💃🌙", answer: "Bad Moon Rising", artist: "Creedence Clearwater Revival", category: "Pop", difficulty: "easy" },
  { id: "song-26", emoji: "⭐💫", answer: "Shooting Star", artist: "Bad Company", category: "Pop", difficulty: "easy" },
  { id: "song-27", emoji: "🎤❤️", answer: "Love Story", artist: "Taylor Swift", category: "Pop", difficulty: "easy" },
  { id: "song-28", emoji: "💃🔥", answer: "Firework", artist: "Katy Perry", category: "Pop", difficulty: "easy" },
  { id: "song-29", emoji: "🎵💫", answer: "Shape of You", artist: "Ed Sheeran", category: "Pop", difficulty: "easy" },
  { id: "song-30", emoji: "🎤🌙", answer: "Midnight Sky", artist: "Miley Cyrus", category: "Pop", difficulty: "easy" },
  
  // Hip Hop
  { id: "song-31", emoji: "💰💎", answer: "Diamonds", artist: "Rihanna", category: "Hip Hop", difficulty: "easy" },
  { id: "song-32", emoji: "🔥💯", answer: "Hotline Bling", artist: "Drake", category: "Hip Hop", difficulty: "easy" },
  { id: "song-33", emoji: "👑🎤", answer: "Empire State of Mind", artist: "Jay-Z ft. Alicia Keys", category: "Hip Hop", difficulty: "easy" },
  { id: "song-34", emoji: "💰💰", answer: "Money Trees", artist: "Kendrick Lamar", category: "Hip Hop", difficulty: "easy" },
  { id: "song-35", emoji: "🔥🎤", answer: "Lose Yourself", artist: "Eminem", category: "Hip Hop", difficulty: "easy" },
  { id: "song-36", emoji: "💪🔥", answer: "Stronger", artist: "Kanye West", category: "Hip Hop", difficulty: "easy" },
  { id: "song-37", emoji: "👑💎", answer: "All of the Lights", artist: "Kanye West", category: "Hip Hop", difficulty: "easy" },
  { id: "song-38", emoji: "🎤💯", answer: "In Da Club", artist: "50 Cent", category: "Hip Hop", difficulty: "easy" },
  { id: "song-39", emoji: "🔥🌙", answer: "Hot in Herre", artist: "Nelly", category: "Hip Hop", difficulty: "easy" },
  { id: "song-40", emoji: "💰🎤", answer: "Money", artist: "Pink Floyd", category: "Hip Hop", difficulty: "easy" },
  
  // R&B
  { id: "song-41", emoji: "❤️🔥", answer: "Let's Get It On", artist: "Marvin Gaye", category: "R&B", difficulty: "easy" },
  { id: "song-42", emoji: "💃🌙", answer: "Midnight Train to Georgia", artist: "Gladys Knight & The Pips", category: "R&B", difficulty: "easy" },
  { id: "song-43", emoji: "🎤❤️", answer: "I Will Always Love You", artist: "Whitney Houston", category: "R&B", difficulty: "easy" },
  { id: "song-44", emoji: "💃💫", answer: "Superstition", artist: "Stevie Wonder", category: "R&B", difficulty: "easy" },
  { id: "song-45", emoji: "🎵❤️", answer: "Endless Love", artist: "Lionel Richie & Diana Ross", category: "R&B", difficulty: "easy" },
  { id: "song-46", emoji: "💃🔥", answer: "Respect", artist: "Aretha Franklin", category: "R&B", difficulty: "easy" },
  { id: "song-47", emoji: "🎤🌙", answer: "At Last", artist: "Etta James", category: "R&B", difficulty: "easy" },
  { id: "song-48", emoji: "❤️💫", answer: "My Girl", artist: "The Temptations", category: "R&B", difficulty: "easy" },
  { id: "song-49", emoji: "💃🎵", answer: "Ain't No Mountain High Enough", artist: "Marvin Gaye & Tammi Terrell", category: "R&B", difficulty: "easy" },
  { id: "song-50", emoji: "🎤❤️", answer: "I Heard It Through the Grapevine", artist: "Marvin Gaye", category: "R&B", difficulty: "medium" },
  
  // Country
  { id: "song-51", emoji: "🎸🤠", answer: "Friends in Low Places", artist: "Garth Brooks", category: "Country", difficulty: "easy" },
  { id: "song-52", emoji: "🚗🏠", answer: "Take Me Home, Country Roads", artist: "John Denver", category: "Country", difficulty: "easy" },
  { id: "song-53", emoji: "🎸🌙", answer: "Wagon Wheel", artist: "Darius Rucker", category: "Country", difficulty: "easy" },
  { id: "song-54", emoji: "🤠🎤", answer: "Ring of Fire", artist: "Johnny Cash", category: "Country", difficulty: "easy" },
  { id: "song-55", emoji: "🎸❤️", answer: "Jolene", artist: "Dolly Parton", category: "Country", difficulty: "easy" },
  { id: "song-56", emoji: "🚗💨", answer: "Life Is a Highway", artist: "Rascal Flatts", category: "Country", difficulty: "easy" },
  { id: "song-57", emoji: "🎸⭐", answer: "The Gambler", artist: "Kenny Rogers", category: "Country", difficulty: "easy" },
  { id: "song-58", emoji: "🤠🔥", answer: "Achy Breaky Heart", artist: "Billy Ray Cyrus", category: "Country", difficulty: "easy" },
  { id: "song-59", emoji: "🎸🌙", answer: "Tennessee Whiskey", artist: "Chris Stapleton", category: "Country", difficulty: "easy" },
  { id: "song-60", emoji: "🎤🤠", answer: "Before He Cheats", artist: "Carrie Underwood", category: "Country", difficulty: "easy" },
  
  // Jazz
  { id: "song-61", emoji: "🎺🌙", answer: "Take Five", artist: "Dave Brubeck", category: "Jazz", difficulty: "medium" },
  { id: "song-62", emoji: "🎹🌙", answer: "Moonlight Serenade", artist: "Glenn Miller", category: "Jazz", difficulty: "easy" },
  { id: "song-63", emoji: "🎺💫", answer: "So What", artist: "Miles Davis", category: "Jazz", difficulty: "medium" },
  { id: "song-64", emoji: "🎹🎵", answer: "Autumn Leaves", artist: "Cannonball Adderley", category: "Jazz", difficulty: "medium" },
  { id: "song-65", emoji: "🎺🌙", answer: "Blue Moon", artist: "Various Artists", category: "Jazz", difficulty: "easy" },
  { id: "song-66", emoji: "🎹💫", answer: "Take the A Train", artist: "Duke Ellington", category: "Jazz", difficulty: "medium" },
  { id: "song-67", emoji: "🎺🔥", answer: "In the Mood", artist: "Glenn Miller", category: "Jazz", difficulty: "easy" },
  { id: "song-68", emoji: "🎹🌙", answer: "Round Midnight", artist: "Thelonious Monk", category: "Jazz", difficulty: "medium" },
  { id: "song-69", emoji: "🎺💫", answer: "Kind of Blue", artist: "Miles Davis", category: "Jazz", difficulty: "medium" },
  { id: "song-70", emoji: "🎹🎵", answer: "Summertime", artist: "Ella Fitzgerald", category: "Jazz", difficulty: "easy" },
  
  // Electronic
  { id: "song-71", emoji: "💃🔥", answer: "Sandstorm", artist: "Darude", category: "Electronic", difficulty: "easy" },
  { id: "song-72", emoji: "🎵💫", answer: "One More Time", artist: "Daft Punk", category: "Electronic", difficulty: "easy" },
  { id: "song-73", emoji: "💃🌙", answer: "Midnight City", artist: "M83", category: "Electronic", difficulty: "easy" },
  { id: "song-74", emoji: "🎵🔥", answer: "Firestarter", artist: "The Prodigy", category: "Electronic", difficulty: "easy" },
  { id: "song-75", emoji: "💃💫", answer: "Around the World", artist: "Daft Punk", category: "Electronic", difficulty: "easy" },
  { id: "song-76", emoji: "🎵🌙", answer: "Strobe", artist: "Deadmau5", category: "Electronic", difficulty: "medium" },
  { id: "song-77", emoji: "💃🎵", answer: "Levels", artist: "Avicii", category: "Electronic", difficulty: "easy" },
  { id: "song-78", emoji: "🎵🔥", answer: "Wake Me Up", artist: "Avicii", category: "Electronic", difficulty: "easy" },
  { id: "song-79", emoji: "💃💫", answer: "Titanium", artist: "David Guetta ft. Sia", category: "Electronic", difficulty: "easy" },
  { id: "song-80", emoji: "🎵🌙", answer: "Midnight", artist: "Coldplay", category: "Electronic", difficulty: "easy" },
  
  // More Party Classics
  { id: "song-81", emoji: "🎉🎊💃", answer: "I Gotta Feeling", artist: "The Black Eyed Peas", category: "Party Classics", difficulty: "easy" },
  { id: "song-82", emoji: "🕺💃", answer: "Uptown Funk", artist: "Bruno Mars", category: "Party Classics", difficulty: "easy" },
  { id: "song-83", emoji: "🎤🎉", answer: "Don't Stop Believin'", artist: "Journey", category: "Party Classics", difficulty: "easy", alternativeAnswers: ["Don't Stop Believing"] },
  { id: "song-84", emoji: "💃🔥", answer: "Dynamite", artist: "BTS", category: "Party Classics", difficulty: "easy" },
  { id: "song-85", emoji: "🕺🎵", answer: "Can't Stop the Feeling", artist: "Justin Timberlake", category: "Party Classics", difficulty: "easy" },
  
  // More Rock
  { id: "song-86", emoji: "🎸⭐", answer: "Stairway to Heaven", artist: "Led Zeppelin", category: "Rock", difficulty: "medium" },
  { id: "song-87", emoji: "🔥🎸", answer: "Smoke on the Water", artist: "Deep Purple", category: "Rock", difficulty: "easy" },
  { id: "song-88", emoji: "🎸🌙", answer: "Hotel California", artist: "Eagles", category: "Rock", difficulty: "easy" },
  { id: "song-89", emoji: "🤘🔥", answer: "Enter Sandman", artist: "Metallica", category: "Rock", difficulty: "easy" },
  { id: "song-90", emoji: "🎸💫", answer: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", category: "Rock", difficulty: "easy" },
  
  // More Pop
  { id: "song-91", emoji: "💃💫", answer: "Bad Romance", artist: "Lady Gaga", category: "Pop", difficulty: "easy" },
  { id: "song-92", emoji: "🎤❤️", answer: "Someone Like You", artist: "Adele", category: "Pop", difficulty: "easy" },
  { id: "song-93", emoji: "💃🔥", answer: "Roar", artist: "Katy Perry", category: "Pop", difficulty: "easy" },
  { id: "song-94", emoji: "🎵💫", answer: "Happy", artist: "Pharrell Williams", category: "Pop", difficulty: "easy" },
  { id: "song-95", emoji: "🎤🌙", answer: "Hello", artist: "Adele", category: "Pop", difficulty: "easy" },
  
  // More Hip Hop
  { id: "song-96", emoji: "💰🔥", answer: "Money", artist: "Cardi B", category: "Hip Hop", difficulty: "easy" },
  { id: "song-97", emoji: "👑🎤", answer: "God's Plan", artist: "Drake", category: "Hip Hop", difficulty: "easy" },
  { id: "song-98", emoji: "🔥💯", answer: "Sicko Mode", artist: "Travis Scott", category: "Hip Hop", difficulty: "easy" },
  { id: "song-99", emoji: "🎤💫", answer: "Old Town Road", artist: "Lil Nas X", category: "Hip Hop", difficulty: "easy" },
  { id: "song-100", emoji: "💰🎤", answer: "Mo Money Mo Problems", artist: "The Notorious B.I.G.", category: "Hip Hop", difficulty: "easy" },
]

export function checkEmojiAnswer(userAnswer: string, puzzle: EmojiSongPuzzle): boolean {
  const normalizedUser = userAnswer.trim().toLowerCase()
  const normalizedCorrect = puzzle.answer.toLowerCase()
  
  // Check exact match
  if (normalizedUser === normalizedCorrect) {
    return true
  }
  
  // Check alternative answers
  if (puzzle.alternativeAnswers) {
    for (const alt of puzzle.alternativeAnswers) {
      if (normalizedUser === alt.toLowerCase()) {
        return true
      }
    }
  }
  
  // Check if user answer contains the correct answer (for partial matches)
  if (normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser)) {
    return true
  }
  
  return false
}

export function getRandomPuzzle(puzzles: EmojiSongPuzzle[], excludeIds: string[] = []): EmojiSongPuzzle | null {
  const available = puzzles.filter(p => !excludeIds.includes(p.id))
  if (available.length === 0) return null
  const randomIndex = Math.floor(Math.random() * available.length)
  return available[randomIndex]
}
