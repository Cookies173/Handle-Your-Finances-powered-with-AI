import React, { useEffect, useState } from "react";
import CreateAccount from "./CreateAccount.jsx";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import AccountCard from "./AccountCard.jsx";

function AccountsGrid(){

    const [accounts, setAccounts] = useState(undefined);

    const { getToken } = useAuth();

    useEffect(() => {
        getAccounts();
        const handleClick = () => {
            getAccounts();
        };
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    const getAccounts = async () => {
        try{
            const token = await getToken();

            const res = await axios.get("https://penny-pilot-server.vercel.app/dash/acc", {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setAccounts(res.data.accounts);
        }
        catch(err){
            console.error("Failed to fetch accounts:", err.message);
        }
    };

    return(
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4">
            <CreateAccount onUpdate={getAccounts}/>
            {accounts!=undefined && accounts.map((account) => {
                return <AccountCard key={account.id} account={account} onUpdate={getAccounts}/>
            })}
        </div>
    );
}

export default AccountsGrid;