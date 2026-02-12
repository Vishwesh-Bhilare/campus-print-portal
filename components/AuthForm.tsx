"use client";

import { useState } from "react";

interface Props {
  type: "login" | "signup";
  onSubmit: (data: any) => Promise<void>;
}

export default function AuthForm({ type, onSubmit }: Props) {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === "signup" && (
        <>
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
        </>
      )}

      <input
        name="email"
        type="email"
        placeholder="Email"
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
        {loading
          ? type === "login"
            ? "Logging in..."
            : "Creating account..."
          : type === "login"
          ? "Login"
          : "Sign Up"}
      </button>
    </form>
  );
}
