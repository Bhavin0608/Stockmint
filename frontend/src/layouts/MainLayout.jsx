import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
