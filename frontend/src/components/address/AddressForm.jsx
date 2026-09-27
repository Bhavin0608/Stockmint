import { useState } from "react";

const AddressForm = ({ initialData = null, onSave, onCancel, isSubmitting = false }) => {
    const [formData, setFormData] = useState({
        label: initialData?.label || "Home",
        fullName: initialData?.fullName || "",
        phone: initialData?.phone || "",
        addressLine1: initialData?.addressLine1 || "",
        addressLine2: initialData?.addressLine2 || "",
        city: initialData?.city || "",
        state: initialData?.state || "",
        postalCode: initialData?.postalCode || "",
        country: initialData?.country || "India",
        isDefault: initialData?.isDefault || false
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (
            !formData.label.trim() ||
            !formData.fullName.trim() ||
            !formData.phone.trim() ||
            !formData.addressLine1.trim() ||
            !formData.city.trim() ||
            !formData.state.trim() ||
            !formData.postalCode.trim() ||
            !formData.country.trim()
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        onSave(formData);
    };

    const inputStyle = {
        width: "100%",
        padding: "8px 12px",
        border: "1px solid var(--border)",
        borderRadius: "6px",
        fontSize: "14px",
        backgroundColor: "var(--bg)",
        color: "var(--text)"
    };

    const labelStyle = {
        display: "block",
        fontSize: "13px",
        fontWeight: "600",
        marginBottom: "4px",
        color: "var(--text)"
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                marginBottom: "24px"
            }}
        >
            <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
                {initialData ? "Edit Delivery Address" : "Add New Delivery Address"}
            </h3>

            {error && (
                <div
                    style={{
                        padding: "10px 14px",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        color: "var(--danger)",
                        fontSize: "13px",
                        marginBottom: "16px"
                    }}
                >
                    {error}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                {/* Address Label */}
                <div>
                    <label style={labelStyle}>Address Type / Label *</label>
                    <select
                        name="label"
                        value={formData.label}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="Home">Home</option>
                        <option value="Work">Work / Office</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Full Name */}
                <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        style={inputStyle}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        style={inputStyle}
                    />
                </div>

                {/* Address Line 1 */}
                <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Address Line 1 (House No, Building, Street) *</label>
                    <input
                        type="text"
                        name="addressLine1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        placeholder="123 Main Street, Apt 4B"
                        style={inputStyle}
                    />
                </div>

                {/* Address Line 2 */}
                <div style={{ gridColumn: "1 / -1" }}>
                    <label style={labelStyle}>Address Line 2 (Landmark, Suite - optional)</label>
                    <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        placeholder="Near City Park"
                        style={inputStyle}
                    />
                </div>

                {/* City */}
                <div>
                    <label style={labelStyle}>City *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        style={inputStyle}
                    />
                </div>

                {/* State */}
                <div>
                    <label style={labelStyle}>State / Province *</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        style={inputStyle}
                    />
                </div>

                {/* Postal Code */}
                <div>
                    <label style={labelStyle}>Postal Code / PIN *</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Postal Code"
                        style={inputStyle}
                    />
                </div>

                {/* Country */}
                <div>
                    <label style={labelStyle}>Country *</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Country"
                        style={inputStyle}
                    />
                </div>
            </div>

            {/* Default Address Checkbox */}
            <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="isDefault" style={{ fontSize: "14px", cursor: "pointer", color: "var(--text)" }}>
                    Set as default delivery address
                </label>
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--text)",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: isSubmitting ? "not-allowed" : "pointer"
                    }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        padding: "8px 20px",
                        backgroundColor: "var(--primary)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: isSubmitting ? "not-allowed" : "pointer"
                    }}
                >
                    {isSubmitting ? "Saving..." : initialData ? "Update Address" : "Save Address"}
                </button>
            </div>
        </form>
    );
};

export default AddressForm;
