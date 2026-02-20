import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { idToName, idToColor } from "../../../lib/category.jsx";

function Overview({ transactions }){

    const [accounts, setAccounts] = useState(undefined);
    const [selectedAccountId, setSelectedAccountId] = useState(undefined);
    const [filteredTransactions, setFilteredTransactions] = useState(undefined);
    const [recentTransactions, setRecentTransactions] = useState(undefined);
    const [currentMonthExpenses, setCurrentMonthExpenses] = useState(undefined);
    const [expensesByCategory, setExpensesByCategory] = useState(undefined);
    const [pieChartData, setPieChartData] = useState(undefined);

    useEffect(() => {
        getAccounts();
    }, []);

    useEffect(() => {
        if(accounts){
            setSelectedAccountId(accounts.find((acc) => acc.isdefault)?.id || accounts[0]?.id);
        }
    }, [accounts]);

    useEffect(() => {
        if(selectedAccountId && transactions){
            setFilteredTransactions(transactions.filter((t) => t.accountid == selectedAccountId));
        }
    }, [selectedAccountId, transactions]);

    useEffect(() => {
        if(filteredTransactions){
            setRecentTransactions(filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5));
            const currentDate = new Date();
            setCurrentMonthExpenses(filteredTransactions.filter((t) => {
                const transactionDate = new Date(t.date);
                return (
                    t.type == "expense" && transactionDate.getMonth() == currentDate.getMonth() && transactionDate.getFullYear() == currentDate.getFullYear()
                );
            }));
        }
    }, [filteredTransactions]);

    useEffect(() => {
        if(currentMonthExpenses){
            setExpensesByCategory(currentMonthExpenses.reduce((acc, transaction) => {
                const category=transaction.category;
                if(!acc[category]) acc[category] = 0;
                acc[category] += parseFloat(transaction.amount);
                return acc;
            }, {}));
        }
    }, [currentMonthExpenses]);

    useEffect(() => {
        if(expensesByCategory){
            setPieChartData(Object.entries(expensesByCategory).map(([category, amount]) => ({name: category, value: amount})));
        }
    }, [expensesByCategory]);

    const { getToken } = useAuth();

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
            console.error("Failed to get accounts:", err);
        }
    };

    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-base font-normal">Recent Transactions</CardTitle>
                        <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Account" />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts ? (
                                    accounts.map((acc) => (
                                        <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                    ))
                                ) : (
                                    <div className="flex items-center">
                                        <Loader2 className="mr-2 animate-spin" />
                                    </div>
                                )}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        {recentTransactions && (
                            <div className="space-y-2">
                                {recentTransactions.length == 0 ? (
                                    <p className="text-center text-muted-foreground py-4">No Recent Transactions</p>
                                ) : (
                                    recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{transaction.description || "Untitled Description"}</p>
                                                <p className="text-sm text-muted-foreground">{format(new Date(transaction.date), "PP")}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={cn("flex items-center", transaction.type == "expense" ? "text-red-500" : "text-green-500")}>
                                                    {transaction.type == "expense" ? (
                                                        <ArrowDownRight className="mr-1 h-4 w-4" />
                                                    ) : (
                                                        <ArrowUpRight className="mr-1 h-4 w-4" />
                                                    )}
                                                    ₹{parseFloat(transaction.amount).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base font-normal">Monthly Expense Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 pb-5">
                        {pieChartData && (
                            <div>
                                {pieChartData.length==0 ? (
                                    <p className="text-center text-muted-foreground py-4">No Expense this Month</p>
                                ) : (
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie 
                                                    data={pieChartData} 
                                                    cx="50%" cy="50%" 
                                                    outerRadius={80} 
                                                    label={({name, value}) => `${idToName[name]}: ₹${value.toFixed(2)}`}
                                                    dataKey="value"
                                                    fill="#81EC86"
                                                >
                                                    {pieChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={idToColor[entry.name]}/>
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Overview;