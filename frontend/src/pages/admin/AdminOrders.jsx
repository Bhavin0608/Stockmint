import { useState, useEffect } from "react";
import { getAllOrdersAdmin, updateOrderStatus, adminCancelOrder } from "../../services/admin.service";
import AdminOrderDetailModal from "./AdminOrderDetailModal";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [actionMsg, setActionMsg] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const loadOrders = () => {
        getAllOrdersAdmin()
            .then((res) => {
                setOrders(res.data || []);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Failed to load orders.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleQuickStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setActionMsg(`Order status updated to "${newStatus}".`);
            setTimeout(() => setActionMsg(null), 3000);
            loadOrders();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update order status.");
        }
    };

    const handleQuickCancel = async (order) => {
        const confirmed = window.confirm(`Are you sure you want to cancel order #${order._id}? Stock will be restored.`);
        if (!confirmed) return;

        try {
            await adminCancelOrder(order._id);
            setActionMsg(`Order #${order._id} cancelled.`);
            setTimeout(() => setActionMsg(null), 3000);
            loadOrders();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to cancel order.");
        }
    };

    const handleModalUpdated = () => {
        setActionMsg("Order updated successfully!");
        setTimeout(() => setActionMsg(null), 3000);
        setSelectedOrder(null);
        loadOrders();
    };

    const filteredOrders = orders.filter((o) => {
        if (statusFilter === "all") return true;
        return o.status === statusFilter;
    });

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

    const filters = ["all", "confirmed", "shipped", "delivered", "cancelled"];

    return (
        <div>
            {/* Filter buttons */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                    marginBottom: "20px"
                }}
            >
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            style={{
                                padding: "6px 14px",
                                borderRadius: "20px",
                                fontSize: "13px",
                                fontWeight: "600",
                                textTransform: "capitalize",
                                border: statusFilter === f ? "1px solid var(--primary)" : "1px solid var(--border)",
                                backgroundColor: statusFilter === f ? "var(--primary)" : "var(--bg)",
                                color: statusFilter === f ? "#fff" : "var(--text)",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                    Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
                </span>
            </div>

            {actionMsg && (
                <div
                    style={{
                        padding: "10px 16px",
                        backgroundColor: "#dcfce7",
                        border: "1px solid #86efac",
                        borderRadius: "6px",
                        color: "#166534",
                        fontSize: "13px",
                        marginBottom: "16px"
                    }}
                >
                    {actionMsg}
                </div>
            )}

            {error && (
                <div
                    style={{
                        padding: "10px 16px",
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

            {/* Orders Table */}
            {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                    Loading customer orders...
                </div>
            ) : filteredOrders.length === 0 ? (
                <div
                    style={{
                        padding: "40px",
                        textAlign: "center",
                        backgroundColor: "var(--card-bg)",
                        borderRadius: "8px",
                        border: "1px solid var(--border)"
                    }}
                >
                    <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
                        No orders found with status "{statusFilter}".
                    </p>
                </div>
            ) : (
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        overflow: "hidden"
                    }}
                >
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
                            <thead>
                                <tr style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Order ID</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Recipient</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Date</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Items</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Total</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Status</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)", textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => {
                                    const dateStr = order.createdAt
                                        ? new Date(order.createdAt).toLocaleDateString(undefined, {
                                              month: "short",
                                              day: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit"
                                          })
                                        : "—";

                                    const statusSt = getStatusStyle(order.status);

                                    return (
                                        <tr key={order._id} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: "12px", color: "var(--text)" }}>
                                                {order._id.slice(-8)}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <div style={{ fontWeight: "600", color: "var(--text)" }}>
                                                    {order.shippingAddress?.fullName || "Customer"}
                                                </div>
                                                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                                                    {order.shippingAddress?.phone}
                                                </div>
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>
                                                {dateStr}
                                            </td>
                                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text)" }}>
                                                {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? "s" : ""}
                                            </td>
                                            <td style={{ padding: "12px 16px", fontWeight: "700", color: "var(--text)" }}>
                                                ${Number(order.totalAmount).toFixed(2)}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        padding: "2px 8px",
                                                        borderRadius: "12px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        textTransform: "capitalize",
                                                        backgroundColor: statusSt.bg,
                                                        color: statusSt.color
                                                    }}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 16px", textAlign: "right" }}>
                                                <div style={{ display: "inline-flex", gap: "6px" }}>
                                                    {order.status === "confirmed" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleQuickStatusChange(order._id, "shipped")}
                                                                style={{
                                                                    padding: "5px 10px",
                                                                    borderRadius: "4px",
                                                                    border: "none",
                                                                    backgroundColor: "#0284c7",
                                                                    color: "#fff",
                                                                    fontSize: "12px",
                                                                    fontWeight: "600",
                                                                    cursor: "pointer"
                                                                }}
                                                            >
                                                                Ship
                                                            </button>
                                                            <button
                                                                onClick={() => handleQuickCancel(order)}
                                                                style={{
                                                                    padding: "5px 10px",
                                                                    borderRadius: "4px",
                                                                    border: "1px solid #fecaca",
                                                                    backgroundColor: "#fef2f2",
                                                                    color: "var(--danger)",
                                                                    fontSize: "12px",
                                                                    fontWeight: "500",
                                                                    cursor: "pointer"
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    )}

                                                    {order.status === "shipped" && (
                                                        <button
                                                            onClick={() => handleQuickStatusChange(order._id, "delivered")}
                                                            style={{
                                                                padding: "5px 10px",
                                                                borderRadius: "4px",
                                                                border: "none",
                                                                backgroundColor: "#16a34a",
                                                                color: "#fff",
                                                                fontSize: "12px",
                                                                fontWeight: "600",
                                                                cursor: "pointer"
                                                            }}
                                                        >
                                                            Deliver
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => setSelectedOrder(order)}
                                                        style={{
                                                            padding: "5px 10px",
                                                            borderRadius: "4px",
                                                            border: "1px solid var(--border)",
                                                            backgroundColor: "var(--bg)",
                                                            color: "var(--text)",
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <AdminOrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdated={handleModalUpdated}
                />
            )}
        </div>
    );
};

export default AdminOrders;
