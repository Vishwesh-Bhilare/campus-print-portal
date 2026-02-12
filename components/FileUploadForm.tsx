"use client";

import { useState } from "react";

interface Props {
  onSubmit: (data: FormData) => Promise<void>;
}

export default function FileUploadForm({ onSubmit }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState("black_white");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("copies", copies.toString());
    formData.append("color", color);

    await onSubmit(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        accept=".pdf,image/*"
        required
        onChange={(e) =>
          setFile(e.target.files ? e.target.files[0] : null)
        }
        className="w-full"
      />

      <input
        type="number"
        min={1}
        value={copies}
        onChange={(e) => setCopies(Number(e.target.value))}
        className="w-full border rounded-lg px-4 py-2"
      />

      <select
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="w-full border rounded-lg px-4 py-2"
      >
        <option value="black_white">Black & White</option>
        <option value="color">Color</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
      >
        {loading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
}
