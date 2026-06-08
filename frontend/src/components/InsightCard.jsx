// frontend/src/components/InsightCard.jsx

export default function InsightCard({
  title,
  value,
  unit = "",
  trend = null,
  color = "#3b82f6",
}) {
  const safeValue = value !== null && value !== undefined ? value : "0";

  const displayValue =
    typeof safeValue === "number"
      ? safeValue.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })
      : String(safeValue);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        padding: "16px",
        borderLeft: `4px solid ${color}`,
        transition: "all 300ms",
      }}
    >
      <p
        style={{
          color: "#6b7280",
          fontSize: "13px",
          fontWeight: "500",
          marginBottom: "4px",
        }}
      >
        {title}
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "8px",
        }}
      >
        <h3
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1f2937",
          }}
        >
          {displayValue}
        </h3>

        {unit && (
          <span
            style={{
              fontSize: "14px",
              color: "#9ca3af",
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {trend !== null && trend !== undefined && !isNaN(trend) && (
        <p
          style={{
            fontSize: "12px",
            marginTop: "6px",
            color: trend > 0 ? "#16a34a" : "#dc2626",
          }}
        >
          {trend > 0 ? "📈" : "📉"} {Math.abs(trend)}% từ tháng trước
        </p>
      )}
    </div>
  );
}