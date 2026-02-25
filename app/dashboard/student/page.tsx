"use client";

import { useEffect, useState } from "react";

interface Request {
  id: string;
  file_url: string;
  copies: number;
  color: string;
  status: string;
  created_at: string;
}

export default function StudentDashboard() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState("bw");
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    const res = await fetch("/api/requests");
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("copies", String(copies));
    formData.append("color", color);

    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setFile(null);
    setLoading(false);
    fetchRequests();
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      {/* LOGOUT */}
      <button
        onClick={async () => {
          await fetch("/api/logout", { method: "POST" });
          window.location.href = "/login";
        }}
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      {/* UPLOAD SECTION */}
      <h2 className="text-xl font-bold mb-4">Upload Print</h2>

      <form
        onSubmit={handleUpload}
        className="bg-white p-4 rounded-xl shadow space-y-4"
      >
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />

        <input
          type="number"
          value={copies}
          onChange={(e) => setCopies(Number(e.target.value))}
          min="1"
          className="border p-2 rounded w-full"
        />

        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="bw">Black & White</option>
          <option value="color">Color</option>
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Submit Print"}
        </button>
      </form>

      {/* REQUEST LIST */}
      <h2 className="text-xl font-bold mt-8 mb-4">My Requests</h2>

      {requests.length === 0 && (
        <p className="text-gray-500">No requests yet.</p>
      )}

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-4 rounded-xl shadow"
          >
            <p><strong>Copies:</strong> {req.copies}</p>
            <p><strong>Type:</strong> {req.color}</p>
            <p><strong>Status:</strong> {req.status}</p>

            <a
              href={req.file_url}
              target="_blank"
              className="text-blue-600 underline"
            >
              Download File
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
