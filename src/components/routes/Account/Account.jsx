import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Info from "./Info.jsx";
import Header from "../Header/Header.jsx";
import Footer from "../Header/Footer.jsx";
import TransactionTable from "./TransactionTable.jsx";

function Account(){

    const [account, setAccount] = useState(undefined);

    const { id } = useParams();

    const { getToken } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        getAccountDetail();
    }, []);

    // console.log(account);

    const getAccountDetail = async() => {
        try{
            const token = await getToken();

            const res = await axios.post("https://penny-pilot-server.vercel.app/acnt/det", {accountId : id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(!res.data.accounts[0]){
                navigate("*");
                return;
            }
            setAccount(res.data.accounts[0]);
        }
        catch(err){
            console.error("Failed to fetch accounts:", err.message);
        }
    };
    
    return (
        <div>
            {account!=undefined && (
                <div>
                    <Header />
                    <Info account={account}/>
                    <TransactionTable />
                    <Footer />
                </div>
            )}
        </div>
    );
}

export default Account;