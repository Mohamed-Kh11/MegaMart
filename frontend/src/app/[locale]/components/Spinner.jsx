"use client";

export default function Spinner({ size = 40, color = "#a28533" }) {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full border-4 border-t-transparent"
        style={{
          width: size,
          height: size,
          borderColor: color,
          borderTopColor: "transparent",
        }}
      ></div>
    </div>
  );
}
