import twilio from 'twilio'

export function getTwilioClient() {
  return twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!,
  )
}

export const VERIFY_SID = process.env.TWILIO_VERIFY_SERVICE_SID!
