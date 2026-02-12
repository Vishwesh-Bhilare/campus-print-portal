"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function generateUID() {
  return "STU-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    prn: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email.endsWith("@mmcoe.edu.in")) {
      setError("Only @mmcoe.edu.in emails allowed");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) throw error;

      const uid = generateUID();

      await supabase.from("students").insert([
        {
          id: data.user?.id,
          name: form.name,
          phone: form.phone,
          prn: form.prn,
          email: form.email,
          uid,
        },
      ]);

      router.push("/login?role=student");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Student Sign Up
      </h2>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          name="phone"
          placeholder="Phone Number"
          required
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          name="prn"
          placeholder="PRN"
          required
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          name="email"
          type="email"
          placeholder="MMCOE Email"
          required
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

