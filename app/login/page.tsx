"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "printer">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (role === "printer") {
        if (email === "printer" && password === "print123") {
          document.cookie = "role=printer; path=/";
          router.push("/dashboard/printer");
          return;
        } else {
          throw new Error("Invalid printer credentials");
        }
      }

      const { error } = await signIn(email, password);

      if (error) throw error;

      document.cookie = "role=student; path=/";
      router.push("/dashboard/student");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Campus Print Login
        </h2>

        <div className="flex mb-4">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`flex-1 py-2 rounded-l-lg ${
              role === "student"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole("printer")}
            className={`flex-1 py-2 rounded-r-lg ${
              role === "printer"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Printer
          </button>
        </div>

        <input
          type="text"
          placeholder={role === "printer" ? "Username" : "Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-3 px-3 py-2 border rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-3 px-3 py-2 border rounded-lg"
        />

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center mt-4">
          Student?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
           Create Account
            </a>
        </p>
      </form>
    </div>
  );
}
