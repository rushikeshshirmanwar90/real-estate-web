import { EmailTemplate } from "@/components/EmailTemplate";
import connect from "@/lib/db";
import { User } from "@/lib/models/Users";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const generateOTP = (): number => {
  return Math.floor(Math.random() * 1000000);
};

export const POST = async (req: NextRequest) => {
  const resend = new Resend(process.env.MAIL_API);
  try {
    await connect();
    const { email } = await req.json();

    const OTP = generateOTP();

    const { data } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Email Verification code",
      react: EmailTemplate({ verificationCode: OTP }),
    });

    const user = await User.findOneAndUpdate(
      { email },
      { otp: OTP },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "can't able to update the OTP please try again",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "mail send successfully",
      },
      {
        status: 200,
      }
    );

    return NextResponse.json({
      message: "mail send successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "can't able to send the mail",
      error: error.message,
    });
  }
};
