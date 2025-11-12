"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      console.log("User data:", res.data.user);
      setUser(res.data.user); // ✅ Correct: store only user object
      toast.success("User details fetched successfully!");
    } catch (error: any) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message || "Failed to fetch user details");
    }
  };

  const logout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      toast.success(res.data.message || "Logged out successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Page</h2>
        <hr className="mb-4 border-gray-300" />

        <div className="mb-6">
          {user ? (
            <div className="space-y-2">
              <Link
                href={`/profile/${user._id}`}
                className="text-blue-600 font-medium hover:underline block"
              >
                View Profile: {user.username}
              </Link>
              <p className="text-gray-700 text-sm">{user.email}</p>
              <p className="text-sm text-gray-500">
                Verified: {user.isVerified ? "✅ Yes" : "❌ No"}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No user data available.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={getUserDetails}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Get User Details
          </button>

          <button
            onClick={logout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
