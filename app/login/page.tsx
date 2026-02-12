"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role");

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
          localStorage.setItem("role", "printer");
          router.push("/dashboard");
          return;
        } else {
          throw new Error("Invalid printer credentials");
        }
      }

      // Student login
      if (!email.endsWith("@mmcoe.edu.in")) {
        throw new Error("Only @mmcoe.edu.in emails allowed");
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      localStorage.setItem("role", "student");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Invalid login route.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6 text-center capitalize">
        {role} Login
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder={role === "printer" ? "Username" : "Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded-lg px-4 py-3"
        />

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {role === "student" && (
        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 cursor-pointer"
          >
            Sign up
          </span>
        </p>
      )}
    </div>
  );
}

