"use client";

import React from "react";

const ProfileDetailPage = async ({ params }: any) => {
    const { id } = await params;
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          User Profile
        </h1>
        <p className="text-lg text-gray-700">
          Welcome,{" "}
          <span className="font-semibold text-blue-600">{id}</span> 👋
        </p>
      </div>
    </div>
  );
};

export default ProfileDetailPage;
