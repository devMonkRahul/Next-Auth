import connectDB from "@/db/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json(
                { 
                    error: "Invalid or expired token", 
                    success: false 
                },
                { status: 400 }
            );
        }

        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json(
            {
                message: "Email verified successfully",
                success: true,
            },
            {
                status: 200,
            }
        );
    } catch (error: any) {
        return NextResponse.json(
            { 
                error: error.message || "Internal Server Error", success: false 
            },
            { status: 500 }
        );
    }
}
