"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();

    // PRINTER LOGIN
    if (email === "printer@admin.com" && password === "printer123") {
      await fetch("/api/set-role", {
        method: "POST",
        body: JSON.stringify({ role: "printer" }),
      });

      router.push("/dashboard/printer");
      return;
    }

    // STUDENT LOGIN
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {
      await fetch("/api/set-role", {
        method: "POST",
        body: JSON.stringify({ role: "student" }),
      });

      router.push("/dashboard/student");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Login
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
