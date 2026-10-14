
export default function Avatar({ name, index = 0, size = "normal" }) {
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-indigo-100 text-indigo-700",
  ];

  const initials = (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl font-bold ${
        colors[index % colors.length]
      } ${
        size === "large"
          ? "h-12 w-12 text-sm"
          : "h-10 w-10 text-xs"
      }`}
    >
      {initials}
    </div>
  );
}
