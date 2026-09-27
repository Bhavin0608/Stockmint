import { createContext, useState, useEffect, useContext } from "react";
import {
    getCart,
    addItemToCart,
    updateCartItemQuantity,
    removeCartItem
} from "../services/cart.service";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        if (isAuthenticated) {
            getCart()
                .then((response) => {
                    if (isMounted && response?.data) {
                        setCart(response.data);
                    }
                })
                .catch((err) => {
                    if (isMounted) {
                        console.error("Failed to fetch cart:", err);
                    }
                });
        }

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated]);

    const addToCart = async (variantId, quantity = 1) => {
        try {
            setLoading(true);
            const response = await addItemToCart(variantId, quantity);
            if (response?.data) {
                // If backend returns populated cart or we re-fetch to ensure full variant/product population
                const freshCart = await getCart();
                setCart(freshCart.data || response.data);
            }
            return response;
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (variantId, quantity) => {
        try {
            setLoading(true);
            const response = await updateCartItemQuantity(variantId, quantity);
            if (response?.data) {
                const freshCart = await getCart();
                setCart(freshCart.data || response.data);
            }
            return response;
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (variantId) => {
        try {
            setLoading(true);
            const response = await removeCartItem(variantId);
            if (response?.data) {
                const freshCart = await getCart();
                setCart(freshCart.data || response.data);
            }
            return response;
        } finally {
            setLoading(false);
        }
    };

    const refreshCart = async () => {
        if (!isAuthenticated) return;
        try {
            setLoading(true);
            const response = await getCart();
            if (response?.data) {
                setCart(response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const items = isAuthenticated ? cart?.items || [] : [];
    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totalAmount = items.reduce(
        (sum, item) => sum + (item.variantId?.price || 0) * (item.quantity || 0),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cart,
                items,
                itemCount,
                totalAmount,
                loading,
                addToCart,
                updateQuantity,
                removeItem,
                refreshCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
