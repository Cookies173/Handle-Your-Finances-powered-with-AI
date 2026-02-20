import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

function Budget(){

    const [initialBudget, setInitialBudget] = useState(undefined);
    const [currentExpenses, setCurrentExpenses] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "");
    const [tdata, setTdata] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const percentageUsed = (initialBudget) ? (parseFloat(currentExpenses) / parseFloat(initialBudget.amount)) * 100 : 0;

    useEffect(() => {
        getCurrentBudget();
    }, [tdata, loading]);

    const { getToken } = useAuth();

    const getCurrentBudget = async () => {
        try{
            const token = await getToken();
            const res = await axios.get("https://penny-pilot-server.vercel.app/anyl/bud", {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            if(res.data.budget!=undefined) setInitialBudget(res.data.budget);
            setCurrentExpenses(res.data.expenses);
        }
        catch(err){
            console.error("Failed to fetch budget:", err.message);
        }
    };

    useEffect(() => {
        if(tdata && !loading){
            setTimeout(() => {
                toast.success("Budget Updated Successfully");
                setIsEditing(false);
            }, 1000);
        }
    }, [loading, tdata]);

    useEffect(() => {
        if(error){
            toast.error(error.message || "Failed to Update new Budget");
        }
    }, [error]);

    const updateBudget = async () => {
        setLoading(true);
        setError(null);
        try{
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/anyl/upb", { newAmount : newBudget }, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setTdata(res);
            setError(null);
        }
        catch(err){
            console.error("Failed to fetch budget:", err.message);
            setError(err);
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    };

    const handleUpdateBudget = () => {
        const amount = parseFloat(newBudget);
        if(isNaN(amount) || amount<=0){
            toast.error("Please enter a valid amount");
            return;
        }
        updateBudget();
    };

    const handleCancel = () => {
        setNewBudget(initialBudget?.amount?.toString() || "");
        setIsEditing(false);
    };

    return(
        <div className="pb-8">
            <Card>
                <CardHeader className="flex items-center justify-between space-y-0 pb-2">
                    <div className="flex-1">
                        <CardTitle>Monthly Budget (Default Account)</CardTitle>
                        <div className="flex items-center mt-1 gap-2">
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        value={newBudget}
                                        onChange={(e) => setNewBudget(e.target.value)}
                                        className="w-32"
                                        placeholder="Enter Amount"
                                        autoFocus
                                        disabled={loading} />
                                    <Button variant="ghost" size="icon" onClick={handleUpdateBudget} disabled={loading}>
                                        <Check className="h-4 w-4 text-green-500" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={handleCancel} disabled={loading}>
                                        <X className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CardDescription>
                                        {initialBudget 
                                        ? `₹${parseFloat(currentExpenses).toFixed(2)} of ₹${parseFloat(initialBudget.amount).toFixed(2)} spent`
                                        : "No Budget Set"}
                                    </CardDescription>
                                    <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-6 w-6">
                                            <Pencil className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {initialBudget && (<div className="space-y-2">
                        <Progress 
                            value={percentageUsed} 
                            extraStyles={(percentageUsed>=90) ? ("bg-red-500") :
                                            ((percentageUsed>=65) ? "bg-yellow-500" : "bg-green-500")} 
                        />
                        <p className="text-xs text-muted-foreground text-right">{percentageUsed.toFixed(2)}% used</p>
                    </div>)}
                </CardContent>
            </Card>
        </div>
    );
}

export default Budget;