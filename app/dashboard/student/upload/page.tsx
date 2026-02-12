"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState("black_white");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Please select a file.");

    setLoading(true);
    setError("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not authenticated");

      const filePath = `${userData.user.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("prints")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("prints")
        .getPublicUrl(filePath);

      await supabase.from("print_requests").insert([
        {
          student_id: userData.user.id,
          file_url: publicUrlData.publicUrl,
          copies,
          color,
          status: "pending",
        },
      ]);

      router.push("/dashboard/student");
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h3 className="text-lg font-semibold mb-6">Upload Print File</h3>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) =>
            setFile(e.target.files ? e.target.files[0] : null)
          }
          required
          className="w-full"
        />

        <div>
          <label className="block text-sm mb-1">Number of Copies</label>
          <input
            type="number"
            min={1}
            value={copies}
            onChange={(e) => setCopies(Number(e.target.value))}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Print Type</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="black_white">Black & White</option>
            <option value="color">Color</option>
          </select>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
        >
          {loading ? "Uploading..." : "Submit Print Request"}
        </button>
      </form>
    </div>
  );
}

