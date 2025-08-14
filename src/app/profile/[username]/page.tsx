"use client";
import { use } from "react";

export default function UserProfilePage({ params }: any) {

    const param: any = use(params);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            User Profile Page for {param.username}
        </div>
    )
}
