import { useState, useEffect, useCallback } from "react";
import {
    getProductVariants,
    createProductVariant,
    deleteProductVariant,
    updateVariantInventory
} from "../../services/admin.service";

const VariantManagerModal = ({ product, onClose }) => {
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionMsg, setActionMsg] = useState(null);

    // Stock quantities draft state: { [variantId]: number }
    const [stockDrafts, setStockDrafts] = useState({});
    const [updatingStock, setUpdatingStock] = useState({});

    // New variant form state
    const [newVariant, setNewVariant] = useState({
        sku: "",
        price: "",
        compareAtPrice: "",
        size: "",
        color: "",
        initialStock: 10
    });
    const [isCreating, setIsCreating] = useState(false);

    const loadVariants = useCallback(() => {
        getProductVariants(product._id)
            .then((res) => {
                const list = res.data || [];
                setVariants(list);
                // Initialize stock drafts
                const drafts = {};
                list.forEach((v) => {
                    drafts[v._id] = v.inventory?.quantity ?? 0;
                });
                setStockDrafts(drafts);
            })
            .catch((err) => {
                setError(err.response?.data?.message || "Failed to load product variants.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [product._id]);

    useEffect(() => {
        loadVariants();
    }, [loadVariants]);

    const handleStockChange = (variantId, val) => {
        setStockDrafts((prev) => ({
            ...prev,
            [variantId]: val
        }));
    };

    const handleUpdateStock = async (variantId) => {
        const qty = parseInt(stockDrafts[variantId], 10);
        if (isNaN(qty) || qty < 0) {
            alert("Quantity must be a non-negative integer.");
            return;
        }

        setUpdatingStock((prev) => ({ ...prev, [variantId]: true }));
        try {
            await updateVariantInventory(variantId, qty);
            setActionMsg(`Inventory updated to ${qty} for variant.`);
            setTimeout(() => setActionMsg(null), 3000);
            loadVariants();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update inventory.");
        } finally {
            setUpdatingStock((prev) => ({ ...prev, [variantId]: false }));
        }
    };

    const handleDeleteVariant = async (variant) => {
        const confirmed = window.confirm(`Are you sure you want to deactivate variant ${variant.sku}?`);
        if (!confirmed) return;

        try {
            await deleteProductVariant(product._id, variant._id);
            setActionMsg(`Variant ${variant.sku} removed.`);
            setTimeout(() => setActionMsg(null), 3000);
            loadVariants();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete variant.");
        }
    };

    const handleCreateVariant = async (e) => {
        e.preventDefault();
        setError(null);

        const skuTrimmed = newVariant.sku.trim().toUpperCase();
        if (!skuTrimmed) {
            setError("SKU is required.");
            return;
        }

        const priceNum = parseFloat(newVariant.price);
        if (isNaN(priceNum) || priceNum < 0) {
            setError("Valid price is required.");
            return;
        }

        const compareNum = newVariant.compareAtPrice ? parseFloat(newVariant.compareAtPrice) : null;
        if (compareNum !== null && compareNum < priceNum) {
            setError("Compare-at price cannot be less than sale price.");
            return;
        }

        setIsCreating(true);
        try {
            const attributes = {};
            if (newVariant.size.trim()) attributes.size = newVariant.size.trim();
            if (newVariant.color.trim()) attributes.color = newVariant.color.trim();

            const res = await createProductVariant(product._id, {
                sku: skuTrimmed,
                price: priceNum,
                compareAtPrice: compareNum,
                attributes
            });

            const createdVariant = res.data;

            // If initial stock specified, update inventory
            const initStock = parseInt(newVariant.initialStock, 10);
            if (!isNaN(initStock) && initStock > 0 && createdVariant?._id) {
                await updateVariantInventory(createdVariant._id, initStock);
            }

            setActionMsg(`Variant ${skuTrimmed} created successfully!`);
            setTimeout(() => setActionMsg(null), 3000);

            // Reset form
            setNewVariant({
                sku: "",
                price: "",
                compareAtPrice: "",
                size: "",
                color: "",
                initialStock: 10
            });

            loadVariants();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create variant.");
        } finally {
            setIsCreating(false);
        }
    };

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
                    maxWidth: "800px",
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
                            Variants & Stock Inventory
                        </h2>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                            Product: <strong>{product.name}</strong>
                        </p>
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

                {actionMsg && (
                    <div
                        style={{
                            padding: "10px 14px",
                            backgroundColor: "#dcfce7",
                            border: "1px solid #86efac",
                            borderRadius: "6px",
                            color: "#166534",
                            fontSize: "13px",
                            marginBottom: "14px"
                        }}
                    >
                        {actionMsg}
                    </div>
                )}

                {error && (
                    <div
                        style={{
                            padding: "10px 14px",
                            backgroundColor: "#fee2e2",
                            border: "1px solid #f87171",
                            borderRadius: "6px",
                            color: "#b91c1c",
                            fontSize: "13px",
                            marginBottom: "14px"
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Variants List Table */}
                <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "10px" }}>
                    Existing Variants ({variants.length})
                </h3>

                {loading ? (
                    <div style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>
                        Loading variants...
                    </div>
                ) : variants.length === 0 ? (
                    <div
                        style={{
                            padding: "20px",
                            textAlign: "center",
                            backgroundColor: "var(--bg-secondary)",
                            borderRadius: "6px",
                            marginBottom: "20px"
                        }}
                    >
                        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                            No variants yet for this product. Use the form below to add one.
                        </p>
                    </div>
                ) : (
                    <div
                        style={{
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            overflow: "hidden",
                            marginBottom: "24px"
                        }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                            <thead>
                                <tr style={{ backgroundColor: "var(--bg-secondary)", borderBottom: "1px solid var(--border)" }}>
                                    <th style={{ padding: "10px 12px", fontWeight: "600", color: "var(--text-muted)" }}>SKU</th>
                                    <th style={{ padding: "10px 12px", fontWeight: "600", color: "var(--text-muted)" }}>Attributes</th>
                                    <th style={{ padding: "10px 12px", fontWeight: "600", color: "var(--text-muted)" }}>Price</th>
                                    <th style={{ padding: "10px 12px", fontWeight: "600", color: "var(--text-muted)" }}>Inventory</th>
                                    <th style={{ padding: "10px 12px", fontWeight: "600", color: "var(--text-muted)", textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((v) => {
                                    const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes || {};
                                    const attrText = Object.entries(attrs)
                                        .map(([k, val]) => `${k}: ${val}`)
                                        .join(", ") || "Default";

                                    return (
                                        <tr key={v._id} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "10px 12px", fontWeight: "600", fontFamily: "monospace" }}>
                                                {v.sku}
                                            </td>
                                            <td style={{ padding: "10px 12px", color: "var(--text-muted)" }}>
                                                {attrText}
                                            </td>
                                            <td style={{ padding: "10px 12px", fontWeight: "500" }}>
                                                ${Number(v.price).toFixed(2)}
                                                {v.compareAtPrice && (
                                                    <span style={{ textDecoration: "line-through", color: "var(--text-muted)", marginLeft: "6px", fontSize: "11px" }}>
                                                        ${Number(v.compareAtPrice).toFixed(2)}
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: "10px 12px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={stockDrafts[v._id] ?? ""}
                                                        onChange={(e) => handleStockChange(v._id, e.target.value)}
                                                        style={{
                                                            width: "65px",
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            border: "1px solid var(--border)",
                                                            fontSize: "13px",
                                                            backgroundColor: "var(--bg)"
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={updatingStock[v._id]}
                                                        onClick={() => handleUpdateStock(v._id)}
                                                        style={{
                                                            padding: "4px 8px",
                                                            borderRadius: "4px",
                                                            border: "1px solid var(--border)",
                                                            backgroundColor: "var(--bg)",
                                                            fontSize: "12px",
                                                            fontWeight: "500",
                                                            cursor: updatingStock[v._id] ? "not-allowed" : "pointer",
                                                            opacity: updatingStock[v._id] ? 0.6 : 1
                                                        }}
                                                    >
                                                        {updatingStock[v._id] ? "..." : "Save"}
                                                    </button>
                                                </div>
                                            </td>
                                            <td style={{ padding: "10px 12px", textAlign: "right" }}>
                                                <button
                                                    onClick={() => handleDeleteVariant(v)}
                                                    style={{
                                                        padding: "4px 8px",
                                                        borderRadius: "4px",
                                                        border: "1px solid #fecaca",
                                                        backgroundColor: "#fef2f2",
                                                        color: "var(--danger)",
                                                        fontSize: "11px",
                                                        fontWeight: "600",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Add New Variant Form */}
                <div
                    style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px",
                        padding: "16px",
                        border: "1px solid var(--border)"
                    }}
                >
                    <h3 style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", marginBottom: "12px" }}>
                        + Add New Variant
                    </h3>
                    <form onSubmit={handleCreateVariant}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "12px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "2px" }}>
                                    SKU *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. BLK-M"
                                    value={newVariant.sku}
                                    onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value.toUpperCase() })}
                                    style={{
                                        width: "100%",
                                        padding: "6px 10px",
                                        borderRadius: "4px",
                                        border: "1px solid var(--border)",
                                        fontSize: "13px",
                                        backgroundColor: "var(--bg)"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "2px" }}>
                                    Sale Price ($) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    placeholder="49.99"
                                    value={newVariant.price}
                                    onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "6px 10px",
                                        borderRadius: "4px",
                                        border: "1px solid var(--border)",
                                        fontSize: "13px",
                                        backgroundColor: "var(--bg)"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "2px" }}>
                                    Compare Price ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="69.99"
                                    value={newVariant.compareAtPrice}
                                    onChange={(e) => setNewVariant({ ...newVariant, compareAtPrice: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "6px 10px",
                                        borderRadius: "4px",
                                        border: "1px solid var(--border)",
                                        fontSize: "13px",
                                        backgroundColor: "var(--bg)"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "2px" }}>
                                    Size
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. M or 42"
                                    value={newVariant.size}
                                    onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "6px 10px",
                                        borderRadius: "4px",
                                        border: "1px solid var(--border)",
                                        fontSize: "13px",
                                        backgroundColor: "var(--bg)"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "2px" }}>
                                    Color
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Black"
                                    value={newVariant.color}
                                    onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "6px 10px",
                                        borderRadius: "4px",
                                        border: "1px solid var(--border)",
                                        fontSize: "13px",
                                        backgroundColor: "var(--bg)"
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "var(--text-muted)", marginBottom: "2px" }}>
                                    Initial Stock
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="10"
                                    value={newVariant.initialStock}
                                    onChange={(e) => setNewVariant({ ...newVariant, initialStock: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "6px 10px",
                                        borderRadius: "4px",
                                        border: "1px solid var(--border)",
                                        fontSize: "13px",
                                        backgroundColor: "var(--bg)"
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                            <button
                                type="submit"
                                disabled={isCreating}
                                style={{
                                    padding: "8px 16px",
                                    borderRadius: "6px",
                                    border: "none",
                                    backgroundColor: "var(--primary)",
                                    color: "#fff",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    cursor: isCreating ? "not-allowed" : "pointer",
                                    opacity: isCreating ? 0.7 : 1
                                }}
                            >
                                {isCreating ? "Adding..." : "+ Add Variant"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VariantManagerModal;
