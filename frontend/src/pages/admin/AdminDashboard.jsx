import { useSearchParams } from "react-router-dom";
import AdminOverview from "./AdminOverview";
import AdminProducts from "./AdminProducts";
import AdminCategories from "./AdminCategories";
import AdminOrders from "./AdminOrders";

const AdminDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentTab = searchParams.get("tab") || "overview";

    const setTab = (tabKey) => {
        setSearchParams({ tab: tabKey });
    };

    const tabs = [
        { key: "overview", label: "Overview", icon: "📊" },
        { key: "products", label: "Products & Stock", icon: "🛍️" },
        { key: "categories", label: "Categories", icon: "🏷️" },
        { key: "orders", label: "Orders", icon: "📦" }
    ];

    return (
        <div style={{ maxWidth: "1200px", margin: "32px auto", padding: "0 20px" }}>
            {/* Admin Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginBottom: "28px"
                }}
            >
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)" }}>Admin Dashboard</h1>
                        <span
                            style={{
                                backgroundColor: "#e0e7ff",
                                color: "#3730a3",
                                fontSize: "12px",
                                fontWeight: "700",
                                padding: "3px 10px",
                                borderRadius: "12px",
                                letterSpacing: "0.5px"
                            }}
                        >
                            Console
                        </span>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
                        Manage inventory, catalog categories, product variants, and customer fulfillment.
                    </p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div
                style={{
                    display: "flex",
                    gap: "8px",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: "24px",
                    overflowX: "auto"
                }}
            >
                {tabs.map((tab) => {
                    const isActive = currentTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setTab(tab.key)}
                            style={{
                                padding: "10px 18px",
                                border: "none",
                                borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
                                backgroundColor: "transparent",
                                color: isActive ? "var(--primary)" : "var(--text-muted)",
                                fontWeight: isActive ? "600" : "500",
                                fontSize: "14px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                transition: "all 0.2s ease",
                                whiteSpace: "nowrap"
                            }}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Contents */}
            <div>
                {currentTab === "overview" && <AdminOverview onSwitchTab={setTab} />}
                {currentTab === "products" && <AdminProducts />}
                {currentTab === "categories" && <AdminCategories />}
                {currentTab === "orders" && <AdminOrders />}
            </div>
        </div>
    );
};

export default AdminDashboard;
