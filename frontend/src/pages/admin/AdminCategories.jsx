import { useState, useEffect } from "react";
import { getCategories } from "../../services/category.service";
import { deleteCategory } from "../../services/admin.service";
import CategoryModal from "./CategoryModal";

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionMessage, setActionMessage] = useState(null);

    const loadCategories = () => {
        getCategories()
            .then((res) => {
                setCategories(res.data || []);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Failed to load categories.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const handleAdd = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleEdit = (cat) => {
        setSelectedCategory(cat);
        setIsModalOpen(true);
    };

    const handleDeactivate = async (cat) => {
        const confirmed = window.confirm(`Are you sure you want to deactivate the "${cat.name}" category?`);
        if (!confirmed) return;

        try {
            await deleteCategory(cat._id);
            setActionMessage(`Category "${cat.name}" deactivated.`);
            setTimeout(() => setActionMessage(null), 3000);
            loadCategories();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to deactivate category.");
        }
    };

    const handleSaved = () => {
        setIsModalOpen(false);
        setActionMessage("Category saved successfully!");
        setTimeout(() => setActionMessage(null), 3000);
        loadCategories();
    };

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Top Toolbar */}
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
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flex: "1 1 240px", maxWidth: "400px" }}>
                    <input
                        type="text"
                        placeholder="Search categories by name or slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            fontSize: "14px",
                            backgroundColor: "var(--bg)",
                            outline: "none"
                        }}
                    />
                </div>

                <button
                    onClick={handleAdd}
                    style={{
                        padding: "9px 18px",
                        backgroundColor: "var(--primary)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                    }}
                >
                    + Add Category
                </button>
            </div>

            {/* Notification messages */}
            {actionMessage && (
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
                    {actionMessage}
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

            {/* Table */}
            {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                    Loading categories...
                </div>
            ) : filteredCategories.length === 0 ? (
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
                        {searchTerm ? "No categories matched your search." : "No categories found. Click '+ Add Category' to create one."}
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
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Name</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Slug</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Description</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Status</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)", textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.map((cat) => (
                                    <tr key={cat._id} style={{ borderBottom: "1px solid var(--border)" }}>
                                        <td style={{ padding: "14px 16px", fontWeight: "600", color: "var(--text)" }}>
                                            {cat.name}
                                        </td>
                                        <td style={{ padding: "14px 16px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                                            {cat.slug}
                                        </td>
                                        <td style={{ padding: "14px 16px", color: "var(--text-muted)", maxWidth: "250px" }}>
                                            {cat.description || "—"}
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    padding: "2px 8px",
                                                    borderRadius: "12px",
                                                    fontSize: "12px",
                                                    fontWeight: "600",
                                                    backgroundColor: cat.isActive !== false ? "#dcfce7" : "#fee2e2",
                                                    color: cat.isActive !== false ? "#166534" : "#991b1b"
                                                }}
                                            >
                                                {cat.isActive !== false ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                            <div style={{ display: "inline-flex", gap: "8px" }}>
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    style={{
                                                        padding: "6px 12px",
                                                        borderRadius: "4px",
                                                        border: "1px solid var(--border)",
                                                        backgroundColor: "var(--bg)",
                                                        color: "var(--text)",
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeactivate(cat)}
                                                    style={{
                                                        padding: "6px 12px",
                                                        borderRadius: "4px",
                                                        border: "1px solid #fecaca",
                                                        backgroundColor: "#fef2f2",
                                                        color: "var(--danger)",
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Deactivate
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <CategoryModal
                    category={selectedCategory}
                    onClose={() => setIsModalOpen(false)}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
};

export default AdminCategories;
