import { sendNotificationEmail, generateCustomerEmail, generateAdminEmail } from "@/lib/email";

// Mock storage for rental requests
const rentalRequests: any[] = []

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.setId || !body.rentalDate || !body.returnDate) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rentalRequest = {
      id: Math.random().toString(36).substring(7),
      ...body,
      createdAt: new Date().toISOString(),
      status: "pending",
    }

    rentalRequests.push(rentalRequest)

    // Send confirmation email to customer
    try {
      const customerEmail = generateCustomerEmail({
        name: body.name,
        email: body.email,
        phone: body.phone,
        setId: body.setId,
        rentalDate: body.rentalDate,
        returnDate: body.returnDate,
        message: body.message,
        latitude: body.latitude,
        longitude: body.longitude,
      });

      await sendNotificationEmail({
        to: body.email,
        subject: `Rental Inquiry Confirmation - ${body.setId}`,
        html: customerEmail.html,
        text: customerEmail.text,
      });
    } catch (emailError) {
      console.error("Failed to send customer confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin
    try {
      const adminEmail = generateAdminEmail({
        name: body.name,
        email: body.email,
        phone: body.phone,
        setId: body.setId,
        rentalDate: body.rentalDate,
        returnDate: body.returnDate,
        message: body.message,
        latitude: body.latitude,
        longitude: body.longitude,
      });

      const adminEmailAddress = process.env.ADMIN_EMAIL || "gabeaudio@example.com";

      await sendNotificationEmail({
        to: adminEmailAddress,
        subject: `New Rental Inquiry - ${body.name} - ${body.setId}`,
        html: adminEmail.html,
        text: adminEmail.text,
      });
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the request if email fails
    }

    return Response.json(rentalRequest, { status: 201 })
  } catch (error: any) {
    console.error("Error processing rental request:", error);
    return Response.json(
      { error: error.message || "Failed to process rental request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(rentalRequests)
}
