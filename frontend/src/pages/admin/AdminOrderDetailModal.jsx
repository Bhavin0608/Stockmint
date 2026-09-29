import { useState } from "react";
import { updateOrderStatus, adminCancelOrder } from "../../services/admin.service";

const AdminOrderDetailModal = ({ order, onClose, onUpdated }) => {
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        setError(null);
        try {
            await updateOrderStatus(order._id, newStatus);
            onUpdated();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update order status.");
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = async () => {
        const confirmed = window.confirm("Are you sure you want to cancel this order? Stock will be restored.");
        if (!confirmed) return;

        setUpdating(true);
        setError(null);
        try {
            await adminCancelOrder(order._id);
            onUpdated();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to cancel order.");
        } finally {
            setUpdating(false);
        }
    };

    const dateFormatted = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
          })
        : "N/A";

    const getStatusStyle = (status) => {
        switch (status) {
            case "delivered":
                return { bg: "#dcfce7", color: "#166534" };
            case "shipped":
                return { bg: "#e0f2fe", color: "#0369a1" };
            case "confirmed":
                return { bg: "#fef3c7", color: "#92400e" };
            case "cancelled":
                return { bg: "#fee2e2", color: "#991b1b" };
            default:
                return { bg: "#f1f5f9", color: "#475569" };
        }
    };

    const statusStyle = getStatusStyle(order.status);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(15, 23, 42, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: "16px"
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "700px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    padding: "24px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div>
                        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)" }}>
                            Order Details
                        </h2>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                            #{order._id}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "var(--text-muted)"
                        }}
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div
                        style={{
                            padding: "10px 14px",
                            backgroundColor: "#fee2e2",
                            border: "1px solid #f87171",
                            borderRadius: "6px",
                            color: "#b91c1c",
                            fontSize: "13px",
                            marginBottom: "16px"
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Summary bar */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: "var(--bg-secondary)",
                        padding: "12px 16px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                        gap: "10px"
                    }}
                >
                    <div>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Placed on</span>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>{dateFormatted}</span>
                    </div>

                    <div>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Status</span>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "600",
                                textTransform: "capitalize",
                                backgroundColor: statusStyle.bg,
                                color: statusStyle.color
                            }}
                        >
                            {order.status}
                        </span>
                    </div>

                    <div>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Payment</span>
                        <span
                            style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "600",
                                textTransform: "capitalize",
                                backgroundColor: order.paymentStatus === "paid" ? "#dcfce7" : "#fef3c7",
                                color: order.paymentStatus === "paid" ? "#166534" : "#92400e"
                            }}
                        >
                            {order.paymentStatus || "pending"}
                        </span>
                    </div>

                    <div>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>Total Amount</span>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "var(--primary)" }}>
                            ${Number(order.totalAmount).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Shipping info */}
                <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "8px" }}>
                        Delivery Destination
                    </h3>
                    <div style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", borderRadius: "6px", padding: "12px", fontSize: "13px" }}>
                        <div style={{ fontWeight: "600", color: "var(--text)" }}>{order.shippingAddress?.fullName}</div>
                        <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>Phone: {order.shippingAddress?.phone}</div>
                        <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                            {order.shippingAddress?.addressLine1}
                            {order.shippingAddress?.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""}
                        </div>
                        <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state || ""} {order.shippingAddress?.postalCode},{" "}
                            {order.shippingAddress?.country}
                        </div>
                    </div>
                </div>

                {/* Order items */}
                <div style={{ marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "8px" }}>
                        Order Items ({order.items?.length || 0})
                    </h3>
                    <div style={{ border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                            <thead>
                                <tr style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                                    <th style={{ padding: "8px 12px", color: "var(--text-muted)", fontWeight: "600" }}>Item</th>
                                    <th style={{ padding: "8px 12px", color: "var(--text-muted)", fontWeight: "600" }}>SKU</th>
                                    <th style={{ padding: "8px 12px", color: "var(--text-muted)", fontWeight: "600", textAlign: "right" }}>Price</th>
                                    <th style={{ padding: "8px 12px", color: "var(--text-muted)", fontWeight: "600", textAlign: "center" }}>Qty</th>
                                    <th style={{ padding: "8px 12px", color: "var(--text-muted)", fontWeight: "600", textAlign: "right" }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item, index) => {
                                    const attrs = item.attributes instanceof Map ? Object.fromEntries(item.attributes) : item.attributes || {};
                                    const attrString = Object.entries(attrs)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(", ");

                                    return (
                                        <tr key={index} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "10px 12px" }}>
                                                <div style={{ fontWeight: "600", color: "var(--text)" }}>{item.productName}</div>
                                                {attrString && (
                                                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{attrString}</div>
                                                )}
                                            </td>
                                            <td style={{ padding: "10px 12px", fontFamily: "monospace", color: "var(--text-muted)" }}>
                                                {item.sku}
                                            </td>
                                            <td style={{ padding: "10px 12px", textAlign: "right" }}>
                                                ${Number(item.unitPrice).toFixed(2)}
                                            </td>
                                            <td style={{ padding: "10px 12px", textAlign: "center" }}>
                                                {item.quantity}
                                            </td>
                                            <td style={{ padding: "10px 12px", textAlign: "right", fontWeight: "600" }}>
                                                ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Status action controls */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "16px",
                        borderTop: "1px solid var(--border)",
                        flexWrap: "wrap",
                        gap: "10px"
                    }}
                >
                    <div style={{ display: "flex", gap: "8px" }}>
                        {order.status === "confirmed" && (
                            <>
                                <button
                                    onClick={() => handleStatusChange("shipped")}
                                    disabled={updating}
                                    style={{
                                        padding: "8px 14px",
                                        borderRadius: "6px",
                                        border: "none",
                                        backgroundColor: "#0284c7",
                                        color: "#fff",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        cursor: updating ? "not-allowed" : "pointer"
                                    }}
                                >
                                    {updating ? "Updating..." : "Mark as Shipped"}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={updating}
                                    style={{
                                        padding: "8px 14px",
                                        borderRadius: "6px",
                                        border: "1px solid #fecaca",
                                        backgroundColor: "#fef2f2",
                                        color: "var(--danger)",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        cursor: updating ? "not-allowed" : "pointer"
                                    }}
                                >
                                    Cancel Order
                                </button>
                            </>
                        )}

                        {order.status === "shipped" && (
                            <button
                                onClick={() => handleStatusChange("delivered")}
                                disabled={updating}
                                style={{
                                    padding: "8px 14px",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: "#16a34a",
                                    color: "#fff",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: updating ? "not-allowed" : "pointer"
                                }}
                            >
                                {updating ? "Updating..." : "Mark as Delivered"}
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg)",
                            color: "var(--text)",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer"
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetailModal;
