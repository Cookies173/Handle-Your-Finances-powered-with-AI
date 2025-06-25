import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import axios from "axios";

function AccountCard({ account }){
    const [tdata, setTdata] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const { name, type, balance, id, isdefault } = account;

    useEffect(() => {
        if(tdata && !loading){
            toast.success("Account Set to Defualt");
        }
    }, [loading, tdata]);

    useEffect(() => {
        if(error){
            toast.error(error.message || "Failed to Update Default Account");
        }
    }, [error]);

    const { getToken } = useAuth();
    
    const updateDefaultAccount = async(id) => {

        if(isdefault){
            toast.warning("You need Ateast 1 Default Account");
            return;
        }

        setLoading(true);
        setError(null);
        try{
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/acct/deft", {accountId : id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTdata(res);
            setError(null);
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
            {/* <Link to={`/account/${id}`}> */}
                <Card className="hover:shadow-md transition-shadow group relative">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-0 py-0">
                        <CardTitle className="text-sm font-medium capitalize"><Link to={`/account/${id}`}>{name}</Link></CardTitle>
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
                        <div className="flex items-center">
                            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                            Expense
                        </div>
                    </CardFooter>
                </Card>
            {/* </Link> */} 
        </div>
    );
}

export default AccountCard;