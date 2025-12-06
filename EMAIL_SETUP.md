# Email Service Setup

This project uses the mail-service-app API to send emails for rental inquiries.

## Required Environment Variables

Add these to your `.env.local` file:

```env
# Mail Service Configuration
# URL of your mail-service-app instance
MAIL_SERVICE_URL=https://mail-app-five.vercel.app

# API Key for authenticating with the mail service
# This should match the ADMIN_API_KEY in your mail-service-app
MAIL_APP_API_KEY=your_api_key_here

# Admin email address to receive rental inquiry notifications
ADMIN_EMAIL=gabeaudio@example.com
```

## Setup Instructions

1. **Mail Service App**: Ensure your mail-service-app is running and accessible at the `MAIL_SERVICE_URL`.

2. **API Key**: Get your API key from the mail-service-app's `ADMIN_API_KEY` environment variable and set it as `MAIL_APP_API_KEY` in gabe-audio.

3. **Admin Email**: Set `ADMIN_EMAIL` to the email address where you want to receive rental inquiry notifications.

4. **Mail Service Environment Variables**: The mail-service-app also needs these environment variables:
   - `EMAIL` - Gmail address for sending emails
   - `PASSWORD` - Gmail app password
   - `ADMIN_API_KEY` - API key for authentication (should match `MAIL_SERVICE_API_KEY` in gabe-audio)
   - `DEFAULT_FROM_EMAIL` - Default sender email address

## How It Works

When a customer submits a rental inquiry:

1. The inquiry is saved to the database (or mock storage in development)
2. A confirmation email is sent to the customer
3. A notification email is sent to the admin email address

Both emails are sent via the mail-service-app API at `/api/admin/send-email`.

## Testing

To test the email functionality:

1. Ensure both services are running
2. Submit a rental inquiry through the form
3. Check both the customer and admin email inboxes

