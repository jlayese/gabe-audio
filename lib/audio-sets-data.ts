// Shared audio sets data
export const audioSetsData = [
  {
    id: "set-a",
    name: "Audio Set A",
    description: "Perfect for small events and studio setups",
    price: 2000,
    duration: "Up to 8 hours",
    image: "/professional-audio-amplifier-speakers-mixer-microp.jpg",
    equipment: [
      { id: "eq-1", name: "Amplifier", description: "High-power audio amplifier", quantity: 1 },
      { id: "eq-2", name: "Speakers (Pair)", description: "Quality active speakers", quantity: 2 },
      { id: "eq-3", name: "Mixer", description: "8-channel audio mixer", quantity: 1 },
      { id: "eq-4", name: "Quality Wireless Microphones (Pair)", description: "Quality wireless microphones", quantity: 1 },
    ],
    note: "TV display available as add-on",
  },
  {
    id: "set-b",
    name: "Audio Set B",
    description: "Audio Set A equipment plus TJ Media Supremo",
    price: 3000,
    duration: "Up to 8 hours",
    image: "/professional-dj-equipment-mixer-turntables.jpg",
    equipment: [
      { id: "eq-1", name: "Amplifier", description: "High-power audio amplifier", quantity: 1 },
      { id: "eq-2", name: "Speakers (Pair)", description: "Quality active speakers", quantity: 2 },
      { id: "eq-3", name: "Mixer", description: "8-channel audio mixer", quantity: 1 },
      { id: "eq-4", name: "Quality Wireless Microphones (Pair)", description: "Quality wireless microphones", quantity: 1 },
      { id: "eq-5", name: "TJ Media Supremo Unit", description: "Advanced audio processor", quantity: 1 },
    ],
  },
  {
    id: "set-c",
    name: "Audio Set C",
    description: "Complete solution with TJ Media, speakers, and smart TV display",
    price: 4000,
    duration: "Up to 8 hours",
    image: "/professional-audio-system-with-large-display-scree.jpg",
    equipment: [
      { id: "eq-1", name: "Amplifier", description: "High-power audio amplifier", quantity: 1 },
      { id: "eq-2", name: "Speakers (Pair)", description: "Quality active speakers", quantity: 2 },
      { id: "eq-3", name: "Mixer", description: "8-channel audio mixer", quantity: 1 },
      { id: "eq-4", name: "Quality Wireless Microphones (Pair)", description: "Quality wireless microphones", quantity: 1 },
      {
        id: "eq-5",
        name: "TJ Media Supremo Pro",
        description: "Quality audio processor with display",
        quantity: 1,
      },
      { id: "eq-11", name: "Smart TV Display", description: "32-inch 4K display for visual content", quantity: 1 },
    ],
  },
]

export function getAudioSetById(id: string) {
  return audioSetsData.find((set) => set.id === id) || null
}

