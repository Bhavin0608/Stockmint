import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    const hasImage = product.images && product.images.length > 0 && product.images[0].url;

    return (
        <div
            style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "box-shadow 0.2s ease, transform 0.2s ease"
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
            }}
        >
            {/* Product Image / Placeholder */}
            <div
                style={{
                    width: "100%",
                    height: "180px",
                    backgroundColor: "var(--bg-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden"
                }}
            >
                {hasImage ? (
                    <img
                        src={product.images[0].url}
                        alt={product.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                ) : (
                    <div style={{ color: "var(--text-muted)", fontSize: "13px", fontWeight: "500" }}>
                        No Image Available
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div
                style={{
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1
                }}
            >
                {/* Category & Brand Metadata */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                        fontSize: "12px"
                    }}
                >
                    {product.categoryId?.name && (
                        <span
                            style={{
                                color: "var(--primary)",
                                backgroundColor: "rgba(37, 99, 235, 0.08)",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: "600"
                            }}
                        >
                            {product.categoryId.name}
                        </span>
                    )}
                    {product.brand && (
                        <span style={{ color: "var(--text-muted)", fontWeight: "500" }}>
                            {product.brand}
                        </span>
                    )}
                </div>

                {/* Product Name */}
                <h3
                    style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "var(--text)",
                        marginBottom: "8px",
                        lineHeight: "1.3"
                    }}
                >
                    {product.name}
                </h3>

                {/* Description snippet */}
                {product.description && (
                    <p
                        style={{
                            fontSize: "13px",
                            color: "var(--text-muted)",
                            marginBottom: "16px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            flex: 1
                        }}
                    >
                        {product.description}
                    </p>
                )}

                {/* Action Link */}
                <Link
                    to={`/products/${product._id}`}
                    style={{
                        marginTop: "auto",
                        padding: "8px 12px",
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--text)",
                        textAlign: "center",
                        fontSize: "13px",
                        fontWeight: "600",
                        textDecoration: "none",
                        transition: "background-color 0.2s ease"
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "var(--border)")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")}
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
