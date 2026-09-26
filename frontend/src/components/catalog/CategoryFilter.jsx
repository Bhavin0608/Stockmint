const CategoryFilter = ({ categories = [], selectedCategoryId = "", onSelectCategory }) => {
    return (
        <div
            style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: "8px",
                marginBottom: "24px"
            }}
        >
            <button
                type="button"
                onClick={() => onSelectCategory("")}
                style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: selectedCategoryId === "" ? "var(--primary)" : "var(--border)",
                    backgroundColor: selectedCategoryId === "" ? "var(--primary)" : "var(--bg-secondary)",
                    color: selectedCategoryId === "" ? "#ffffff" : "var(--text)",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease"
                }}
            >
                All Products
            </button>

            {categories.map((category) => {
                const isSelected = selectedCategoryId === category._id;
                return (
                    <button
                        key={category._id}
                        type="button"
                        onClick={() => onSelectCategory(category._id)}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "20px",
                            border: "1px solid",
                            borderColor: isSelected ? "var(--primary)" : "var(--border)",
                            backgroundColor: isSelected ? "var(--primary)" : "var(--bg-secondary)",
                            color: isSelected ? "#ffffff" : "var(--text)",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            transition: "all 0.2s ease"
                        }}
                    >
                        {category.name}
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryFilter;
