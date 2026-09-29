import { useState } from "react";
import { createCategory, updateCategory } from "../../services/admin.service";

const CategoryModal = ({ category, onClose, onSaved }) => {
    const isEdit = Boolean(category?._id);

    const [formData, setFormData] = useState({
        name: category?.name || "",
        slug: category?.slug || "",
        description: category?.description || "",
        isActive: category?.isActive ?? true
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
            // Auto slugify only when creating new category
            slug: !isEdit ? slugify(name) : prev.slug
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim()) {
            setError("Category name is required.");
            return;
        }

        if (!formData.slug.trim()) {
            setError("Category slug is required.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: formData.name.trim(),
                slug: slugify(formData.slug),
                description: formData.description.trim()
            };

            if (isEdit) {
                payload.isActive = formData.isActive;
                await updateCategory(category._id, payload);
            } else {
                await createCategory(payload);
            }

            onSaved();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} category.`);
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
                    maxWidth: "480px",
                    padding: "24px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)" }}>
                        {isEdit ? "Edit Category" : "Add New Category"}
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
                    <div style={{ marginBottom: "14px" }}>
                        <label
                            htmlFor="cat-name"
                            style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}
                        >
                            Name <span style={{ color: "var(--danger)" }}>*</span>
                        </label>
                        <input
                            id="cat-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                            placeholder="e.g. Footwear"
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

                    <div style={{ marginBottom: "14px" }}>
                        <label
                            htmlFor="cat-slug"
                            style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}
                        >
                            Slug <span style={{ color: "var(--danger)" }}>*</span>
                        </label>
                        <input
                            id="cat-slug"
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            required
                            placeholder="e.g. footwear"
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

                    <div style={{ marginBottom: "16px" }}>
                        <label
                            htmlFor="cat-desc"
                            style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}
                        >
                            Description
                        </label>
                        <textarea
                            id="cat-desc"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Optional category description..."
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

                    {isEdit && (
                        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <input
                                id="cat-active"
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                style={{ width: "16px", height: "16px", cursor: "pointer" }}
                            />
                            <label htmlFor="cat-active" style={{ fontSize: "14px", color: "var(--text)", cursor: "pointer" }}>
                                Active Category
                            </label>
                        </div>
                    )}

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
                            {saving ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
