import { useState, useEffect } from "react";
import { getAllOrdersAdmin } from "../../services/admin.service";
import { getProducts } from "../../services/product.service";
import { getCategories } from "../../services/category.service";

const AdminOverview = ({ onSwitchTab }) => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCategories: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        Promise.all([
            getAllOrdersAdmin().catch(() => ({ data: [] })),
            getProducts({ page: 1, limit: 100 }).catch(() => ({ data: { products: [], pagination: { total: 0 } } })),
            getCategories().catch(() => ({ data: [] }))
        ])
            .then(([ordersRes, productsRes, catsRes]) => {
                if (!isMounted) return;

                const orders = ordersRes.data || [];
                const products = productsRes.data?.products || [];
                const categories = catsRes.data || [];

                const revenue = orders
                    .filter((o) => o.status !== "cancelled")
                    .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

                setStats({
                    totalRevenue: revenue,
                    totalOrders: orders.length,
                    totalProducts: productsRes.data?.pagination?.total || products.length,
                    totalCategories: categories.length,
                    recentOrders: orders.slice(0, 5)
                });
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const statCards = [
        {
            title: "Total Revenue",
            value: `$${stats.totalRevenue.toFixed(2)}`,
            subtext: "Non-cancelled orders",
            color: "#16a34a"
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            subtext: "All customer purchases",
            color: "#2563eb"
        },
        {
            title: "Catalog Products",
            value: stats.totalProducts,
            subtext: "Active in storefront",
            color: "#d97706"
        },
        {
            title: "Categories",
            value: stats.totalCategories,
            subtext: "Organized classifications",
            color: "#9333ea"
        }
    ];

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                Loading admin metrics...
            </div>
        );
    }

    return (
        <div>
            {/* Stat Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "16px",
                    marginBottom: "28px"
                }}
            >
                {statCards.map((card, idx) => (
                    <div
                        key={idx}
                        style={{
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "10px",
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between"
                        }}
                    >
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>
                            {card.title}
                        </span>
                        <div style={{ fontSize: "28px", fontWeight: "700", color: card.color, margin: "10px 0 4px" }}>
                            {card.value}
                        </div>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{card.subtext}</span>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Recent Orders Grid */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "24px"
                }}
            >
                {/* Recent Orders Overview */}
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "16px"
                        }}
                    >
                        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)" }}>Recent Orders</h3>
                        <button
                            onClick={() => onSwitchTab("orders")}
                            style={{
                                background: "none",
                                border: "none",
                                color: "var(--primary)",
                                fontSize: "13px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            View All →
                        </button>
                    </div>

                    {stats.recentOrders.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "14px", padding: "20px 0", textAlign: "center" }}>
                            No orders placed yet.
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {stats.recentOrders.map((ord) => (
                                <div
                                    key={ord._id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "10px 12px",
                                        backgroundColor: "var(--bg-secondary)",
                                        borderRadius: "6px",
                                        fontSize: "13px"
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: "600", color: "var(--text)" }}>
                                            {ord.shippingAddress?.fullName || "Customer"}
                                        </div>
                                        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                                            #{ord._id.slice(-8)} • {ord.items?.length || 0} item(s)
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontWeight: "700", color: "var(--text)" }}>
                                            ${Number(ord.totalAmount).toFixed(2)}
                                        </div>
                                        <span
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: "600",
                                                textTransform: "capitalize",
                                                color:
                                                    ord.status === "delivered"
                                                        ? "#166534"
                                                        : ord.status === "cancelled"
                                                        ? "#991b1b"
                                                        : "#0369a1"
                                            }}
                                        >
                                            {ord.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Shortcuts */}
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "10px",
                        padding: "20px"
                    }}
                >
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--text)", marginBottom: "16px" }}>
                        Quick Admin Actions
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <button
                            onClick={() => onSwitchTab("products")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "14px 16px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--bg)",
                                color: "var(--text)",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                textAlign: "left"
                            }}
                        >
                            <span>🛍️ Manage Products & Variant Stock</span>
                            <span style={{ color: "var(--primary)" }}>→</span>
                        </button>

                        <button
                            onClick={() => onSwitchTab("categories")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "14px 16px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--bg)",
                                color: "var(--text)",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                textAlign: "left"
                            }}
                        >
                            <span>🏷️ Organize Product Categories</span>
                            <span style={{ color: "var(--primary)" }}>→</span>
                        </button>

                        <button
                            onClick={() => onSwitchTab("orders")}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "14px 16px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--bg)",
                                color: "var(--text)",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                                textAlign: "left"
                            }}
                        >
                            <span>📦 Fulfill & Update Customer Orders</span>
                            <span style={{ color: "var(--primary)" }}>→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
