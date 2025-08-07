import nodemailer from "nodemailer";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

interface EmailOptions {
    email: string;
    emailType: string;
    userId: Types.ObjectId;
}

export const sendEmail = async ({ email, emailType, userId }: EmailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        });

        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === "verify") {
            console.log("Sending verification email to:", email);
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000,
            });
        } else if (emailType === "reset") {
            console.log("Sending password reset email to:", email);
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000,
            });
        }

        const mailOptions = {
            from: "no-reply@example.com",
            to: email,
            subject:
                emailType === "verify"
                    ? "Verify your email"
                    : "Reset your password",
            html: `<p>Click <a href="${
                process.env.DOMAIN
            }/verifyemail?token=${hashedToken}">here</a> to ${
                emailType === "verify" ? "verify your email" : "reset your password"
            } or copy and paste the link below in your browser. <br> ${
                process.env.DOMAIN
            }/verifyemail?token=${hashedToken}</p>`,
        };

        await transporter.sendMail(mailOptions);
    } catch (error: any) {
        console.error("Error sending email:", error);
    }
};
