import connectDB from "@/db/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/utils/getDataFromToken";

connectDB();

export async function GET(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);

        const user = await User.findById(userId).select("-password");

        return NextResponse.json(
            {
                user,
                message: "User retrieved successfully",
                success: true,
            },
            { status: 200 }
        );
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