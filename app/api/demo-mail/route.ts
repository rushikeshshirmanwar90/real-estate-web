import { EmailTemplate } from "@/components/EmailTemplate";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const GET = async () => {
  const resend = new Resend(process.env.MAIL_API);
  try {
    const { data } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "rushikeshshrimanwar@gmail.com",
      subject: "Demo Mail",
      react: EmailTemplate({ verificationCode: "550" }),
    });

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
