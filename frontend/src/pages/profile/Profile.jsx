import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getProfile, updateProfile } from "../../services/user.service";

const Profile = () => {
    const { user: authUser, setUser } = useContext(AuthContext);

    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({ name: "", phone: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        let isMounted = true;

        getProfile()
            .then((res) => {
                if (!isMounted) return;
                const data = res.data;
                setProfile(data);
                setFormData({
                    name: data.name || "",
                    phone: data.phone || ""
                });
            })
            .catch((err) => {
                if (!isMounted) return;
                setError(err.response?.data?.message || "Failed to load account profile.");
            })
            .finally(() => {
                if (!isMounted) return;
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(null);
        if (successMessage) setSuccessMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const trimmedName = formData.name.trim();
        if (trimmedName.length < 3 || trimmedName.length > 50) {
            setError("Full Name must be between 3 and 50 characters.");
            return;
        }

        setSaving(true);
        try {
            const updates = {
                name: trimmedName,
                phone: formData.phone.trim()
            };

            const response = await updateProfile(updates);
            const updatedUser = response.data;

            setProfile((prev) => ({
                ...prev,
                ...updatedUser
            }));

            // Sync with global auth state
            if (setUser && authUser) {
                setUser((prev) => ({
                    ...prev,
                    ...updatedUser
                }));
            }

            setSuccessMessage(response.message || "Profile updated successfully!");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 16px", textAlign: "center" }}>
                <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>Loading profile details...</p>
            </div>
        );
    }

    const memberSince = profile?.createdAt
        ? new Date(profile.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
        : "N/A";

    const initials = (profile?.name || authUser?.name || "U")
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0].toUpperCase())
        .slice(0, 2)
        .join("");

    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 16px" }}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginBottom: "24px"
                }}
            >
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--text)" }}>My Account</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
                        Manage your account settings, personal details, and delivery preferences.
                    </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link
                        to="/orders"
                        style={{
                            padding: "8px 14px",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg)",
                            color: "var(--text)",
                            fontSize: "13px",
                            fontWeight: "500",
                            textDecoration: "none"
                        }}
                    >
                        My Orders
                    </Link>
                    <Link
                        to="/addresses"
                        style={{
                            padding: "8px 14px",
                            borderRadius: "6px",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--bg)",
                            color: "var(--text)",
                            fontSize: "13px",
                            fontWeight: "500",
                            textDecoration: "none"
                        }}
                    >
                        Delivery Addresses
                    </Link>
                </div>
            </div>

            {/* Error & Success Messages */}
            {error && (
                <div
                    style={{
                        padding: "12px 16px",
                        backgroundColor: "#fee2e2",
                        border: "1px solid #f87171",
                        borderRadius: "8px",
                        color: "#b91c1c",
                        fontSize: "14px",
                        marginBottom: "20px"
                    }}
                >
                    {error}
                </div>
            )}

            {successMessage && (
                <div
                    style={{
                        padding: "12px 16px",
                        backgroundColor: "#dcfce7",
                        border: "1px solid #86efac",
                        borderRadius: "8px",
                        color: "#15803d",
                        fontSize: "14px",
                        marginBottom: "20px"
                    }}
                >
                    {successMessage}
                </div>
            )}

            {/* Account Card */}
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "24px",
                    marginBottom: "24px"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
                    <div
                        style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            backgroundColor: "var(--primary)",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "22px",
                            fontWeight: "700",
                            letterSpacing: "1px"
                        }}
                    >
                        {initials}
                    </div>
                    <div>
                        <h2 style={{ fontSize: "20px", fontWeight: "600", color: "var(--text)" }}>
                            {profile?.name || authUser?.name}
                        </h2>
                        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "2px" }}>
                            {profile?.email || authUser?.email}
                        </p>
                        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                            <span
                                style={{
                                    display: "inline-block",
                                    padding: "2px 8px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    textTransform: "capitalize",
                                    backgroundColor: profile?.role === "admin" ? "#e0e7ff" : "#f1f5f9",
                                    color: profile?.role === "admin" ? "#3730a3" : "#475569"
                                }}
                            >
                                {profile?.role || "Customer"}
                            </span>
                            <span
                                style={{
                                    display: "inline-block",
                                    padding: "2px 8px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    textTransform: "capitalize",
                                    backgroundColor: profile?.status === "active" ? "#dcfce7" : "#fee2e2",
                                    color: profile?.status === "active" ? "#166534" : "#991b1b"
                                }}
                            >
                                {profile?.status || "Active"}
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "16px",
                        padding: "16px",
                        backgroundColor: "var(--bg-secondary)",
                        borderRadius: "8px"
                    }}
                >
                    <div>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>
                            Account ID
                        </span>
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: "500",
                                color: "var(--text)",
                                wordBreak: "break-all"
                            }}
                        >
                            {profile?.id || "N/A"}
                        </span>
                    </div>
                    <div>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "block" }}>
                            Member Since
                        </span>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)" }}>
                            {memberSince}
                        </span>
                    </div>
                </div>
            </div>

            {/* Edit Profile Form */}
            <div
                style={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "24px"
                }}
            >
                <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--text)", marginBottom: "16px" }}>
                    Personal Information
                </h3>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "16px" }}>
                        <label
                            htmlFor="profile-name"
                            style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "var(--text)",
                                marginBottom: "6px"
                            }}
                        >
                            Full Name <span style={{ color: "var(--danger)" }}>*</span>
                        </label>
                        <input
                            id="profile-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            minLength={3}
                            maxLength={50}
                            placeholder="Enter your full name"
                            style={{
                                width: "100%",
                                padding: "10px 14px",
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
                            htmlFor="profile-email"
                            style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "var(--text)",
                                marginBottom: "6px"
                            }}
                        >
                            Email Address (Read-only)
                        </label>
                        <input
                            id="profile-email"
                            type="email"
                            value={profile?.email || ""}
                            disabled
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                borderRadius: "6px",
                                border: "1px solid var(--border)",
                                fontSize: "14px",
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text-muted)",
                                cursor: "not-allowed"
                            }}
                        />
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                            Email address is linked to your login credentials and cannot be modified directly.
                        </span>
                    </div>

                    <div style={{ marginBottom: "24px" }}>
                        <label
                            htmlFor="profile-phone"
                            style={{
                                display: "block",
                                fontSize: "13px",
                                fontWeight: "600",
                                color: "var(--text)",
                                marginBottom: "6px"
                            }}
                        >
                            Phone Number
                        </label>
                        <input
                            id="profile-phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Optional phone number"
                            style={{
                                width: "100%",
                                padding: "10px 14px",
                                borderRadius: "6px",
                                border: "1px solid var(--border)",
                                fontSize: "14px",
                                outline: "none",
                                backgroundColor: "var(--bg)"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: "10px 24px",
                                backgroundColor: "var(--primary)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: saving ? "not-allowed" : "pointer",
                                opacity: saving ? 0.7 : 1,
                                transition: "background-color 0.2s ease"
                            }}
                        >
                            {saving ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;
