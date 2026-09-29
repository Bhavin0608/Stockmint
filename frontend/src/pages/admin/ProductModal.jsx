import { useState } from "react";
import { createProduct, updateProduct } from "../../services/admin.service";

const ProductModal = ({ product, categories, onClose, onSaved }) => {
    const isEdit = Boolean(product?._id);

    const [formData, setFormData] = useState({
        name: product?.name || "",
        slug: product?.slug || "",
        categoryId: product?.categoryId?._id || product?.categoryId || (categories[0]?._id || ""),
        brand: product?.brand || "",
        description: product?.description || "",
        status: product?.status || "active",
        imageUrl: product?.images?.[0]?.url || ""
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-");
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name,
            slug: !isEdit ? slugify(name) : prev.slug
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim()) {
            setError("Product name is required.");
            return;
        }

        if (!formData.slug.trim()) {
            setError("Product slug is required.");
            return;
        }

        if (!formData.categoryId) {
            setError("Category is required. Please select or create a category first.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: formData.name.trim(),
                slug: slugify(formData.slug),
                categoryId: formData.categoryId,
                brand: formData.brand.trim(),
                description: formData.description.trim(),
                status: formData.status
            };

            if (formData.imageUrl.trim()) {
                payload.images = [
                    {
                        url: formData.imageUrl.trim(),
                        publicId: `img_${Date.now()}`
                    }
                ];
            } else if (!isEdit) {
                payload.images = [];
            }

            if (isEdit) {
                await updateProduct(product._id, payload);
            } else {
                await createProduct(payload);
            }

            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} product.`);
        } finally {
            setSaving(false);
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
                    maxWidth: "560px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    padding: "24px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)" }}>
                        {isEdit ? "Edit Product" : "Add New Product"}
                    </h2>
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

                <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div>
                            <label
                                htmlFor="prod-name"
                                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}
                            >
                                Product Name <span style={{ color: "var(--danger)" }}>*</span>
                            </label>
                            <input
                                id="prod-name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleNameChange}
                                required
                                placeholder="e.g. Classic Oxford Shoes"
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    fontSize: "14px",
                                    outline: "none",
                                    backgroundColor: "var(--bg)"
                                }}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="prod-slug"
                                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}
                            >
                                Slug <span style={{ color: "var(--danger)" }}>*</span>
                            </label>
                            <input
                                id="prod-slug"
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                required
                                placeholder="e.g. classic-oxford-shoes"
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    fontSize: "14px",
                                    outline: "none",
                                    backgroundColor: "var(--bg)"
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div>
                            <label
                                htmlFor="prod-cat"
                                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}
                            >
                                Category <span style={{ color: "var(--danger)" }}>*</span>
                            </label>
                            <select
                                id="prod-cat"
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                required
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    fontSize: "14px",
                                    outline: "none",
                                    backgroundColor: "var(--bg)"
                                }}
                            >
                                <option value="">Select category...</option>
                                {categories.map((c) => (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="prod-brand"
                                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}
                            >
                                Brand
                            </label>
                            <input
                                id="prod-brand"
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="e.g. Stockmint Atelier"
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    fontSize: "14px",
                                    outline: "none",
                                    backgroundColor: "var(--bg)"
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                        <div>
                            <label
                                htmlFor="prod-status"
                                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}
                            >
                                Status
                            </label>
                            <select
                                id="prod-status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    fontSize: "14px",
                                    outline: "none",
                                    backgroundColor: "var(--bg)"
                                }}
                            >
                                <option value="active">Active (Visible in catalog)</option>
                                <option value="draft">Draft (Hidden)</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="prod-img"
                                style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}
                            >
                                Primary Image URL
                            </label>
                            <input
                                id="prod-img"
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                                style={{
                                    width: "100%",
                                    padding: "9px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--border)",
                                    fontSize: "14px",
                                    outline: "none",
                                    backgroundColor: "var(--bg)"
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label
                            htmlFor="prod-desc"
                            style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}
                        >
                            Description
                        </label>
                        <textarea
                            id="prod-desc"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Detailed product description..."
                            style={{
                                width: "100%",
                                padding: "9px 12px",
                                borderRadius: "6px",
                                border: "1px solid var(--border)",
                                fontSize: "14px",
                                outline: "none",
                                resize: "vertical",
                                backgroundColor: "var(--bg)"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "8px 16px",
                                borderRadius: "6px",
                                border: "1px solid var(--border)",
                                backgroundColor: "var(--bg)",
                                color: "var(--text)",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: "pointer"
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: "8px 18px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "var(--primary)",
                                color: "#fff",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: saving ? "not-allowed" : "pointer",
                                opacity: saving ? 0.7 : 1
                            }}
                        >
                            {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;
