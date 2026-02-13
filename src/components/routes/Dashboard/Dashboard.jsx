import React, { Suspense, useState } from "react";
import Header from "../Header/Header.jsx";
import Footer from "../Header/Footer.jsx";
import { BarLoader } from "react-spinners";
import { Toaster } from "@/components/ui/sonner";
const Budget = React.lazy(() => import("./Budget.jsx"));
const Overview = React.lazy(() => import("./Overview.jsx"));
const AccountsGrid = React.lazy(() => import("./AccountsGrid.jsx"));

function Dashboard(){

    const [defaultProp, setDefaultProp] = useState([]);

    return(
        <div>
            <Header />
            <div className="px-4 py-20">
                <h1 className="text-6xl font-bold gradient-title mb-4">Dashboard</h1>
                <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#446B5C" />}>
                    {/* {defaultProp.length>0 && <Budget dprop={defaultProp} />} */}
                    {/* <Overview /> */}
                    <AccountsGrid onNewDefault={setDefaultProp} />
                </Suspense>
            </div>
            <Toaster richColors/>
            <Footer />
        </div>
    );
}

export default Dashboard;