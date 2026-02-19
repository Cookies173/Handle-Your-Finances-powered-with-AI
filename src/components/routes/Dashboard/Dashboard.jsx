import React from "react";
import Header from "../Header/Header.jsx";
import Footer from "../Header/Footer.jsx";
import { Toaster } from "@/components/ui/sonner";
import AccountsGrid from "./AccountsGrid.jsx";

function Dashboard(){

    return(
        <div>
            <Header />
            <div className="px-4 py-20">
                <h1 className="text-6xl font-bold gradient-title mb-4">Dashboard</h1>
                <AccountsGrid />
            </div>
            <Toaster richColors/>
            <Footer />
        </div>
    );
}

export default Dashboard;