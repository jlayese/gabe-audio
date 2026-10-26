// Countries data organized by difficulty (easiest to hardest)
export interface Country {
  name: string
  difficulty: 1 | 2 | 3 | 4 | 5 // 1 = easiest, 5 = hardest
  alternativeNames?: string[] // Alternative names that should be accepted
}

export const countries: Country[] = [
  // Difficulty 1 - Easiest (Most well-known countries)
  { name: "United States", difficulty: 1, alternativeNames: ["USA", "America", "United States of America"] },
  { name: "United Kingdom", difficulty: 1, alternativeNames: ["UK", "Britain", "Great Britain", "England"] },
  { name: "France", difficulty: 1 },
  { name: "Germany", difficulty: 1 },
  { name: "Italy", difficulty: 1 },
  { name: "Spain", difficulty: 1 },
  { name: "Japan", difficulty: 1 },
  { name: "China", difficulty: 1 },
  { name: "Canada", difficulty: 1 },
  { name: "Australia", difficulty: 1 },
  { name: "Brazil", difficulty: 1 },
  { name: "Mexico", difficulty: 1 },
  { name: "India", difficulty: 1 },
  { name: "Russia", difficulty: 1 },
  { name: "South Korea", difficulty: 1, alternativeNames: ["Korea", "South Korea"] },
  
  // Difficulty 2 - Easy (Well-known but less common)
  { name: "Netherlands", difficulty: 2, alternativeNames: ["Holland"] },
  { name: "Belgium", difficulty: 2 },
  { name: "Switzerland", difficulty: 2 },
  { name: "Sweden", difficulty: 2 },
  { name: "Norway", difficulty: 2 },
  { name: "Denmark", difficulty: 2 },
  { name: "Poland", difficulty: 2 },
  { name: "Greece", difficulty: 2 },
  { name: "Portugal", difficulty: 2 },
  { name: "Turkey", difficulty: 2 },
  { name: "Egypt", difficulty: 2 },
  { name: "South Africa", difficulty: 2 },
  { name: "Argentina", difficulty: 2 },
  { name: "Chile", difficulty: 2 },
  { name: "Thailand", difficulty: 2 },
  { name: "Vietnam", difficulty: 2 },
  { name: "Philippines", difficulty: 2 },
  { name: "Indonesia", difficulty: 2 },
  { name: "Malaysia", difficulty: 2 },
  { name: "Singapore", difficulty: 2 },
  
  // Difficulty 3 - Medium
  { name: "Austria", difficulty: 3 },
  { name: "Finland", difficulty: 3 },
  { name: "Ireland", difficulty: 3 },
  { name: "Czech Republic", difficulty: 3, alternativeNames: ["Czechia"] },
  { name: "Hungary", difficulty: 3 },
  { name: "Romania", difficulty: 3 },
  { name: "Bulgaria", difficulty: 3 },
  { name: "Croatia", difficulty: 3 },
  { name: "New Zealand", difficulty: 3 },
  { name: "Peru", difficulty: 3 },
  { name: "Colombia", difficulty: 3 },
  { name: "Venezuela", difficulty: 3 },
  { name: "Morocco", difficulty: 3 },
  { name: "Tunisia", difficulty: 3 },
  { name: "Kenya", difficulty: 3 },
  { name: "Bangladesh", difficulty: 3 },
  { name: "Pakistan", difficulty: 3 },
  { name: "Sri Lanka", difficulty: 3 },
  { name: "Myanmar", difficulty: 3, alternativeNames: ["Burma"] },
  { name: "Cambodia", difficulty: 3 },
  
  // Difficulty 4 - Hard
  { name: "Slovakia", difficulty: 4 },
  { name: "Slovenia", difficulty: 4 },
  { name: "Lithuania", difficulty: 4 },
  { name: "Latvia", difficulty: 4 },
  { name: "Estonia", difficulty: 4 },
  { name: "Luxembourg", difficulty: 4 },
  { name: "Iceland", difficulty: 4 },
  { name: "Uruguay", difficulty: 4 },
  { name: "Paraguay", difficulty: 4 },
  { name: "Bolivia", difficulty: 4 },
  { name: "Ecuador", difficulty: 4 },
  { name: "Guatemala", difficulty: 4 },
  { name: "Costa Rica", difficulty: 4 },
  { name: "Panama", difficulty: 4 },
  { name: "Algeria", difficulty: 4 },
  { name: "Libya", difficulty: 4 },
  { name: "Sudan", difficulty: 4 },
  { name: "Ethiopia", difficulty: 4 },
  { name: "Tanzania", difficulty: 4 },
  { name: "Ghana", difficulty: 4 },
  { name: "Nepal", difficulty: 4 },
  { name: "Bhutan", difficulty: 4 },
  { name: "Laos", difficulty: 4 },
  { name: "Mongolia", difficulty: 4 },
  { name: "Kazakhstan", difficulty: 4 },
  
  // Difficulty 5 - Hardest (Less commonly known)
  { name: "Moldova", difficulty: 5 },
  { name: "Belarus", difficulty: 5 },
  { name: "North Macedonia", difficulty: 5, alternativeNames: ["Macedonia"] },
  { name: "Montenegro", difficulty: 5 },
  { name: "Bosnia and Herzegovina", difficulty: 5, alternativeNames: ["Bosnia"] },
  { name: "Serbia", difficulty: 5 },
  { name: "Albania", difficulty: 5 },
  { name: "Georgia", difficulty: 5 },
  { name: "Armenia", difficulty: 5 },
  { name: "Azerbaijan", difficulty: 5 },
  { name: "Kyrgyzstan", difficulty: 5 },
  { name: "Tajikistan", difficulty: 5 },
  { name: "Turkmenistan", difficulty: 5 },
  { name: "Uzbekistan", difficulty: 5 },
  { name: "Belize", difficulty: 5 },
  { name: "Honduras", difficulty: 5 },
  { name: "Nicaragua", difficulty: 5 },
  { name: "El Salvador", difficulty: 5 },
  { name: "Haiti", difficulty: 5 },
  { name: "Jamaica", difficulty: 5 },
  { name: "Trinidad and Tobago", difficulty: 5 },
  { name: "Guyana", difficulty: 5 },
  { name: "Suriname", difficulty: 5 },
  { name: "Madagascar", difficulty: 5 },
  { name: "Mauritius", difficulty: 5 },
  { name: "Rwanda", difficulty: 5 },
  { name: "Uganda", difficulty: 5 },
  { name: "Zimbabwe", difficulty: 5 },
  { name: "Botswana", difficulty: 5 },
  { name: "Namibia", difficulty: 5 },
  { name: "Maldives", difficulty: 5 },
  { name: "Brunei", difficulty: 5 },
  { name: "East Timor", difficulty: 5, alternativeNames: ["Timor-Leste"] },
  { name: "Papua New Guinea", difficulty: 5 },
]

// Helper function to get countries by difficulty
export const getCountriesByDifficulty = (difficulty: number): Country[] => {
  return countries.filter(country => country.difficulty === difficulty)
}

// Lowercase, strip accents and punctuation, and collapse whitespace
const normalizeAnswer = (text: string): string =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[.'’]/g, "")
    .replace(/[^a-z]+/g, " ")
    .trim()

// Filler words speech recognition often adds around the actual answer
const FILLER_PREFIXES = ["i think its", "i think it is", "its", "it is", "is it", "the answer is", "answer", "the"]

const stripFiller = (text: string): string => {
  let result = text
  let changed = true
  while (changed) {
    changed = false
    for (const prefix of FILLER_PREFIXES) {
      if (result.startsWith(prefix + " ")) {
        result = result.slice(prefix.length + 1)
        changed = true
      }
    }
  }
  return result
}

// Helper function to check if an answer matches a country
export const checkCountryAnswer = (userAnswer: string, country: Country): boolean => {
  const normalized = normalizeAnswer(userAnswer)
  if (!normalized) return false

  const accepted = [country.name, ...(country.alternativeNames ?? [])].map(normalizeAnswer)
  return accepted.includes(normalized) || accepted.includes(stripFiller(normalized))
}
