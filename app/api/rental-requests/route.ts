// Mock storage for rental requests
const rentalRequests: any[] = []

export async function POST(request: Request) {
  const body = await request.json()

  const rentalRequest = {
    id: Math.random().toString(36).substring(7),
    ...body,
    createdAt: new Date().toISOString(),
    status: "pending",
  }

  rentalRequests.push(rentalRequest)

  return Response.json(rentalRequest, { status: 201 })
}

export async function GET() {
  return Response.json(rentalRequests)
}
