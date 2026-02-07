import twilio from "twilio";

class SmsService {
  private client: ReturnType<typeof twilio> | null = null;
  private fromNumber: string | null = null;

  private getClient() {
    if (!this.client) {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER || null;

      if (!accountSid || !authToken || !this.fromNumber) {
        throw new Error("Twilio credentials not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER.");
      }

      this.client = twilio(accountSid, authToken);
    }
    return this.client;
  }

  async sendVerificationCode(to: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      await client.messages.create({
        body: `Your Power Plunge affiliate verification code is: ${code}. This code expires in 10 minutes.`,
        from: this.fromNumber!,
        to,
      });
      return { success: true };
    } catch (error: any) {
      console.error("[SMS] Failed to send verification code:", error);
      return { success: false, error: error.message || "Failed to send SMS" };
    }
  }

  generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  normalizePhone(phone: string): string {
    let cleaned = phone.replace(/[^\d+]/g, "");
    if (!cleaned.startsWith("+")) {
      if (cleaned.length === 10) {
        cleaned = "+1" + cleaned;
      } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
        cleaned = "+" + cleaned;
      } else {
        cleaned = "+" + cleaned;
      }
    }
    return cleaned;
  }
}

export const smsService = new SmsService();
