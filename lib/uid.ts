export function generateUID(): string {
  return (
    "STU-" +
    Math.random().toString(36).substring(2, 6).toUpperCase() +
    "-" +
    Date.now().toString().slice(-4)
  );
}
