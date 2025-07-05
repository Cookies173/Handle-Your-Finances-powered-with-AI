import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AccountCard({ account, onRefresh }){
    const [tdata, setTdata] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const { name, type, balance, id, isdefault, transactioncount } = account;

    useEffect(() => {
        if(tdata && !loading){
            setTimeout(() => {
                toast.success("Default Account Updated Successfully");
            }, 1000);
        }
    }, [loading, tdata]);

    useEffect(() => {
        if(error){
            toast.error(error.message || "Failed to Update Default Account");
        }
    }, [error]);

    const { getToken } = useAuth();

    const navigate = useNavigate();
    
    const updateDefaultAccount = async(id) => {

        if(isdefault){
            toast.warning("You need Ateast 1 Default Account");
            return;
        }

        setLoading(true);
        setError(null);
        try{
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/dash/def", {accountId : id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTdata(res);
            setError(null);
            if(onRefresh) onRefresh();
        }
        catch(err){
            console.error("Failed to update account:", err);
            setError(err);
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div>
            <Card onClick={() => navigate(`/account/${id}`)} className="hover:shadow-md transition-shadow group relative cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-0 py-0">
                    <CardTitle className="text-sm font-medium capitalize">{name}</CardTitle>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Switch checked={isdefault} onClick={() => updateDefaultAccount(id)} disabled={loading} />
                    </div>
                </CardHeader>
                <CardContent className="my-0 py-0">
                    <div className="text-2xl font-bold">
                        ₹{parseFloat(balance).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {type} Account
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground my-0 py-0">
                    <div className="flex items-center">
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                        Income
                    </div>
                    <p>{transactioncount} Transactions</p>
                    <div className="flex items-center">
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                        Expense
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

export default AccountCard;