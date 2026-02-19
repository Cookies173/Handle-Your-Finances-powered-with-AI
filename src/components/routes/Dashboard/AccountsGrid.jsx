import React, { useEffect, useState } from "react";
import CreateAccount from "./CreateAccount.jsx";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import AccountCard from "./AccountCard.jsx";
import { BarLoader } from "react-spinners";

function AccountsGrid(){

    const [accounts, setAccounts] = useState(undefined);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const { getToken } = useAuth();

    useEffect(() => {
        getAccounts();
    }, []);

    useEffect(() => {
        if(accounts) setLoading(false);
    }, [accounts]);

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

    if(loading) return <BarLoader className="mt-4" width={"100%"} color="#446B5C" />;

    return(
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-8">
            <CreateAccount open={open} setOpen={setOpen} triggerButton={true} onRefresh={getAccounts} />
            {accounts!=undefined && accounts.map((account) => {
                return <AccountCard key={account.id} account={account} onRefresh={getAccounts} />
            })}
        </div>
    );
}

export default AccountsGrid;