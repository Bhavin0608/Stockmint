import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById, cancelOrder } from "../../services/order.service";

const getStatusBadge = (status) => {
    const config = {
        confirmed: { label: "Confirmed", bg: "#dbeafe", color: "#1e40af" },
        shipped: { label: "Shipped", bg: "#fef3c7", color: "#92400e" },
        delivered: { label: "Delivered", bg: "#dcfce7", color: "#166534" },
        cancelled: { label: "Cancelled", bg: "#fee2e2", color: "#991b1b" },
        pending: { label: "Pending", bg: "#f3f4f6", color: "#374151" }
    };

    const current = config[status] || config.pending;

    return (
        <span
            style={{
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: "12px",
                backgroundColor: current.bg,
                color: current.color
            }}
        >
            {current.label}
        </span>
    );
};

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        let isMounted = true;

        getOrderById(id)
            .then((response) => {
                if (isMounted && response?.data) {
                    setOrder(response.data);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error("Failed to load order:", err);
                    setError(err.response?.data?.message || "Order not found or inaccessible.");
                }
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

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        try {
            setCancelling(true);
            const response = await cancelOrder(id);
            if (response?.data) {
                setOrder(response.data);
                setActionMessage("Order was cancelled successfully.");
                setTimeout(() => setActionMessage(""), 4000);
            }
        } catch (err) {
            console.error("Failed to cancel order:", err);
            alert(err.response?.data?.message || "Failed to cancel order.");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 24px", textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)" }}>Loading order details...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div style={{ maxWidth: "600px", margin: "60px auto", padding: "24px", textAlign: "center" }}>
                <h2 style={{ fontSize: "20px", color: "var(--danger)", marginBottom: "12px" }}>
                    {error || "Order Not Found"}
                </h2>
                <Link
                    to="/orders"
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "var(--primary)",
                        color: "#fff",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "500"
                    }}
                >
                    &larr; Back to My Orders
                </Link>
            </div>
        );
    }

    const shipping = order.shippingAddress || {};
    const items = order.items || [];
    const dateFormatted = new Date(order.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
    const canCancel = order.status === "confirmed";

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px", width: "100%" }}>
            {/* Breadcrumb */}
            <nav style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
                <Link to="/" style={{ color: "var(--text-muted)" }}>Home</Link>
                {" / "}
                <Link to="/orders" style={{ color: "var(--text-muted)" }}>My Orders</Link>
                {" / "}
                <span style={{ color: "var(--text)", fontWeight: "500" }}>Order #{order._id}</span>
            </nav>

            {/* Notification alert */}
            {actionMessage && (
                <div
                    style={{
                        padding: "12px 16px",
                        backgroundColor: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        borderRadius: "6px",
                        color: "#065f46",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "20px"
                    }}
                >
                    {actionMessage}
                </div>
            )}

            {/* Header Card */}
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    padding: "24px",
                    marginBottom: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px"
                }}
            >
                <div>
                    <h1 style={{ fontSize: "22px", fontWeight: "700", color: "var(--text)", marginBottom: "4px" }}>
                        Order Details
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                        Placed on {dateFormatted} • ID: <span style={{ fontFamily: "monospace", fontWeight: "600" }}>{order._id}</span>
                    </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {getStatusBadge(order.status)}

                    {canCancel && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={cancelling}
                            style={{
                                padding: "7px 14px",
                                backgroundColor: "transparent",
                                border: "1px solid var(--danger)",
                                color: "var(--danger)",
                                borderRadius: "6px",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: cancelling ? "not-allowed" : "pointer"
                            }}
                        >
                            {cancelling ? "Cancelling..." : "Cancel Order"}
                        </button>
                    )}
                </div>
            </div>

            {/* 2 Column Details: Items Table and Delivery Summary */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "24px",
                    alignItems: "start"
                }}
            >
                {/* Items List */}
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "24px"
                    }}
                >
                    <h2 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "16px", color: "var(--text)" }}>
                        Ordered Items ({items.length})
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {items.map((item, idx) => {
                            const sub = item.unitPrice * item.quantity;
                            const attributesList = item.attributes
                                ? Object.entries(item.attributes).map(([k, v]) => `${k}: ${v}`).join(" | ")
                                : "";

                            return (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        paddingBottom: "12px",
                                        borderBottom: idx < items.length - 1 ? "1px solid var(--border)" : "none"
                                    }}
                                >
                                    <div>
                                        <p style={{ fontWeight: "600", color: "var(--text)", fontSize: "15px" }}>
                                            {item.productName}
                                        </p>
                                        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                                            SKU: <strong>{item.sku}</strong>
                                            {attributesList && ` • ${attributesList}`}
                                        </p>
                                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
                                            Qty: {item.quantity} × ₹{item.unitPrice}
                                        </p>
                                    </div>

                                    <strong style={{ fontSize: "16px", color: "var(--text)" }}>
                                        ₹{sub}
                                    </strong>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Sidebar: Delivery Address & Order Bill */}
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {/* Shipping Address */}
                    <div
                        style={{
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            padding: "20px"
                        }}
                    >
                        <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "12px", color: "var(--text)" }}>
                            Delivery Destination
                        </h3>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}>
                            {shipping.fullName}
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.5" }}>
                            {shipping.addressLine1}
                            {shipping.addressLine2 && <>, {shipping.addressLine2}</>}
                            <br />
                            {shipping.city}, {shipping.state} - {shipping.postalCode}
                            <br />
                            {shipping.country}
                        </p>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "6px" }}>
                            Contact Phone: <strong>{shipping.phone}</strong>
                        </p>
                    </div>

                    {/* Payment & Price Breakdown */}
                    <div
                        style={{
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            padding: "20px"
                        }}
                    >
                        <h3 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "12px", color: "var(--text)" }}>
                            Payment & Totals
                        </h3>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                            <span style={{ color: "var(--text-muted)" }}>Payment Method</span>
                            <strong>Cash on Delivery (COD)</strong>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                            <span style={{ color: "var(--text-muted)" }}>Payment Status</span>
                            <span style={{ textTransform: "capitalize", fontWeight: "600" }}>{order.paymentStatus}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
                            <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                            <span>₹{order.subtotal}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px" }}>
                            <span style={{ color: "var(--text-muted)" }}>Delivery Fee</span>
                            <span style={{ color: "#16a34a", fontWeight: "600" }}>Free</span>
                        </div>

                        <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "10px 0" }} />

                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "17px", fontWeight: "700" }}>
                            <span>Total Amount</span>
                            <span style={{ color: "var(--primary)" }}>₹{order.totalAmount}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
