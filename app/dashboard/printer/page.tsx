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

export default function PrinterDashboard() {
  const router = useRouter();
  const [requests, setRequests] = useState<PrintRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "printer") {
      router.push("/");
      return;
    }

    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("print_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setRequests(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("print_requests").update({ status }).eq("id", id);
    fetchRequests();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6">
        All Print Requests
      </h3>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No print requests available.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-4 rounded-lg shadow border"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm">Copies: {req.copies}</p>
                  <p className="text-sm">
                    Type: {req.color}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(req.created_at).toLocaleString()}
                  </p>
                  <a
                    href={req.file_url}
                    target="_blank"
                    className="text-blue-600 text-sm"
                  >
                    View File
                  </a>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(req.id, "ready")}
                    className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Mark Ready
                  </button>
                  <button
                    onClick={() => updateStatus(req.id, "collected")}
                    className="bg-gray-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Collected
                  </button>
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
