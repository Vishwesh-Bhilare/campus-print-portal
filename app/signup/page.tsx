"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (!data.user) {
      alert("Signup failed");
      setLoading(false);
      return;
    }

    // Insert student profile
    const { error: profileError } = await supabase
      .from("students")
      .insert({
        id: data.user.id,
        email,
        uid,
      });

    if (profileError) {
      alert(profileError.message);
      setLoading(false);
      return;
    }

    // Set role cookie
    await fetch("/api/set-role", {
      method: "POST",
      body: JSON.stringify({ role: "student" }),
    });

    router.push("/dashboard/student");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Student Signup</h2>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="text"
          placeholder="College UID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

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

        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
