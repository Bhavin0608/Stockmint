import { useState, useEffect } from "react";
import {
    getAddresses,
    createAddress,
    updateAddress,
    deleteAddress
} from "../../services/address.service";
import AddressForm from "../../components/address/AddressForm";

const AddressList = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        let isMounted = true;

        getAddresses()
            .then((response) => {
                if (isMounted && response?.data) {
                    setAddresses(response.data);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error("Failed to load addresses:", err);
                    setError(err.response?.data?.message || "Failed to load addresses.");
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [refreshTrigger]);

    const handleCreate = async (formData) => {
        try {
            setSubmitting(true);
            await createAddress(formData);
            setShowAddForm(false);
            setActionMessage("Address added successfully!");
            setTimeout(() => setActionMessage(""), 3000);
            setLoading(true);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to create address:", err);
            alert(err.response?.data?.message || "Failed to create address.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (formData) => {
        if (!editingAddress) return;
        try {
            setSubmitting(true);
            await updateAddress(editingAddress._id, formData);
            setEditingAddress(null);
            setActionMessage("Address updated successfully!");
            setTimeout(() => setActionMessage(""), 3000);
            setLoading(true);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to update address:", err);
            alert(err.response?.data?.message || "Failed to update address.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSetDefault = async (addressId) => {
        try {
            await updateAddress(addressId, { isDefault: true });
            setActionMessage("Default address updated!");
            setTimeout(() => setActionMessage(""), 3000);
            setLoading(true);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to set default address:", err);
            alert(err.response?.data?.message || "Failed to update default address.");
        }
    };

    const handleDelete = async (addressId) => {
        if (!window.confirm("Are you sure you want to delete this address?")) {
            return;
        }

        try {
            await deleteAddress(addressId);
            setActionMessage("Address deleted successfully.");
            setTimeout(() => setActionMessage(""), 3000);
            setLoading(true);
            setRefreshTrigger((prev) => prev + 1);
        } catch (err) {
            console.error("Failed to delete address:", err);
            alert(err.response?.data?.message || "Failed to delete address.");
        }
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px", width: "100%" }}>
            {/* Header with Title and Add Button */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                    flexWrap: "wrap",
                    gap: "16px"
                }}
            >
                <div>
                    <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)" }}>
                        Delivery Addresses
                    </h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
                        Manage your shipping addresses for seamless checkout.
                    </p>
                </div>

                {!showAddForm && !editingAddress && (
                    <button
                        type="button"
                        onClick={() => {
                            setShowAddForm(true);
                            setEditingAddress(null);
                        }}
                        style={{
                            padding: "9px 18px",
                            backgroundColor: "var(--primary)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer"
                        }}
                    >
                        + Add New Address
                    </button>
                )}
            </div>

            {/* Notification message */}
            {actionMessage && (
                <div
                    style={{
                        padding: "12px 16px",
                        backgroundColor: "#ecfdf5",
                        border: "1px solid #a7f3d0",
                        borderRadius: "6px",
                        color: "#065f46",
                        fontSize: "14px",
                        fontWeight: "500",
                        marginBottom: "20px"
                    }}
                >
                    {actionMessage}
                </div>
            )}

            {/* Error state */}
            {error && (
                <div
                    style={{
                        padding: "12px 16px",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        color: "var(--danger)",
                        fontSize: "14px",
                        marginBottom: "20px"
                    }}
                >
                    {error}
                </div>
            )}

            {/* Add Address Form */}
            {showAddForm && (
                <AddressForm
                    onSave={handleCreate}
                    onCancel={() => setShowAddForm(false)}
                    isSubmitting={submitting}
                />
            )}

            {/* Edit Address Form */}
            {editingAddress && (
                <AddressForm
                    initialData={editingAddress}
                    onSave={handleUpdate}
                    onCancel={() => setEditingAddress(null)}
                    isSubmitting={submitting}
                />
            )}

            {/* Addresses List / Cards */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-muted)" }}>
                    <p>Loading your addresses...</p>
                </div>
            ) : addresses.length === 0 && !showAddForm ? (
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "48px 24px",
                        textAlign: "center"
                    }}
                >
                    <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)", marginBottom: "8px" }}>
                        No saved addresses
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px" }}>
                        You don't have any saved delivery addresses yet. Add one to make checkout fast and easy.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowAddForm(true)}
                        style={{
                            padding: "9px 18px",
                            backgroundColor: "var(--primary)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "600",
                            fontSize: "14px",
                            cursor: "pointer"
                        }}
                    >
                        Add Your First Address
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "20px"
                    }}
                >
                    {addresses.map((addr) => (
                        <div
                            key={addr._id}
                            style={{
                                backgroundColor: "var(--card-bg)",
                                border: "1px solid",
                                borderColor: addr.isDefault ? "var(--primary)" : "var(--border)",
                                borderRadius: "8px",
                                padding: "20px",
                                display: "flex",
                                flexDirection: "column",
                                position: "relative",
                                boxShadow: addr.isDefault
                                    ? "0 2px 8px rgba(37, 99, 235, 0.1)"
                                    : "0 1px 3px rgba(0,0,0,0.04)"
                            }}
                        >
                            {/* Badges Header */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "12px"
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        color: "var(--primary)",
                                        backgroundColor: "rgba(37, 99, 235, 0.08)",
                                        padding: "3px 8px",
                                        borderRadius: "4px"
                                    }}
                                >
                                    {addr.label}
                                </span>

                                {addr.isDefault && (
                                    <span
                                        style={{
                                            fontSize: "11px",
                                            fontWeight: "700",
                                            color: "#16a34a",
                                            backgroundColor: "#dcfce7",
                                            padding: "2px 8px",
                                            borderRadius: "4px",
                                            textTransform: "uppercase"
                                        }}
                                    >
                                        Default Address
                                    </span>
                                )}
                            </div>

                            {/* Full Name & Phone */}
                            <p style={{ fontWeight: "700", fontSize: "15px", color: "var(--text)", marginBottom: "4px" }}>
                                {addr.fullName}
                            </p>
                            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
                                Phone: <strong>{addr.phone}</strong>
                            </p>

                            {/* Address Lines */}
                            <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: "1.5", flex: 1 }}>
                                {addr.addressLine1}
                                {addr.addressLine2 && <>, {addr.addressLine2}</>}
                                <br />
                                {addr.city}, {addr.state} - {addr.postalCode}
                                <br />
                                {addr.country}
                            </p>

                            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0 12px" }} />

                            {/* Actions Footer */}
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                                {!addr.isDefault && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetDefault(addr._id)}
                                        style={{
                                            padding: "5px 10px",
                                            backgroundColor: "transparent",
                                            border: "1px solid var(--border)",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            color: "var(--text)",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Set as Default
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingAddress(addr);
                                        setShowAddForm(false);
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "transparent",
                                        border: "1px solid var(--border)",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        color: "var(--primary)",
                                        cursor: "pointer"
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(addr._id)}
                                    style={{
                                        padding: "5px 10px",
                                        backgroundColor: "transparent",
                                        border: "1px solid var(--border)",
                                        borderRadius: "4px",
                                        fontSize: "12px",
                                        fontWeight: "600",
                                        color: "var(--danger)",
                                        cursor: "pointer",
                                        marginLeft: "auto"
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressList;
