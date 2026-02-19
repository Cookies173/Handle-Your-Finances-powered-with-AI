import React, { Suspense } from "react";
import Header from "../Header/Header";
import Footer from "../Header/Footer";
import { BarLoader } from "react-spinners";
const Budget = React.lazy(() => import("./Budget.jsx"));
const Overview = React.lazy(() => import("./Overview.jsx"));

function Analytics(){

    return (
    <div>
        <Header />
        <div className="px-4 py-20">
            <h1 className="text-6xl font-bold gradient-title mb-4">Analytics</h1>
            <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#446B5C" />}>
                <Budget />
                <Overview />
            </Suspense>
        </div>
        <Footer />
    </div>
    );
}

export default Analytics;