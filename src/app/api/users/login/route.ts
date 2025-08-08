import connectDB from "@/db/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found", success: false },
                { status: 400 }
            );
        }

        if (!user.isVerified) {
            return NextResponse.json(
                { error: "Email not verified", success: false },
                { status: 400 }
            );
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return NextResponse.json(
                { error: "Invalid credentials", success: false },
                { status: 400 }
            );
        }

        const tokenPayload = {
            id: user._id,
            email: user.email,
        };

        const token = jwt.sign(tokenPayload, process.env.TOKEN_SECRET!, {
            expiresIn: "1d",
        });

        const response = NextResponse.json(
            { message: "Login successful", success: true, token },
            { status: 200 }
        );

        response.cookies.set("token", token, { httpOnly: true });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error.message || "Internal Server Error",
                success: false,
            },
            { status: 500 }
        );
    }
}
