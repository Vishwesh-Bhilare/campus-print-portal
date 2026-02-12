"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">
        Welcome to Campus Print Management
      </h2>

      <p className="text-gray-600 max-w-xl mb-10">
        Upload your print files, track status, and collect your documents
        easily. Designed for MMCOE students and campus print shop.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={() => router.push("/login?role=student")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Login as Student
        </button>

        <button
          onClick={() => router.push("/login?role=printer")}
          className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-medium transition"
        >
          Login as Printer
        </button>
      </div>
    </div>
  );
}

