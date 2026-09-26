import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getCategories } from "../services/category.service";
import { getProducts } from "../services/product.service";
import CategoryFilter from "../components/catalog/CategoryFilter";
import ProductCard from "../components/catalog/ProductCard";

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCategory = searchParams.get("category") || "";
    const currentPage = parseInt(searchParams.get("page") || "1", 10);

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    // Load active categories on mount
    useEffect(() => {
        let isMounted = true;
        const loadCategories = async () => {
            try {
                const response = await getCategories();
                if (isMounted && response?.data) {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error("Failed to load categories:", err);
            }
        };

        loadCategories();
        return () => {
            isMounted = false;
        };
    }, []);

    // Load products when category, page, or retryCount changes
    useEffect(() => {
        let isMounted = true;

        getProducts({
            page: currentPage,
            limit: 12,
            categoryId: currentCategory
        })
            .then((response) => {
                if (isMounted && response?.data) {
                    setProducts(response.data.products || []);
                    if (response.data.pagination) {
                        setPagination(response.data.pagination);
                    }
                    setError("");
                }
            })
            .catch((err) => {
                if (isMounted) {
                    console.error("Failed to load products:", err);
                    setError(err.response?.data?.message || "Failed to load products. Please try again.");
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
    }, [currentCategory, currentPage, retryCount]);

    const handleSelectCategory = (categoryId) => {
        setLoading(true);
        const nextParams = {};
        if (categoryId) {
            nextParams.category = categoryId;
        }
        // Always reset to page 1 when switching categories
        nextParams.page = "1";
        setSearchParams(nextParams);
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > pagination.totalPages) return;
        setLoading(true);
        const nextParams = {};
        if (currentCategory) {
            nextParams.category = currentCategory;
        }
        nextParams.page = String(newPage);
        setSearchParams(nextParams);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleRetry = () => {
        setLoading(true);
        setRetryCount((prev) => prev + 1);
    };

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px", width: "100%" }}>
            {/* Header Title */}
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "8px", letterSpacing: "-0.5px" }}>
                    Explore Products
                </h1>
                <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
                    Browse our collection of products and available inventory.
                </p>
            </div>

            {/* Category Filter Pills */}
            <CategoryFilter
                categories={categories}
                selectedCategoryId={currentCategory}
                onSelectCategory={handleSelectCategory}
            />

            {/* Error Message with Retry */}
            {error && (
                <div
                    style={{
                        padding: "16px",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        color: "var(--danger)",
                        marginBottom: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <span>{error}</span>
                    <button
                        onClick={handleRetry}
                        style={{
                            padding: "6px 12px",
                            backgroundColor: "var(--danger)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "13px",
                            fontWeight: "600"
                        }}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div style={{ padding: "60px 0", textAlign: "center", color: "var(--text-muted)" }}>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>Loading products...</p>
                </div>
            ) : products.length === 0 ? (
                /* Empty State */
                <div
                    style={{
                        padding: "60px 24px",
                        textAlign: "center",
                        backgroundColor: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        margin: "24px 0"
                    }}
                >
                    <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)", marginBottom: "8px" }}>
                        No products found
                    </p>
                    <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>
                        There are currently no products available in this category.
                    </p>
                    {currentCategory && (
                        <button
                            type="button"
                            onClick={() => handleSelectCategory("")}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "var(--primary)",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "500"
                            }}
                        >
                            View All Products
                        </button>
                    )}
                </div>
            ) : (
                /* Product Grid */
                <>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: "24px",
                            marginBottom: "32px"
                        }}
                    >
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    {/* Pagination Bar */}
                    {pagination.totalPages > 1 && (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "16px",
                                padding: "16px 0",
                                borderTop: "1px solid var(--border)"
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "var(--bg-secondary)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    color: currentPage <= 1 ? "var(--text-muted)" : "var(--text)",
                                    cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                &larr; Previous
                            </button>

                            <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>
                                Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
                            </span>

                            <button
                                type="button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= pagination.totalPages}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "var(--bg-secondary)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "6px",
                                    color: currentPage >= pagination.totalPages ? "var(--text-muted)" : "var(--text)",
                                    cursor: currentPage >= pagination.totalPages ? "not-allowed" : "pointer",
                                    fontSize: "14px",
                                    fontWeight: "500"
                                }}
                            >
                                Next &rarr;
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Home;
