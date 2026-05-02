import prisma from '@/lib/prisma';

// Mock SMS Sender for development
// In production, you would integrate Twilio or a local Nepal SMS gateway like Sparrow SMS
export async function sendSMS(phone, otp, type = 'PHONE_VERIFICATION') {
  try {
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Clean up old tokens for this phone/type first to avoid unique constraint issues
    await prisma.verificationToken.deleteMany({
      where: { email: phone, type }
    });

    // Save to DB
    await prisma.verificationToken.create({
      data: { 
        email: phone, // using phone in the email field for simplicity
        token: otp, 
        expires, 
        type 
      }
    });

    // If no SMS API key, log to console
    if (!process.env.SMS_API_KEY) {
      console.log(`[SMS MOCK] To: ${phone} | Message: Your Beauty Bees code is ${otp}. Valid for 10 mins.`);
      return true;
    }

    // Example Nepal SMS Gateway (Sparrow SMS)
    /*
    const response = await fetch(`https://api.sparrowsms.com/v2/sms/?token=${process.env.SMS_TOKEN}&from=${process.env.SMS_FROM}&to=${phone}&text=Your code is ${otp}`);
    if (!response.ok) throw new Error("SMS Gateway returned error");
    */

    return true;
  } catch (error) {
    console.error("SMS send error:", error);
    return false;
  }
}
