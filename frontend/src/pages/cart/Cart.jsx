import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";

const Cart = () => {
    const { items, itemCount, totalAmount, loading, updateQuantity, removeItem } =
        useContext(CartContext);

    const handleQuantityChange = async (variantId, currentQty, delta) => {
        const nextQty = currentQty + delta;
        if (nextQty <= 0) {
            if (window.confirm("Remove this item from your cart?")) {
                await removeItem(variantId);
            }
        } else {
            await updateQuantity(variantId, nextQty);
        }
    };

    const handleRemove = async (variantId) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            await removeItem(variantId);
        }
    };

    if (items.length === 0) {
        return (
            <div style={{ maxWidth: "600px", margin: "60px auto", padding: "32px 24px", textAlign: "center" }}>
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "48px 24px"
                    }}
                >
                    <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "8px", color: "var(--text)" }}>
                        Your Cart is Empty
                    </h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
                        Looks like you haven't added anything to your shopping cart yet.
                    </p>
                    <Link
                        to="/"
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "var(--primary)",
                            color: "#fff",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontSize: "14px",
                            display: "inline-block"
                        }}
                    >
                        Explore Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px", width: "100%" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)", marginBottom: "24px" }}>
                Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "32px",
                    alignItems: "start"
                }}
            >
                {/* Left Column: Cart Items List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {items.map((item, index) => {
                        const variant = item.variantId || {};
                        const product = variant.productId || {};
                        const itemPrice = variant.price || 0;
                        const itemSubtotal = itemPrice * item.quantity;

                        // Format variant attributes (e.g. Size: M, Color: Black)
                        const attributesList = variant.attributes
                            ? Object.entries(variant.attributes).map(([k, v]) => `${k}: ${v}`).join(" | ")
                            : "";

                        return (
                            <div
                                key={variant._id || index}
                                style={{
                                    backgroundColor: "var(--card-bg)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px"
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                                    <div>
                                        <Link
                                            to={product._id ? `/products/${product._id}` : "#"}
                                            style={{
                                                fontSize: "16px",
                                                fontWeight: "600",
                                                color: "var(--text)",
                                                textDecoration: "none"
                                            }}
                                        >
                                            {product.name || "Product"}
                                        </Link>

                                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
                                            SKU: <strong>{variant.sku || "N/A"}</strong>
                                            {attributesList && ` • ${attributesList}`}
                                        </p>
                                    </div>

                                    {/* Unit price */}
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)" }}>
                                            ₹{itemPrice}
                                        </span>
                                        {variant.compareAtPrice && variant.compareAtPrice > itemPrice && (
                                            <p style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "line-through" }}>
                                                ₹{variant.compareAtPrice}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "4px 0" }} />

                                {/* Row Controls: Quantity & Subtotal */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                border: "1px solid var(--border)",
                                                borderRadius: "4px",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(variant._id, item.quantity, -1)}
                                                disabled={loading}
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    border: "none",
                                                    backgroundColor: "var(--bg-secondary)",
                                                    color: "var(--text)",
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                    cursor: loading ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                -
                                            </button>
                                            <span style={{ width: "36px", textAlign: "center", fontSize: "13px", fontWeight: "600" }}>
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleQuantityChange(variant._id, item.quantity, 1)}
                                                disabled={loading}
                                                style={{
                                                    width: "32px",
                                                    height: "32px",
                                                    border: "none",
                                                    backgroundColor: "var(--bg-secondary)",
                                                    color: "var(--text)",
                                                    fontSize: "14px",
                                                    fontWeight: "600",
                                                    cursor: loading ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemove(variant._id)}
                                            disabled={loading}
                                            style={{
                                                backgroundColor: "transparent",
                                                border: "none",
                                                color: "var(--danger)",
                                                fontSize: "13px",
                                                fontWeight: "500",
                                                cursor: loading ? "not-allowed" : "pointer",
                                                padding: "4px 8px"
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div>
                                        <span style={{ fontSize: "13px", color: "var(--text-muted)", marginRight: "6px" }}>
                                            Total:
                                        </span>
                                        <span style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)" }}>
                                            ₹{itemSubtotal}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Right Column: Order Summary Card */}
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "24px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        position: "sticky",
                        top: "80px"
                    }}
                >
                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "var(--text)" }}>
                        Order Summary
                    </h3>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Total Items</span>
                        <span style={{ fontWeight: "600", color: "var(--text)" }}>{itemCount}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                        <span style={{ fontWeight: "600", color: "var(--text)" }}>₹{totalAmount}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Delivery</span>
                        <span style={{ fontWeight: "600", color: "#16a34a" }}>Free</span>
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "18px", fontWeight: "700" }}>
                        <span>Total to Pay</span>
                        <span style={{ color: "var(--primary)" }}>₹{totalAmount}</span>
                    </div>

                    <Link
                        to="/checkout"
                        style={{
                            display: "block",
                            width: "100%",
                            padding: "12px",
                            backgroundColor: "var(--primary)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            textAlign: "center",
                            fontSize: "15px",
                            fontWeight: "600",
                            textDecoration: "none",
                            boxSizing: "border-box"
                        }}
                    >
                        Proceed to Checkout
                    </Link>

                    <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "12px" }}>
                        Cash on Delivery (COD) supported.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Cart;
