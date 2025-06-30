import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, { Suspense, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Info from "./Info.jsx";
import Header from "../Header/Header.jsx";
import Footer from "../Header/Footer.jsx";
import TransactionTable from "./TransactionTable.jsx";
import { BarLoader } from "react-spinners";
import { Toaster } from "@/components/ui/sonner";
import Chart from "./Chart.jsx";

function Account(){

    const [account, setAccount] = useState(undefined);
    const [transactions, setTransactions] = useState(undefined);

    const { id } = useParams();

    const { getToken } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        getAccountDetail();
    }, []);

    const getAccountDetail = async() => {
        try{
            const token = await getToken();

            const res = await axios.post("https://penny-pilot-server.vercel.app/acnt/det", {accountId : id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(!res.data.accounts[0]){
                navigate("/*");
                return;
            }
            setAccount(res.data.accounts[0]);
            setTransactions(res.data.transactions);
        }
        catch(err){
            console.error("Failed to fetch accounts:", err.message);
        }
    };
    
    return (
        <div>
            {account!=undefined && transactions!=undefined && (
                <div>
                    <Header />
                    <Info account={account} transactions={transactions}/>
                    <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#446B5C" />}>
                        <Chart transactions={transactions} />
                    </Suspense>
                    <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#446B5C" />}>
                        <TransactionTable transactions={transactions} onRefresh={getAccountDetail} />
                    </Suspense>
                    <Toaster richColors/>
                    <Footer />
                </div>
            )}
        </div>
    );
}

export default Account;