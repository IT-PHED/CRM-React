const AccountStatementLoader = () => {
  const skeletonBase = {
    backgroundColor: "#E5E7EB", // Light Gray Hex
    borderRadius: "4px",
    display: "inline-block",
    animation: "pulse 1.5s infinite ease-in-out",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px" }}>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.4; }
            100% { opacity: 1; }
          }
        `}
      </style>

      {/* Header Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", borderBottom: "2px solid #F3F4F6", paddingBottom: "10px" }}>
        <div style={{ ...skeletonBase, width: "150px", height: "50px" }}></div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...skeletonBase, width: "200px", height: "15px", marginBottom: "8px" }}></div>
          <div style={{ ...skeletonBase, width: "150px", height: "15px" }}></div>
        </div>
      </div>

      {/* Metadata Grid Skeleton */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "40px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i}>
            {[1, 2, 3, 4].map((j) => (
              <div key={j} style={{ ...skeletonBase, width: "80%", height: "12px", marginBottom: "10px" }}></div>
            ))}
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div style={{ borderTop: "2px solid #000000" }}>
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid #F3F4F6" }}>
            {[1, 2, 3, 4, 5, 6].map((col) => (
              <div key={col} style={{ ...skeletonBase, width: "12%", height: "15px" }}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountStatementLoader;