interface Props {
  request: {
    id: string;
    copies: number;
    color: string;
    status: string;
    created_at: string;
    file_url?: string;
  };
  isPrinter?: boolean;
  onStatusChange?: (id: string, status: string) => void;
}

export default function RequestCard({
  request,
  isPrinter,
  onStatusChange,
}: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <p className="text-sm">Copies: {request.copies}</p>
          <p className="text-sm">Type: {request.color}</p>
          <p className="text-xs text-gray-400">
            {new Date(request.created_at).toLocaleString()}
          </p>
          {request.file_url && (
            <a
              href={request.file_url}
              target="_blank"
              className="text-blue-600 text-sm"
            >
              View File
            </a>
          )}
        </div>

        {isPrinter && onStatusChange && (
          <div className="flex gap-2">
            <button
              onClick={() => onStatusChange(request.id, "ready")}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs"
            >
              Ready
            </button>
            <button
              onClick={() => onStatusChange(request.id, "collected")}
              className="bg-gray-700 text-white px-3 py-1 rounded text-xs"
            >
              Collected
            </button>
          </div>
        )}

        <span className="px-3 py-1 text-xs rounded-full bg-gray-200">
          {request.status}
        </span>
      </div>
    </div>
  );
}
