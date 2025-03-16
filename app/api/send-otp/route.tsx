import { EmailTemplate } from "@/components/mail/EmailTemplate";
import connect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { render } from '@react-email/components';
import { transporter } from "@/lib/transporter";

const generateOTP = (): number => {
    return Math.floor(100000 + Math.random() * 900000); // Ensures a 6-digit OTP
};

export const POST = async (req: NextRequest | Request) => {
    try {
        await connect();

        // Parse request body safely
        const body = await req.json();
        if (!body.email) {
            return NextResponse.json(
                { message: "Email is required." },
                { status: 400 }
            );
        }

        const { email } = body;
        const OTP = generateOTP();



        const emailHtml = await render(<EmailTemplate verificationCode={OTP} />);

        const info = await transporter.sendMail({
            from: `"Rushikesh Shrimanwar"`,
            to: email,
            subject: "Your Email Verification Code",
            html: emailHtml
        });

        return NextResponse.json(
            {
                message: "Email sent successfully!",
                otp: OTP,
                info,
            },
            { status: 200 }
        );

    } catch (error: unknown) {
        console.error("Email sending error:", error);
        return NextResponse.json(
            { message: "Failed to send email.", error: error },
            { status: 500 }
        );
    }
};
