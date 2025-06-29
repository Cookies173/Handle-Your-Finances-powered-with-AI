import React, { Suspense } from "react";
import Header from "../Header/Header.jsx";
import Footer from "../Header/Footer.jsx";
import LoadPage from "./LoadPage.jsx";
import { BarLoader } from "react-spinners";
import { Toaster } from "@/components/ui/sonner";

function Dashboard(){
    return(
        <div>
            <Header />
            <div className="px-4 py-20">
                <h1 className="text-6xl font-bold gradient-title mb-4">Dashboard</h1>
                <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#446B5C" />}>
                    <LoadPage />
                </Suspense>
            </div>
            <Toaster richColors/>
            <Footer />
        </div>
    );
}

export default Dashboard;