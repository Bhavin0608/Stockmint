const VariantSelector = ({ variants = [], selectedVariant = null, onSelectVariant }) => {
    if (!variants || variants.length === 0) {
        return (
            <div style={{ color: "var(--text-muted)", fontSize: "14px", margin: "16px 0" }}>
                No variants currently available for this product.
            </div>
        );
    }

    // Helper to format attributes into a readable label (e.g., "Size: M, Color: Black" or SKU)
    const getVariantLabel = (variant) => {
        if (variant.attributes && Object.keys(variant.attributes).length > 0) {
            return Object.entries(variant.attributes)
                .map(([key, val]) => `${key}: ${val}`)
                .join(" / ");
        }
        return variant.sku || "Standard";
    };

    return (
        <div style={{ margin: "20px 0" }}>
            <label
                style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text)",
                    marginBottom: "8px"
                }}
            >
                Select Option:
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {variants.map((variant) => {
                    const isSelected = selectedVariant && selectedVariant._id === variant._id;
                    const label = getVariantLabel(variant);

                    return (
                        <button
                            key={variant._id}
                            type="button"
                            onClick={() => onSelectVariant(variant)}
                            style={{
                                padding: "8px 14px",
                                border: "2px solid",
                                borderColor: isSelected ? "var(--primary)" : "var(--border)",
                                borderRadius: "6px",
                                backgroundColor: isSelected ? "rgba(37, 99, 235, 0.05)" : "var(--bg)",
                                color: isSelected ? "var(--primary)" : "var(--text)",
                                fontWeight: isSelected ? "600" : "500",
                                fontSize: "13px",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "2px"
                            }}
                        >
                            <span>{label}</span>
                            <span style={{ fontSize: "12px", color: isSelected ? "var(--primary)" : "var(--text-muted)" }}>
                                ₹{variant.price}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default VariantSelector;
