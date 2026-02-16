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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/requests");
        const data = await res.json();

        // ✅ Handle both formats safely
        if (Array.isArray(data)) {
          setRequests(data);
        } else if (Array.isArray(data.data)) {
          setRequests(data.data);
        } else {
          setRequests([]);
        }
      } catch (err) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Print Requests</h2>

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
            <p className="text-sm text-gray-500">
              {new Date(req.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
