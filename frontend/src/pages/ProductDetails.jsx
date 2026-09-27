import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById, getProductVariants } from "../services/product.service";
import { AuthContext } from "../context/AuthContext";
import VariantSelector from "../components/product/VariantSelector";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        let isMounted = true;

        Promise.all([getProductById(id), getProductVariants(id)])
            .then(([productRes, variantsRes]) => {
                if (!isMounted) return;

                if (productRes?.data) {
                    setProduct(productRes.data);
                }

                const fetchedVariants = variantsRes?.data || [];
                setVariants(fetchedVariants);
                if (fetchedVariants.length > 0) {
                    setSelectedVariant(fetchedVariants[0]);
                }
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error("Failed to load product details:", err);
                setError(err.response?.data?.message || "Product not found or unavailable.");
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleQuantityChange = (delta) => {
        setQuantity((prev) => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        if (!selectedVariant) {
            setFeedback("Please select a variant first.");
            return;
        }

        if (!isAuthenticated) {
            // Prompt guest to login before adding to cart
            navigate("/login");
            return;
        }

        // Cart service integration will attach here
        setFeedback(`Selected ${quantity} x ${selectedVariant.sku} for cart.`);
    };

    if (loading) {
        return (
            <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "0 24px", textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div style={{ maxWidth: "600px", margin: "60px auto", padding: "24px", textAlign: "center" }}>
                <h2 style={{ fontSize: "20px", color: "var(--danger)", marginBottom: "12px" }}>
                    {error || "Product Not Found"}
                </h2>
                <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>
                    The product you are looking for may have been removed or is temporarily unavailable.
                </p>
                <Link
                    to="/"
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "var(--primary)",
                        color: "#fff",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "14px"
                    }}
                >
                    &larr; Back to Catalog
                </Link>
            </div>
        );
    }

    const images = product.images || [];
    const activeImage = images[selectedImageIndex]?.url;
    const hasDiscount =
        selectedVariant?.compareAtPrice &&
        Number(selectedVariant.compareAtPrice) > Number(selectedVariant.price);
    const discountPercentage = hasDiscount
        ? Math.round(
              ((Number(selectedVariant.compareAtPrice) - Number(selectedVariant.price)) /
                  Number(selectedVariant.compareAtPrice)) *
                  100
          )
        : 0;

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px", width: "100%" }}>
            {/* Breadcrumb Navigation */}
            <nav style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>
                <Link to="/" style={{ color: "var(--text-muted)" }}>
                    Home
                </Link>
                {" / "}
                {product.categoryId?.name && (
                    <>
                        <Link
                            to={`/?category=${product.categoryId._id}`}
                            style={{ color: "var(--text-muted)" }}
                        >
                            {product.categoryId.name}
                        </Link>
                        {" / "}
                    </>
                )}
                <span style={{ color: "var(--text)", fontWeight: "500" }}>{product.name}</span>
            </nav>

            {/* Main Product Layout (2 Columns) */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "48px",
                    alignItems: "start"
                }}
            >
                {/* Left: Images */}
                <div>
                    <div
                        style={{
                            width: "100%",
                            height: "400px",
                            backgroundColor: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            marginBottom: "16px"
                        }}
                    >
                        {activeImage ? (
                            <img
                                src={activeImage}
                                alt={product.name}
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                        ) : (
                            <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
                                No Image Available
                            </span>
                        )}
                    </div>

                    {/* Thumbnail gallery */}
                    {images.length > 1 && (
                        <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
                            {images.map((img, index) => (
                                <button
                                    key={img.publicId || index}
                                    type="button"
                                    onClick={() => setSelectedImageIndex(index)}
                                    style={{
                                        width: "64px",
                                        height: "64px",
                                        borderRadius: "6px",
                                        border: "2px solid",
                                        borderColor:
                                            selectedImageIndex === index
                                                ? "var(--primary)"
                                                : "var(--border)",
                                        padding: "2px",
                                        backgroundColor: "var(--bg)",
                                        cursor: "pointer",
                                        overflow: "hidden"
                                    }}
                                >
                                    <img
                                        src={img.url}
                                        alt={`Thumbnail ${index + 1}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Details & Variant Picker */}
                <div>
                    {/* Brand & Category badges */}
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                        {product.categoryId?.name && (
                            <span
                                style={{
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    color: "var(--primary)",
                                    backgroundColor: "rgba(37, 99, 235, 0.08)",
                                    padding: "2px 8px",
                                    borderRadius: "4px"
                                }}
                            >
                                {product.categoryId.name}
                            </span>
                        )}
                        {product.brand && (
                            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "500" }}>
                                {product.brand}
                            </span>
                        )}
                    </div>

                    {/* Product Name */}
                    <h1
                        style={{
                            fontSize: "26px",
                            fontWeight: "700",
                            color: "var(--text)",
                            marginBottom: "16px",
                            lineHeight: "1.2"
                        }}
                    >
                        {product.name}
                    </h1>

                    {/* Price Section */}
                    {selectedVariant ? (
                        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "8px" }}>
                            <span style={{ fontSize: "28px", fontWeight: "700", color: "var(--text)" }}>
                                ₹{selectedVariant.price}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span
                                        style={{
                                            fontSize: "18px",
                                            color: "var(--text-muted)",
                                            textDecoration: "line-through"
                                        }}
                                    >
                                        ₹{selectedVariant.compareAtPrice}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: "700",
                                            color: "#16a34a",
                                            backgroundColor: "#dcfce7",
                                            padding: "2px 8px",
                                            borderRadius: "4px"
                                        }}
                                    >
                                        {discountPercentage}% OFF
                                    </span>
                                </>
                            )}
                        </div>
                    ) : (
                        <p style={{ color: "var(--text-muted)", fontSize: "18px", marginBottom: "8px" }}>
                            Pricing unavailable
                        </p>
                    )}

                    {selectedVariant?.sku && (
                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>
                            SKU: <strong>{selectedVariant.sku}</strong>
                        </p>
                    )}

                    <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />

                    {/* Description */}
                    {product.description && (
                        <div style={{ marginBottom: "20px" }}>
                            <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "6px" }}>
                                Description
                            </h3>
                            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: "1.6" }}>
                                {product.description}
                            </p>
                        </div>
                    )}

                    {/* Variant Selector */}
                    <VariantSelector
                        variants={variants}
                        selectedVariant={selectedVariant}
                        onSelectVariant={setSelectedVariant}
                    />

                    {/* Quantity Selector & Add to Cart */}
                    <div style={{ marginTop: "24px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: "600",
                                marginBottom: "8px"
                            }}
                        >
                            Quantity:
                        </label>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    overflow: "hidden"
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(-1)}
                                    disabled={quantity <= 1}
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        border: "none",
                                        backgroundColor: "var(--bg-secondary)",
                                        color: "var(--text)",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        cursor: quantity <= 1 ? "not-allowed" : "pointer"
                                    }}
                                >
                                    -
                                </button>
                                <span
                                    style={{
                                        width: "44px",
                                        textAlign: "center",
                                        fontSize: "14px",
                                        fontWeight: "600"
                                    }}
                                >
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(1)}
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        border: "none",
                                        backgroundColor: "var(--bg-secondary)",
                                        color: "var(--text)",
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    +
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!selectedVariant}
                                style={{
                                    flex: 1,
                                    padding: "10px 20px",
                                    backgroundColor: selectedVariant ? "var(--primary)" : "var(--border)",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    cursor: selectedVariant ? "pointer" : "not-allowed",
                                    transition: "background-color 0.2s ease"
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>

                        {feedback && (
                            <div
                                style={{
                                    padding: "10px 14px",
                                    backgroundColor: "rgba(37, 99, 235, 0.08)",
                                    border: "1px solid var(--primary)",
                                    borderRadius: "6px",
                                    color: "var(--primary)",
                                    fontSize: "13px"
                                }}
                            >
                                {feedback}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
