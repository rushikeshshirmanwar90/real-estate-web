import { connectDB } from "@/lib/utils/db-connection";
import { Customer } from "@/lib/models/users/Customer";
import { NextRequest } from "next/server";
import { render } from "@react-email/components";
import { transporter } from "@/lib/transporter";
import { EmailTemplate } from "@/components/mail/EmailTemplate";
import { errorResponse, successResponse } from "@/lib/utils/api-response";
import { isValidEmail } from "@/lib/utils/validation";
import { generateOTP, createOTPData } from "@/lib/utils/otp";
import { rateLimit } from "@/lib/utils/rate-limiter";
import { logger } from "@/lib/utils/logger";

export const POST = async (req: NextRequest) => {
  try {
    // Rate limiting: 3 OTP requests per 5 minutes
    const rateLimitResult = rateLimit(req, { maxRequests: 3, windowMs: 5 * 60 * 1000 });
    if (!rateLimitResult.allowed) {
      return errorResponse("Too many OTP requests. Please try again later.", 429);
    }

    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return errorResponse("Email is required", 400);
    }

    if (!isValidEmail(email)) {
      return errorResponse("Invalid email format", 400);
    }

    // Check if user exists
    const user = await Customer.findOne({ email }).lean();
    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Generate OTP
    const otp = generateOTP();
    const otpData = createOTPData(otp);

    // Send email
    const emailHtml = await render(<EmailTemplate verificationCode={otp} />);

    try {
      await transporter.sendMail({
        from: `"Exponentor" <noreply@exponentor.com>`,
        to: email,
        subject: "Your Email Verification Code",
        html: emailHtml,
      });
    } catch (emailError) {
      logger.error("Error sending OTP email", emailError);
      return errorResponse("Failed to send OTP email", 500);
    }

    // Store hashed OTP with expiry
    await Customer.findOneAndUpdate(
      { email },
      {
        otp: otpData.hash,
        otpExpiresAt: otpData.expiresAt,
        otpAttempts: 0,
      },
      { new: true }
    );

    return successResponse(
      { expiresIn: "10 minutes" },
      "OTP sent successfully"
    );
  } catch (error: unknown) {
    logger.error("Error sending OTP", error);
    return errorResponse("Failed to send OTP", 500);
  }
};
