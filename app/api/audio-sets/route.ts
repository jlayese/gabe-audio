// Mock data for audio equipment rental sets
const audioSets = [
  {
    id: "set-a",
    name: "Audio Set A",
    description: "Perfect for small events and studio setups",
    price: 299,
    image: "/professional-audio-amplifier-speakers-mixer-microp.jpg",
    equipment: [
      { id: "eq-1", name: "Amplifier", description: "High-power audio amplifier", quantity: 1 },
      { id: "eq-2", name: "Speakers (Pair)", description: "Professional active speakers", quantity: 2 },
      { id: "eq-3", name: "Mixer", description: "8-channel audio mixer", quantity: 1 },
      { id: "eq-4", name: "Microphone", description: "Professional condenser microphone", quantity: 1 },
    ],
  },
  {
    id: "set-b",
    name: "Audio Set B",
    description: "Enhanced setup with TJ Media Supremo components",
    price: 599,
    image: "/professional-dj-equipment-mixer-turntables.jpg",
    equipment: [
      { id: "eq-5", name: "TJ Media Supremo Unit", description: "Advanced audio processor", quantity: 1 },
      { id: "eq-6", name: "Professional Mixer", description: "16-channel digital mixer", quantity: 1 },
      { id: "eq-7", name: "Speakers (4x)", description: "Studio-grade speakers", quantity: 4 },
      { id: "eq-8", name: "Amplifier Rack", description: "Multi-channel amplifier system", quantity: 1 },
      { id: "eq-9", name: "Microphones (2x)", description: "Dynamic and condenser mics", quantity: 2 },
    ],
  },
  {
    id: "set-c",
    name: "Audio Set C",
    description: "Complete solution with TJ Media, speakers, and premium TV display",
    price: 999,
    image: "/professional-audio-system-with-large-display-scree.jpg",
    equipment: [
      {
        id: "eq-10",
        name: "TJ Media Supremo Pro",
        description: "Professional audio processor with display",
        quantity: 1,
      },
      { id: "eq-11", name: "Premium TV Display", description: "65-inch 4K display for visual content", quantity: 1 },
      { id: "eq-12", name: "Professional Mixer", description: "24-channel mixer with DSP", quantity: 1 },
      { id: "eq-13", name: "Speaker System (6x)", description: "High-end surround speakers", quantity: 6 },
      { id: "eq-14", name: "Amplifier Rack Pro", description: "Enterprise-grade amplifier system", quantity: 1 },
      { id: "eq-15", name: "Microphones (4x)", description: "Wireless and wired microphone set", quantity: 4 },
      { id: "eq-16", name: "Cables and Connectors", description: "Complete connectivity kit", quantity: 1 },
    ],
  },
]

export async function GET() {
  return Response.json(audioSets)
}
