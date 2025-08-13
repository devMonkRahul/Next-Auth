import connectDB from "@/db/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(request: NextRequest) {
    try {
        const response = NextResponse.json({
            message: "User logged out successfully",
            success: true,
        });

        response.cookies.set("token", "", { httpOnly: true });

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