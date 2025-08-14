'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const verifyEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token })
      toast.success("Email verified successfully!");
      setVerified(true);
      setError("");
    } catch (error: any) {
      console.error("Error verifying email:", error);
      setError(error.response.data.error || "An error occurred while verifying your email.");
    }
  }

  useEffect(() => {
    setError("");
    // const urlToken = window.location.search.split("=")[1]
    // setToken(urlToken || "")

    const urlToken = searchParams.get("token");
    setToken(urlToken || "");

  }, []);

  useEffect(() => {
    setError("");
    if (token.length > 0) {
      verifyEmail();
    }
  }, [token])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      {/* <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : "No token provided"}
      </h2> */}
      {verified && (
        <div>
          <h2>Verified</h2>
          <Link href="/login">Go to Login</Link>
        </div>
      )}
      {error.length > 0 && (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}
