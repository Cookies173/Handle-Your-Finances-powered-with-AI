import React, { Suspense, useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Header/Footer";
import { BarLoader } from "react-spinners";
const Budget = React.lazy(() => import("./Budget.jsx"));
const Overview = React.lazy(() => import("./Overview.jsx"));
const Monthly = React.lazy(() => import("./Monthly.jsx"));
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

function Analytics(){

    const [transactions, setTransactions] = useState(undefined);

    useEffect(() => {
        getTransactions();
    }, []);

    const { getToken } = useAuth();

    const getTransactions = async () => {
        try{
            const token = await getToken();
            const res = await axios.get("http://localhost:3000/anyl/dat", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTransactions(res.data.transactions);
        }
        catch(err){
            console.error("Failed to get transactions:", err);
        }
    };

    return (
    <div>
        <Header />
        <div className="px-4 py-20">
            <h1 className="text-6xl font-bold gradient-title mb-4">Analytics</h1>
            <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#446B5C" />}>
                <Budget />
                <Overview transactions={transactions} />
                <Monthly transactions={transactions} />
            </Suspense>
        </div>
        <Footer />
    </div>
    );
}

export default Analytics;