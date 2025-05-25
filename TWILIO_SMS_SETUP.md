# Twilio SMS Authentication Setup

This guide walks you through setting up Twilio SMS authentication with Supabase.

## Prerequisites

1. A Twilio account (sign up at https://www.twilio.com/try-twilio)
2. A verified phone number in Twilio (for testing)
3. Twilio account upgraded from trial (for production use)

## Setup Steps

### 1. Get Your Twilio Credentials

1. Log in to your [Twilio Console](https://console.twilio.com)
2. From the dashboard, copy your:
   - **Account SID** (starts with `AC`)
   - **Auth Token** (click to reveal)

### 2. Create a Messaging Service

1. In Twilio Console, navigate to **Messaging > Services**
2. Click **Create Messaging Service**
3. Give it a name (e.g., "Supabase Auth")
4. Complete the setup wizard:
   - Add a Sender (phone number)
   - Set up integration (can skip for now)
   - Set compliance info
   - Review and complete
5. Copy the **Messaging Service SID** (starts with `MG`)

### 3. Configure Environment Variables

Add these to your `.env.local` file:

```env
# Twilio Configuration
SUPABASE_AUTH_SMS_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_AUTH_SMS_TWILIO_MESSAGE_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_AUTH_SMS_TWILIO_AUTH_TOKEN=your-auth-token-here
```

### 4. Restart Supabase

After setting the environment variables, restart your local Supabase instance:

```bash
pnpm supabase stop
pnpm supabase start
```

## Testing SMS Authentication

The template includes a phone authentication component at `/components/auth/phone-auth-form.tsx` that's already integrated with the auth flow.

### Test Phone Numbers (Development)

For local development, you can configure test phone numbers in `supabase/config.toml`:

```toml
# Use pre-defined map of phone number to OTP for testing.
[auth.sms.test_otp]
4152127777 = "123456"
```

This allows you to test without sending real SMS messages.

### Using Real SMS (Production)

1. Ensure your Twilio account is upgraded from trial
2. Add verified phone numbers or enable geographic permissions
3. Monitor usage in Twilio Console

## Important Notes

- **Rate Limits**: The local config limits SMS to 30 messages per hour
- **Template**: OTP messages use the template: "Your code is {{ .Code }}"
- **Security**: Never commit your Auth Token to version control
- **Costs**: Twilio charges per SMS sent (check current pricing)

## Troubleshooting

### Common Issues

1. **"Invalid Account SID"**: Ensure the SID starts with `AC`
2. **"Invalid Messaging Service"**: Ensure the SID starts with `MG`
3. **"Authentication Error"**: Double-check your Auth Token
4. **"Phone number not verified"**: In trial mode, you must verify recipient numbers

### Debugging

Check Supabase logs for SMS errors:
```bash
pnpm supabase logs --tail
```

Check Twilio error logs in the Twilio Console under **Monitor > Logs > Errors**