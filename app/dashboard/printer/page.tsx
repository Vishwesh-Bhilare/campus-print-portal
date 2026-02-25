"use client";

import { useEffect, useState } from "react";

interface Request {
  id: string;
  file_url: string;
  copies: number;
  color: string;
  status: string;
}
  <button
  onClick={async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }}
  className="mb-4 bg-red-500 text-white px-4 py-2 rounded"
  >
   Logout
  </button>
export default function PrinterDashboard() {
  const [requests, setRequests] = useState<Request[]>([]);

  const fetchRequests = async () => {
    const res = await fetch("/api/requests");
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/status", {
      method: "POST",
      body: JSON.stringify({ id, status }),
    });

    fetchRequests();
  };

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <button
        onClick={async () => {
          await fetch("/api/logout", { method: "POST" });
          window.location.href = "/login";
        }}
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      <h2 className="text-xl font-bold mb-4">All Print Requests</h2>

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
              Download
            </a>

            <div className="mt-2 space-x-2">
              <button
                onClick={() => updateStatus(req.id, "approved")}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => updateStatus(req.id, "rejected")}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>

              <button
                onClick={() => updateStatus(req.id, "printed")}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Mark Printed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
