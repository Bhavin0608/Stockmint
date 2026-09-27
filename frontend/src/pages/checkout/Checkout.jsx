import { useState, useEffect, useContext } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { getAddresses, createAddress } from "../../services/address.service";
import { createOrderCheckout } from "../../services/order.service";
import AddressForm from "../../components/address/AddressForm";

const Checkout = () => {
    const navigate = useNavigate();
    const { items, itemCount, totalAmount, refreshCart } = useContext(CartContext);

    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [submittingAddress, setSubmittingAddress] = useState(false);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState("");

    // Load addresses on mount
    useEffect(() => {
        let isMounted = true;

        getAddresses()
            .then((response) => {
                if (!isMounted) return;
                const list = response?.data || [];
                setAddresses(list);
                if (list.length > 0) {
                    const defaultAddr = list.find((a) => a.isDefault) || list[0];
                    setSelectedAddressId(defaultAddr._id);
                }
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error("Failed to load addresses for checkout:", err);
                setError("Failed to load delivery addresses. Please refresh.");
            })
            .finally(() => {
                if (isMounted) {
                    setLoadingAddresses(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // If cart is empty, redirect back to cart
    if (items.length === 0) {
        return <Navigate to="/cart" replace />;
    }

    const handleCreateNewAddress = async (formData) => {
        try {
            setSubmittingAddress(true);
            const response = await createAddress(formData);
            if (response?.data) {
                const newAddr = response.data;
                setAddresses((prev) => [newAddr, ...prev]);
                setSelectedAddressId(newAddr._id);
                setShowAddressForm(false);
            }
        } catch (err) {
            console.error("Failed to save address:", err);
            alert(err.response?.data?.message || "Failed to save address.");
        } finally {
            setSubmittingAddress(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            setError("Please select or add a delivery address.");
            return;
        }

        try {
            setPlacingOrder(true);
            setError("");

            const response = await createOrderCheckout({ addressId: selectedAddressId });

            if (response?.data?.order) {
                // Clear and refresh in-memory cart state
                await refreshCart();
                // Navigate to order confirmation
                navigate("/checkout/success", {
                    replace: true,
                    state: { order: response.data.order }
                });
            }
        } catch (err) {
            console.error("Checkout failed:", err);
            setError(err.response?.data?.message || "Checkout failed. Please try again.");
        } finally {
            setPlacingOrder(false);
        }
    };

    const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

    return (
        <div style={{ maxWidth: "1150px", margin: "0 auto", padding: "32px 24px", width: "100%" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "700", color: "var(--text)", marginBottom: "24px" }}>
                Checkout
            </h1>

            {error && (
                <div
                    style={{
                        padding: "14px 18px",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "6px",
                        color: "var(--danger)",
                        fontSize: "14px",
                        marginBottom: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <span>{error}</span>
                    <button
                        type="button"
                        onClick={() => setError("")}
                        style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontWeight: "700" }}
                    >
                        &times;
                    </button>
                </div>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "36px",
                    alignItems: "start"
                }}
            >
                {/* Left Column: Steps */}
                <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                    {/* Step 1: Delivery Address */}
                    <div
                        style={{
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            padding: "24px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)" }}>
                                1. Delivery Address
                            </h2>
                            {!showAddressForm && (
                                <button
                                    type="button"
                                    onClick={() => setShowAddressForm(true)}
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: "var(--bg-secondary)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "4px",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        color: "var(--primary)",
                                        cursor: "pointer"
                                    }}
                                >
                                    + Add New Address
                                </button>
                            )}
                        </div>

                        {showAddressForm && (
                            <AddressForm
                                onSave={handleCreateNewAddress}
                                onCancel={() => setShowAddressForm(false)}
                                isSubmitting={submittingAddress}
                            />
                        )}

                        {loadingAddresses ? (
                            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading your addresses...</p>
                        ) : addresses.length === 0 && !showAddressForm ? (
                            <div style={{ textAlign: "center", padding: "20px 0" }}>
                                <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "12px" }}>
                                    No delivery addresses found.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setShowAddressForm(true)}
                                    style={{
                                        padding: "8px 16px",
                                        backgroundColor: "var(--primary)",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontSize: "13px",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    Add Address Now
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {addresses.map((addr) => {
                                    const isSelected = selectedAddressId === addr._id;
                                    return (
                                        <div
                                            key={addr._id}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            style={{
                                                padding: "16px",
                                                border: "2px solid",
                                                borderColor: isSelected ? "var(--primary)" : "var(--border)",
                                                borderRadius: "6px",
                                                backgroundColor: isSelected ? "rgba(37, 99, 235, 0.03)" : "var(--bg)",
                                                cursor: "pointer",
                                                display: "flex",
                                                gap: "12px",
                                                alignItems: "flex-start",
                                                transition: "all 0.15s ease"
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="addressSelection"
                                                checked={isSelected}
                                                onChange={() => setSelectedAddressId(addr._id)}
                                                style={{ marginTop: "3px", cursor: "pointer" }}
                                            />
                                            <div style={{ flex: 1, fontSize: "13px", lineHeight: "1.5" }}>
                                                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "4px" }}>
                                                    <strong style={{ fontSize: "14px", color: "var(--text)" }}>
                                                        {addr.fullName}
                                                    </strong>
                                                    <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", padding: "1px 6px", backgroundColor: "var(--bg-secondary)", borderRadius: "4px", color: "var(--text-muted)" }}>
                                                        {addr.label}
                                                    </span>
                                                    {addr.isDefault && (
                                                        <span style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a" }}>
                                                            (Default)
                                                        </span>
                                                    )}
                                                </div>
                                                <p style={{ color: "var(--text-muted)" }}>
                                                    {addr.addressLine1}
                                                    {addr.addressLine2 && <>, {addr.addressLine2}</>}
                                                    <br />
                                                    {addr.city}, {addr.state} - {addr.postalCode}
                                                </p>
                                                <p style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                                                    Phone: <strong>{addr.phone}</strong>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Step 2: Payment Method */}
                    <div
                        style={{
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            padding: "24px"
                        }}
                    >
                        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)", marginBottom: "16px" }}>
                            2. Payment Method
                        </h2>
                        <div
                            style={{
                                padding: "16px",
                                border: "2px solid var(--primary)",
                                borderRadius: "6px",
                                backgroundColor: "rgba(37, 99, 235, 0.03)",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            }}
                        >
                            <input
                                type="radio"
                                checked={true}
                                readOnly
                                style={{ cursor: "pointer" }}
                            />
                            <div>
                                <strong style={{ fontSize: "15px", color: "var(--text)" }}>
                                    Cash on Delivery (COD)
                                </strong>
                                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
                                    Pay with cash upon package arrival at your doorstep.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Review Items */}
                    <div
                        style={{
                            backgroundColor: "var(--card-bg)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                            padding: "24px"
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)" }}>
                                3. Review Items ({itemCount})
                            </h2>
                            <Link to="/cart" style={{ fontSize: "13px", fontWeight: "600", color: "var(--primary)" }}>
                                Edit Cart
                            </Link>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {items.map((item, index) => {
                                const variant = item.variantId || {};
                                const product = variant.productId || {};
                                const itemTotal = (variant.price || 0) * item.quantity;

                                return (
                                    <div
                                        key={variant._id || index}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            paddingBottom: "10px",
                                            borderBottom: index < items.length - 1 ? "1px solid var(--border)" : "none",
                                            fontSize: "13px"
                                        }}
                                    >
                                        <div>
                                            <p style={{ fontWeight: "600", color: "var(--text)" }}>
                                                {product.name || "Product"}
                                            </p>
                                            <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                                                SKU: {variant.sku} • Qty: {item.quantity} × ₹{variant.price}
                                            </p>
                                        </div>
                                        <strong style={{ color: "var(--text)", fontSize: "14px" }}>
                                            ₹{itemTotal}
                                        </strong>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Summary & Place Order */}
                <div
                    style={{
                        backgroundColor: "var(--card-bg)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "24px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        position: "sticky",
                        top: "80px"
                    }}
                >
                    <h3 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "var(--text)" }}>
                        Order Summary
                    </h3>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Total Items</span>
                        <span style={{ fontWeight: "600", color: "var(--text)" }}>{itemCount}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                        <span style={{ fontWeight: "600", color: "var(--text)" }}>₹{totalAmount}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "14px" }}>
                        <span style={{ color: "var(--text-muted)" }}>Delivery Fee</span>
                        <span style={{ fontWeight: "600", color: "#16a34a" }}>Free</span>
                    </div>

                    <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", fontSize: "18px", fontWeight: "700" }}>
                        <span>Total Payable</span>
                        <span style={{ color: "var(--primary)" }}>₹{totalAmount}</span>
                    </div>

                    {/* Selected Address Preview */}
                    {selectedAddress && (
                        <div
                            style={{
                                padding: "12px",
                                backgroundColor: "var(--bg-secondary)",
                                borderRadius: "6px",
                                fontSize: "12px",
                                color: "var(--text-muted)",
                                marginBottom: "20px"
                            }}
                        >
                            <p style={{ fontWeight: "600", color: "var(--text)", marginBottom: "2px" }}>
                                Delivering to:
                            </p>
                            <p>{selectedAddress.fullName}, {selectedAddress.addressLine1}, {selectedAddress.city} - {selectedAddress.postalCode}</p>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handlePlaceOrder}
                        disabled={placingOrder || !selectedAddressId}
                        style={{
                            width: "100%",
                            padding: "12px",
                            backgroundColor: selectedAddressId ? "var(--primary)" : "var(--border)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: selectedAddressId && !placingOrder ? "pointer" : "not-allowed",
                            opacity: placingOrder ? 0.7 : 1,
                            transition: "background-color 0.2s ease"
                        }}
                    >
                        {placingOrder ? "Placing Order..." : "Place Order (Cash on Delivery)"}
                    </button>

                    <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "12px", lineHeight: "1.4" }}>
                        By placing your order, you agree to Stockmint's terms of service and delivery policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
