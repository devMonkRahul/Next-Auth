import connectDB from "@/db/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/utils/mailer";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return NextResponse.json(
                { error: "User already exists", success: false },
                { status: 400 }
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Send welcome email
        await sendEmail({ email, emailType: "verify", userId: newUser._id });

        return NextResponse.json({
            message: "User registered successfully",
            success: true,
            newUser,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message || "An error occurred during signup",
                success: false,
            },
            {
                status: 500,
            }
        );
    }
}
