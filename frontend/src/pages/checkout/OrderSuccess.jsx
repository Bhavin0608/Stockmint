import { useLocation, Link, Navigate } from "react-router-dom";

const OrderSuccess = () => {
    const location = useLocation();
    const order = location.state?.order;

    if (!order) {
        return <Navigate to="/" replace />;
    }

    const shipping = order.shippingAddress || {};

    return (
        <div style={{ maxWidth: "650px", margin: "60px auto", padding: "0 24px", width: "100%" }}>
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "40px 32px",
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}
            >
                {/* Success Icon */}
                <div
                    style={{
                        width: "64px",
                        height: "64px",
                        backgroundColor: "#dcfce7",
                        color: "#16a34a",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "32px",
                        margin: "0 auto 20px"
                    }}
                >
                    ✓
                </div>

                <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                    Order Placed Successfully!
                </h1>

                <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "28px" }}>
                    Thank you for shopping with Stockmint. Your Cash on Delivery (COD) order has been confirmed.
                </p>

                {/* Order Details Card */}
                <div
                    style={{
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "20px",
                        textAlign: "left",
                        marginBottom: "32px",
                        fontSize: "14px"
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Order ID:</span>
                        <strong style={{ color: "var(--text)", fontFamily: "monospace" }}>{order._id}</strong>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Payment Method:</span>
                        <strong>Cash on Delivery (COD)</strong>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Total Amount:</span>
                        <strong style={{ fontSize: "16px", color: "var(--primary)" }}>₹{order.totalAmount}</strong>
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "12px 0" }} />

                    <div>
                        <span style={{ color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                            Delivery Address:
                        </span>
                        <p style={{ color: "var(--text)", lineHeight: "1.4" }}>
                            <strong>{shipping.fullName}</strong> ({shipping.phone})
                            <br />
                            {shipping.addressLine1}
                            {shipping.addressLine2 && <>, {shipping.addressLine2}</>}
                            <br />
                            {shipping.city}, {shipping.state} - {shipping.postalCode}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link
                        to="/orders"
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "var(--primary)",
                            color: "#fff",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}
                    >
                        View My Orders
                    </Link>

                    <Link
                        to="/"
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "var(--bg-secondary)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
