"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PrintRequest {
  id: string;
  file_url: string;
  copies: number;
  color: string;
  status: string;
  created_at: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<PrintRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "student") {
      router.push("/");
      return;
    }

    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    const { data } = await supabase
      .from("print_requests")
      .select("*")
      .eq("student_id", userData.user.id)
      .order("created_at", { ascending: false });

    setRequests(data || []);
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">My Print Requests</h3>
        <button
          onClick={() => router.push("/dashboard/student/upload")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          New Print
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No print requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-4 rounded-lg shadow border"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Copies: {req.copies}
                  </p>
                  <p className="text-sm text-gray-600">
                    Type: {req.color}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(req.created_at).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${
                    req.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "ready"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {req.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

