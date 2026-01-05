import { getAudioSetById } from "@/lib/audio-sets-data"

/**
 * Email service helper for sending emails via mail-service-app API
 */

export const sendNotificationEmail = async ({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  const mailServiceUrl = process.env.MAIL_SERVICE_URL || "https://mail-app-five.vercel.app";
  const apiKey = process.env.MAIL_APP_API_KEY;

  if (!apiKey) {
    throw new Error("MAIL_APP_API_KEY is not configured");
  }

  const res = await fetch(`${mailServiceUrl}/api/admin/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      to,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Failed to send email: ${error.error || res.statusText}`);
  }

  return res.json();
};

// Alias for backward compatibility
export const sendEmail = sendNotificationEmail;

/**
 * Generate HTML email content for rental inquiry confirmation (to customer)
 */
export const generateCustomerEmail = (data: {
  name: string;
  email: string;
  phone: string;
  setId: string;
  rentalDate: string;
  returnDate: string;
  message?: string;
  latitude?: number;
  longitude?: number;
}) => {
  const startDate = new Date(data.rentalDate);
  const endDate = new Date(data.returnDate);
  
  // Get set name from ID
  const audioSet = getAudioSetById(data.setId);
  const setName = audioSet ? audioSet.name : data.setId;
  
  const rentalPeriod = startDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  const returnTime = endDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  const rentalDateFormatted = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Generate Google Maps link if coordinates are provided
  const mapsLink = data.latitude && data.longitude
    ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
    : null;

  return {
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rental Inquiry Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Thank You for Your Inquiry!</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px;">
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Dear ${data.name},
                      </p>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Thank you for your interest in renting audio equipment from Gabe Audio. We have received your inquiry and will review it shortly.
                      </p>
                      
                      <div style="background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0;">
                        <h2 style="color: #333333; font-size: 20px; margin: 0 0 15px 0;">Inquiry Details</h2>
                        <table width="100%" cellpadding="5" cellspacing="0">
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Name:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${data.name}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Email:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${data.email}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Phone:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${data.phone}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Equipment Set:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${setName}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Rental Date:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${rentalDateFormatted}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Rental Period:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${rentalPeriod} - ${returnTime} (8 hours)</td>
                          </tr>
                          ${data.message ? `
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0; vertical-align: top;"><strong>Message:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${data.message}</td>
                          </tr>
                          ` : ''}
                          ${mapsLink ? `
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0; vertical-align: top;"><strong>Setup Location:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              <a href="${mapsLink}" target="_blank" style="color: #667eea; text-decoration: none;">View on Google Maps</a><br>
                              <span style="color: #999999; font-size: 12px;">${data.latitude?.toFixed(6)}, ${data.longitude?.toFixed(6)}</span>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                        We will contact you within 24 hours to confirm availability and provide pricing details.
                      </p>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                        If you have any questions, please don't hesitate to reach out to us.
                      </p>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                        Best regards,<br>
                        <strong>Gabe Audio Team</strong>
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="color: #999999; font-size: 12px; margin: 0;">
                        This is an automated confirmation email. Please do not reply to this message.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
Thank You for Your Inquiry!

Dear ${data.name},

Thank you for your interest in renting audio equipment from Gabe Audio. We have received your inquiry and will review it shortly.

Inquiry Details:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}
- Equipment Set: ${setName}
- Rental Date: ${rentalDateFormatted}
- Rental Period: ${rentalPeriod} - ${returnTime} (8 hours)
${data.message ? `- Message: ${data.message}` : ''}
${mapsLink ? `- Setup Location: ${mapsLink}\n  Coordinates: ${data.latitude?.toFixed(6)}, ${data.longitude?.toFixed(6)}` : ''}

We will contact you within 24 hours to confirm availability and provide pricing details.

If you have any questions, please don't hesitate to reach out to us.

Best regards,
Gabe Audio Team
    `.trim(),
  };
};

/**
 * Generate HTML email content for rental inquiry notification (to admin)
 */
export const generateAdminEmail = (data: {
  name: string;
  email: string;
  phone: string;
  setId: string;
  rentalDate: string;
  returnDate: string;
  message?: string;
  latitude?: number;
  longitude?: number;
}) => {
  const startDate = new Date(data.rentalDate);
  const endDate = new Date(data.returnDate);
  
  // Get set name from ID
  const audioSet = getAudioSetById(data.setId);
  const setName = audioSet ? audioSet.name : data.setId;
  
  const rentalPeriod = startDate.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  const returnTime = endDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  const rentalDateFormatted = startDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Generate Google Maps link if coordinates are provided
  const mapsLink = data.latitude && data.longitude
    ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
    : null;

  return {
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Rental Inquiry</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px;">New Rental Inquiry</h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 30px;">
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        A new rental inquiry has been submitted through the Gabe Audio website.
                      </p>
                      
                      <div style="background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0;">
                        <h2 style="color: #333333; font-size: 20px; margin: 0 0 15px 0;">Customer Information</h2>
                        <table width="100%" cellpadding="5" cellspacing="0">
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 150px;"><strong>Name:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${data.name}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Email:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;"><a href="mailto:${data.email}" style="color: #667eea; text-decoration: none;">${data.email}</a></td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Phone:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;"><a href="tel:${data.phone}" style="color: #667eea; text-decoration: none;">${data.phone}</a></td>
                          </tr>
                        </table>
                      </div>
                      
                      <div style="background-color: #f9f9f9; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0;">
                        <h2 style="color: #333333; font-size: 20px; margin: 0 0 15px 0;">Rental Details</h2>
                        <table width="100%" cellpadding="5" cellspacing="0">
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0; width: 150px;"><strong>Equipment Set:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${setName}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Rental Date:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${rentalDateFormatted}</td>
                          </tr>
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0;"><strong>Rental Period:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${rentalPeriod} - ${returnTime} (8 hours)</td>
                          </tr>
                          ${data.message ? `
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0; vertical-align: top;"><strong>Additional Message:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">${data.message}</td>
                          </tr>
                          ` : ''}
                          ${mapsLink ? `
                          <tr>
                            <td style="color: #666666; font-size: 14px; padding: 8px 0; vertical-align: top;"><strong>Delivery Location:</strong></td>
                            <td style="color: #333333; font-size: 14px; padding: 8px 0;">
                              <a href="${mapsLink}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: bold;">📍 View on Google Maps</a><br>
                              <span style="color: #999999; font-size: 12px;">${data.latitude?.toFixed(6)}, ${data.longitude?.toFixed(6)}</span>
                            </td>
                          </tr>
                          ` : ''}
                        </table>
                      </div>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                        Please review this inquiry and contact the customer to confirm availability and pricing.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="color: #999999; font-size: 12px; margin: 0;">
                        Gabe Audio Rental System
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
New Rental Inquiry

A new rental inquiry has been submitted through the Gabe Audio website.

Customer Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}

Rental Details:
- Equipment Set: ${setName}
- Rental Date: ${rentalDateFormatted}
- Rental Period: ${rentalPeriod} - ${returnTime} (8 hours)
${data.message ? `- Additional Message: ${data.message}` : ''}
${mapsLink ? `- Setup Location: ${mapsLink}\n  Coordinates: ${data.latitude?.toFixed(6)}, ${data.longitude?.toFixed(6)}` : ''}

Please review this inquiry and contact the customer to confirm availability and pricing.
    `.trim(),
  };
};

