"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const VerifyPage = () => {
  // State to store token from URL
  const [token, setToken] = useState("");
  // State to track verification success
  const [verified, setVerified] = useState(false);
  // State to store any error messages
  const [error, setError] = useState("");

  // Function to call API and verify user
  const verifyUser = async () => {
    try {
      // POST request to your backend verification endpoint
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true); // set verified if API succeeds
    } catch (err: any) {
      // Capture error message from backend
      setError(err?.response?.data?.message || "Failed to verify email");
      console.log(err.response?.data);
    }
  };

  // Extract token from URL query on component mount
  useEffect(() => {
    // Get query parameter 'token' from URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    setToken(urlToken || "");
  }, []);

  // Trigger verification when token is set
  useEffect(() => {
    if (token) {
      verifyUser();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>

      {/* Display the token (for debugging) */}
      <h2 className="mb-4 text-gray-700">
        {token ? `Verifying token: ${token}` : "No token found"}
      </h2>

      {/* Display success message */}
      {verified && (
        <h2 className="text-green-600 mb-4">
          Email verified successfully! <Link href="/login" className="underline">Login</Link>
        </h2>
      )}

      {/* Display error message */}
      {error && <h2 className="text-red-600">{error}</h2>}
    </div>
  );
};

export default VerifyPage;
