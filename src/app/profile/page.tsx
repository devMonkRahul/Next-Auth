'use client'

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();

  const [data, setData] = useState("")

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/me")

      setData(response.data.user.username)
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast.error("Failed to fetch user details.")
    }
  }

  const logout = async () => {
    try {
      await axios.get("/api/users/logout")
      toast.success("Logout successful!")
      router.push("/login")
    } catch (error) {
      console.error("Error during logout:", error)
      toast.error("Failed to logout.")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <hr />
      <h2>
        {data === "" ? "No user data available" : <Link href={`/profile/${data}`}>{data}</Link>}
      </h2>
      <hr />
      <button
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={logout}
      >Logout</button>
      <button
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={getUserDetails}
      >Get User Details</button>
    </div>
  )
}
