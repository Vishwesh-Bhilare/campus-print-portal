interface Props {
  status: "pending" | "ready" | "collected";
}

export default function StatusBadge({ status }: Props) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    ready: "bg-green-100 text-green-700",
    collected: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}
