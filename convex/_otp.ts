import { mutation, action } from "./_generated/server";
import { v } from "convex/values";

const generateOTPCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

async function sendOTPEmail(email: string, otp: string) {
  const response = await fetch("https://api.smtp2go.com/v3/email/send", {
    method: "POST",
    headers: {
      "X-Smtp2go-Api-Key": process.env.SMTP2GO_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: process.env.SENDER_EMAIL!, 
      to: [email],                       
      subject: "Your OTP Code",
      html_body: `<p>Your OTP code is <strong>${otp}</strong></p>`,
    }),
  });

  const result = await response.json();
//   console.log("SMTP2GO RESULT:", result);

  return response.ok && result.data?.failed === 0;
}

export const create = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const code = generateOTPCode();
    const createdAt = Date.now();
    const expiresAt = createdAt + 10 * 60 * 1000; // 10 minutes expiry

    const otpId = await ctx.db.insert("otps", {
      userId: args.userId,
      code,
      createdAt,
      expiresAt,
      verified: false,
    });

    return { otpId, code };
  },
});

export const verify = mutation({
  args: { otpId: v.id("otps"), code: v.string() },
  handler: async (ctx, args) => {
    const otp = await ctx.db.get(args.otpId);

    if (!otp) {
      throw new Error("OTP not found");
    }

    if (Date.now() > otp.expiresAt) {
      throw new Error("OTP has expired");
    }

    if (otp.code !== args.code) {
      throw new Error("Invalid OTP code");
    }

    // Mark as verified
    await ctx.db.patch(args.otpId, { verified: true });

    return { success: true, userId: otp.userId };
  },
});

export const sendOTP = action({
  args: {
    email: v.string(),
    otpId: v.id("otps"),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const sent = await sendOTPEmail(args.email, args.code);

    if (!sent) {
      throw new Error("Failed to send OTP email");
    }

    return { success: true };
  },
});