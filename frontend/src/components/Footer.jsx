const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            style={{
                marginTop: "auto",
                borderTop: "1px solid var(--border)",
                backgroundColor: "var(--bg-secondary)",
                padding: "24px 16px",
                textAlign: "center",
                color: "var(--text-muted)",
                fontSize: "14px"
            }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <p style={{ fontWeight: "500", color: "var(--text)" }}>Stockmint E-Commerce</p>
                <p style={{ marginTop: "4px" }}>
                    &copy; {currentYear} Stockmint - 2026. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
