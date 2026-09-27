import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserOrders, cancelOrder } from "../../services/order.service";

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
                fontSize: "12px",
                fontWeight: "700",
                textTransform: "uppercase",
                padding: "3px 10px",
                borderRadius: "12px",
                backgroundColor: current.bg,
                color: current.color
            }}
        >
            {current.label}
        </span>
    );
};

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        let isMounted = true;

        getUserOrders()
            .then((response) => {
                if (isMounted && response?.data) {
                    setOrders(response.data);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error("Failed to load orders:", err);
                    setError(err.response?.data?.message || "Failed to load orders.");
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
    }, [refreshTrigger]);

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order? This will release reserved inventory.")) {
            return;
        }

        try {
            await cancelOrder(orderId);
            setActionMessage("Order cancelled successfully.");
            setTimeout(() => setActionMessage(""), 3500);
            setLoading(true);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to cancel order:", err);
            alert(err.response?.data?.message || "Failed to cancel order.");
        }
    };

    const filteredOrders =
        statusFilter === "all"
            ? orders
            : orders.filter((o) => o.status === statusFilter);

    const filterTabs = [
        { id: "all", label: "All Orders" },
        { id: "confirmed", label: "Confirmed" },
        { id: "shipped", label: "Shipped" },
        { id: "delivered", label: "Delivered" },
        { id: "cancelled", label: "Cancelled" }
    ];

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px", width: "100%" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)", marginBottom: "8px" }}>
                My Orders
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "24px" }}>
                View your order history, tracking status, and order details.
            </p>

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

            {/* Error alert */}
            {error && (
                <div
                    style={{
                        padding: "12px 16px",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        color: "var(--danger)",
                        fontSize: "14px",
                        marginBottom: "20px"
                    }}
                >
                    {error}
                </div>
            )}

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginBottom: "24px", paddingBottom: "4px" }}>
                {filterTabs.map((tab) => {
                    const isActive = statusFilter === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setStatusFilter(tab.id)}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "20px",
                                border: "1px solid",
                                borderColor: isActive ? "var(--primary)" : "var(--border)",
                                backgroundColor: isActive ? "var(--primary)" : "var(--bg-secondary)",
                                color: isActive ? "#fff" : "var(--text)",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                                transition: "all 0.15s ease"
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Orders List */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                    <p>Loading your orders...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "48px 24px",
                        textAlign: "center"
                    }}
                >
                    <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)", marginBottom: "8px" }}>
                        {statusFilter === "all" ? "No orders found" : `No ${statusFilter} orders`}
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
                        {statusFilter === "all"
                            ? "You haven't placed any orders with Stockmint yet."
                            : `You have no orders currently in "${statusFilter}" status.`}
                    </p>
                    <Link
                        to="/"
                        style={{
                            padding: "9px 18px",
                            backgroundColor: "var(--primary)",
                            color: "#fff",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "600",
                            display: "inline-block"
                        }}
                    >
                        Explore Products
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {filteredOrders.map((order) => {
                        const dateFormatted = new Date(order.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        });
                        const items = order.items || [];
                        const canCancel = order.status === "confirmed";

                        return (
                            <div
                                key={order._id}
                                style={{
                                    backgroundColor: "var(--card-bg)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "8px",
                                    padding: "20px",
                                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "14px"
                                }}
                            >
                                {/* Top Header: Order ID, Date, and Status */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "12px",
                                        borderBottom: "1px solid var(--border)",
                                        paddingBottom: "12px"
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Order ID:</span>{" "}
                                        <strong style={{ fontSize: "14px", fontFamily: "monospace", color: "var(--text)" }}>
                                            {order._id}
                                        </strong>
                                        <span style={{ margin: "0 8px", color: "var(--border)" }}>•</span>
                                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{dateFormatted}</span>
                                    </div>

                                    <div>{getStatusBadge(order.status)}</div>
                                </div>

                                {/* Items Snapshot */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                fontSize: "14px"
                                            }}
                                        >
                                            <span style={{ color: "var(--text)" }}>
                                                <strong>{item.quantity}×</strong> {item.productName}{" "}
                                                <small style={{ color: "var(--text-muted)" }}>({item.sku})</small>
                                            </span>
                                            <span style={{ fontWeight: "600", color: "var(--text)" }}>
                                                ₹{item.unitPrice * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "4px 0" }} />

                                {/* Footer: Total, Recipient & Action Buttons */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        flexWrap: "wrap",
                                        gap: "12px"
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Total Amount:</span>{" "}
                                        <strong style={{ fontSize: "16px", color: "var(--primary)" }}>
                                            ₹{order.totalAmount}
                                        </strong>{" "}
                                        <small style={{ color: "var(--text-muted)" }}>
                                            (COD • {order.paymentStatus === "paid" ? "Paid" : "Pending Delivery"})
                                        </small>
                                    </div>

                                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                        {canCancel && (
                                            <button
                                                type="button"
                                                onClick={() => handleCancelOrder(order._id)}
                                                style={{
                                                    padding: "6px 12px",
                                                    backgroundColor: "transparent",
                                                    border: "1px solid var(--danger)",
                                                    color: "var(--danger)",
                                                    borderRadius: "4px",
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Cancel Order
                                            </button>
                                        )}

                                        <Link
                                            to={`/orders/${order._id}`}
                                            style={{
                                                padding: "6px 14px",
                                                backgroundColor: "var(--bg-secondary)",
                                                border: "1px solid var(--border)",
                                                borderRadius: "4px",
                                                color: "var(--text)",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                textDecoration: "none"
                                            }}
                                        >
                                            View Details &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderList;
