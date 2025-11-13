# EmailJS Setup Instructions

This guide will help you set up EmailJS to enable email functionality in the contact form.

## Step 1: Create an EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (200 emails/month free)

## Step 2: Add an Email Service

1. Go to **Email Services** in your EmailJS dashboard
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy your Service ID** (you'll need this later)

## Step 3: Create an Email Template

1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Use this template structure:

```
Subject: New Contact Form Message - {{subject}}

From: {{from_name}} ({{from_email}})

Message:
{{message}}

---
This message was sent from the HearHut contact form.
```


4. **template_4si9zc8** (you'll need this later)

## Step 4: Get Your Public Key

1. Go to **Account** → **General** in your EmailJS dashboard
2. Find your **Public Key**
3. **Copy your Public Key** (you'll need this later) dDpH1yVLN3bpPPI6A

## Step 5: Update Contact.jsx

1. Open `src/pages/Contact.jsx`
2. Find these lines (around line 18-20):

```javascript
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
```

3. Replace them with your actual credentials:

```javascript
const EMAILJS_SERVICE_ID = "service_xxxxxxxxx"; // Your Service ID
const EMAILJS_TEMPLATE_ID = "template_xxxxxxxxx"; // Your Template ID
const EMAILJS_PUBLIC_KEY = "xxxxxxxxxxxxxxxx"; // Your Public Key
```

## Step 6: Test the Form

1. Start your development server: `npm run dev`
2. Navigate to the Contact page
3. Fill out and submit the form
4. Check your email inbox for the message!

## Troubleshooting

- **"EmailJS is not configured" error**: Make sure you've replaced all three placeholder values
- **Email not received**: Check your spam folder and verify your EmailJS service is properly connected
- **Template variables not working**: Make sure your template uses the exact variable names: `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}`

## Security Note

The Public Key is safe to use in frontend code. However, for production, consider:
- Using environment variables
- Setting up rate limiting
- Adding CAPTCHA to prevent spam

## Need Help?

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)

