import connect from "@/lib/db";
import { User } from "@/lib/models/Users";
import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/components";
import { transporter } from "@/lib/transporter";
import { EmailTemplate } from "@/components/mail/EmailTemplate";

export const POST = async (req: NextRequest | Request) => {
  try {
    await connect();
    const { email, OTP } = await req.json();

    const emailHtml = await render(<EmailTemplate verificationCode={OTP} />);

    const Einfo = await transporter.sendMail({
      from: `Exponentor`,
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
