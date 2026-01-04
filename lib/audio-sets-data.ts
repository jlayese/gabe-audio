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
      { id: "eq-1", name: "Amplifier", description: "High-power audio amplifier", brand: "M-Audio", model: "MA-1000", quantity: 1 },
      { id: "eq-2", name: "Speakers (Pair)", description: "Quality active speakers", brand: "Kevler", model: "ZLX15", quantity: 2 },
      { id: "eq-3", name: "Mixer", description: "10-channel audio mixer with USB", brand: "Yamaha", model: "MG10XU", quantity: 1 },
      { id: "eq-4", name: "Quality Wireless Microphones (Pair)", description: "Quality wireless microphones", brand: "Kevler", model: "URX-2H", quantity: 1 },
    ],
    // note: "TV display available as add-on",
  },
  {
    id: "set-b",
    name: "Audio Set B",
    description: "Audio Set A equipment plus TJ Media Supremo",
    price: 3000,
    duration: "Up to 8 hours",
    image: "/professional-dj-equipment-mixer-turntables.jpg",
    equipment: [
      { id: "eq-1", name: "Amplifier", description: "High-power audio amplifier", brand: "M-Audio", model: "MA-1000", quantity: 1 },
      { id: "eq-2", name: "Speakers (Pair)", description: "Quality active speakers", brand: "Kevler", model: "ZLX15", quantity: 2 },
      { id: "eq-3", name: "Mixer", description: "10-channel audio mixer with USB", brand: "Yamaha", model: "MG10XU", quantity: 1 },
      { id: "eq-4", name: "Quality Wireless Microphones (Pair)", description: "Quality wireless microphones", brand: "Kevler", model: "URX-2H", quantity: 1 },
      { id: "eq-5", name: "TJ Media Supremo Unit", description: "Advanced audio processor", brand: "TJ Media", model: "Supremo", quantity: 1 },
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
      { id: "eq-1", name: "Amplifier", description: "High-power audio amplifier", brand: "M-Audio", model: "MA-1000", quantity: 1 },
      { id: "eq-2", name: "Speakers (Pair)", description: "Quality active speakers", brand: "Kevler", model: "ZLX15", quantity: 2 },
      { id: "eq-3", name: "Mixer", description: "10-channel audio mixer with USB", brand: "Yamaha", model: "MG10XU", quantity: 1 },
      { id: "eq-4", name: "Quality Wireless Microphones (Pair)", description: "Quality wireless microphones", brand: "Kevler", model: "URX-2H", quantity: 1 },
      {
        id: "eq-5",
        name: "TJ Media Supremo Unit",
        description: "Advanced audio processor",
        brand: "TJ Media",
        model: "Supremo",
        quantity: 1,
      },
      { id: "eq-11", name: "Smart TV Display", description: "32-inch 4K display for visual content", brand: "Samsung", model: "32-inch 4K Smart TV", quantity: 1 },
    ],
  },
]

export function getAudioSetById(id: string) {
  return audioSetsData.find((set) => set.id === id) || null
}

