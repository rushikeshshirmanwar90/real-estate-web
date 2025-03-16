import connect from "@/lib/db";
import { User } from "@/lib/models/Users";
import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import { transporter } from "@/lib/transporter";
import { EmailTemplate } from "@/components/mail/EmailTemplate";

const generateOTP = (): number => {
  return Math.floor(Math.random() * 1000000);
};

export const POST = async (req: NextRequest) => {
  try {
    await connect();
    const { email } = await req.json();

    const OTP = generateOTP();

    const emailHtml = await render(<EmailTemplate verificationCode={OTP} />);

    const Einfo = await transporter.sendMail({
      from: `"Rushikesh Shrimanwar"`,
      to: email,
      subject: "Your Email Verification Code",
      html: emailHtml,
    });

    await User.findOneAndUpdate(
      { email },
      { otp: OTP },
      { new: true }
    );

    if (!Einfo) {
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
  } catch (error: unknown) {
    return NextResponse.json({
      message: "can't able to send the mail",
      error: error,
    });
  }
};
