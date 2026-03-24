import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function Splitter(){

    const [splits, setSplits] = useState({balance:0, transactioncount:0});

    useEffect(() => {
        getSplits();
    }, [])

    const { getToken } = useAuth();

    const getSplits = async () => {
        try{
            const token = await getToken();
            const res = await axios.get("https://penny-pilot-server.vercel.app/dash/slt", {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setSplits(res.data.splits[0]);
        }
        catch(err){
            console.error("Failed to fetch splits", err.message);
        }
    };

    const navigate = useNavigate();

    return (
        <div>
            <Card onClick={() => navigate(`/spliter`)} className="hover:shadow-md transition-shadow group relative cursor-pointer bg-blue-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 mb-0 py-0">
                    <CardTitle className="text-sm font-medium capitalize">Splitter</CardTitle>
                </CardHeader>
                <CardContent className="my-0 py-0">
                    {splits && (
                        <div className="text-2xl font-bold">
                            ₹{splits.balance ? parseFloat(splits.balance).toFixed(2) : 0}
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Track your Owed and Owned Transactions
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground my-0 py-0">
                    <div className="flex items-center">
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                        Income
                    </div>
                    {splits && <p>{splits.transactioncount} Transactions</p>}
                    <div className="flex items-center">
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                        Expense
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Splitter;