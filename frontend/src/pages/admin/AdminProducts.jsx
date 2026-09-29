import { useState, useEffect } from "react";
import { getProducts } from "../../services/product.service";
import { getCategories } from "../../services/category.service";
import { deleteProduct } from "../../services/admin.service";
import ProductModal from "./ProductModal";
import VariantManagerModal from "./VariantManagerModal";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
    const [actionMsg, setActionMsg] = useState(null);

    // Modals
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [variantProduct, setVariantProduct] = useState(null);

    const loadData = () => {
        Promise.all([
            getProducts({ page: 1, limit: 100 }),
            getCategories()
        ])
            .then(([productsRes, catsRes]) => {
                setProducts(productsRes.data?.products || []);
                setCategories(catsRes.data || []);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Failed to load products or categories.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = () => {
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const handleEdit = (p) => {
        setEditingProduct(p);
        setIsProductModalOpen(true);
    };

    const handleOpenVariants = (p) => {
        setVariantProduct(p);
        setIsVariantModalOpen(true);
    };

    const handleArchive = async (p) => {
        const confirmed = window.confirm(`Are you sure you want to archive "${p.name}"?`);
        if (!confirmed) return;

        try {
            await deleteProduct(p._id);
            setActionMsg(`Product "${p.name}" archived.`);
            setTimeout(() => setActionMsg(null), 3000);
            loadData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to archive product.");
        }
    };

    const handleProductSaved = () => {
        setIsProductModalOpen(false);
        setActionMsg("Product saved successfully!");
        setTimeout(() => setActionMsg(null), 3000);
        loadData();
    };

    const filteredProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));

        const catId = p.categoryId?._id || p.categoryId;
        const matchesCategory = selectedCategoryFilter ? catId === selectedCategoryFilter : true;

        return matchesSearch && matchesCategory;
    });

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
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flex: "1 1 300px" }}>
                    <input
                        type="text"
                        placeholder="Search products by name, slug, brand..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            flex: "1 1 200px",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            fontSize: "14px",
                            backgroundColor: "var(--bg)",
                            outline: "none"
                        }}
                    />

                    <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        style={{
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            fontSize: "14px",
                            backgroundColor: "var(--bg)",
                            outline: "none"
                        }}
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
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
                        cursor: "pointer"
                    }}
                >
                    + Add Product
                </button>
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

            {/* Table */}
            {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                    Loading products...
                </div>
            ) : filteredProducts.length === 0 ? (
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
                        {searchTerm || selectedCategoryFilter
                            ? "No products matched your filters."
                            : "No products found. Click '+ Add Product' to create one."}
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
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)", width: "60px" }}>Image</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Name & Slug</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Category</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Brand</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)" }}>Status</th>
                                    <th style={{ padding: "12px 16px", fontWeight: "600", color: "var(--text-muted)", textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((p) => {
                                    const primaryImg = p.images?.[0]?.url;
                                    const catName = p.categoryId?.name || categories.find((c) => c._id === p.categoryId)?.name || "—";

                                    return (
                                        <tr key={p._id} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "12px 16px" }}>
                                                {primaryImg ? (
                                                    <img
                                                        src={primaryImg}
                                                        alt={p.name}
                                                        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: "40px",
                                                            height: "40px",
                                                            backgroundColor: "var(--bg-secondary)",
                                                            borderRadius: "4px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "10px",
                                                            color: "var(--text-muted)"
                                                        }}
                                                    >
                                                        No Img
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: "12px 16px" }}>
                                                <div style={{ fontWeight: "600", color: "var(--text)" }}>{p.name}</div>
                                                <div style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "monospace" }}>
                                                    {p.slug}
                                                </div>
                                            </td>
                                            <td style={{ padding: "12px 16px", color: "var(--text)" }}>
                                                {catName}
                                            </td>
                                            <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>
                                                {p.brand || "—"}
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
                                                        backgroundColor:
                                                            p.status === "active" ? "#dcfce7" : p.status === "draft" ? "#fef3c7" : "#fee2e2",
                                                        color:
                                                            p.status === "active" ? "#166534" : p.status === "draft" ? "#92400e" : "#991b1b"
                                                    }}
                                                >
                                                    {p.status || "active"}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px 16px", textAlign: "right" }}>
                                                <div style={{ display: "inline-flex", gap: "6px" }}>
                                                    <button
                                                        onClick={() => handleOpenVariants(p)}
                                                        style={{
                                                            padding: "5px 10px",
                                                            borderRadius: "4px",
                                                            border: "1px solid var(--primary)",
                                                            backgroundColor: "transparent",
                                                            color: "var(--primary)",
                                                            fontSize: "12px",
                                                            fontWeight: "600",
                                                            cursor: "pointer"
                                                        }}
                                                    >
                                                        Variants & Stock
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(p)}
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
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleArchive(p)}
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
                                                        Archive
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

            {isProductModalOpen && (
                <ProductModal
                    product={editingProduct}
                    categories={categories}
                    onClose={() => setIsProductModalOpen(false)}
                    onSaved={handleProductSaved}
                />
            )}

            {isVariantModalOpen && variantProduct && (
                <VariantManagerModal
                    product={variantProduct}
                    onClose={() => setIsVariantModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminProducts;
