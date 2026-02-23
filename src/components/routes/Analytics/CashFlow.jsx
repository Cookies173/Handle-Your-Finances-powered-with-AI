import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { format, addYears, subYears, getYear } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function CashFlow({ transactions }){

    const [date, setDate] = useState(new Date());
    const [yearTransactions, setYearTransactions] = useState([]);
    const [totalByMonth, setTotalByMonth] = useState({});
    const [barChartData, setBarChartData] = useState(undefined);

    useEffect(() => {
        if(transactions && date){
            setYearTransactions(transactions.filter((t) => {
                const transactionDate = new Date(t.date);
                return transactionDate.getYear() == date.getYear();
            }));
        }
    }, [transactions, date]);

    useEffect(() => {
        if(date){
            setTotalByMonth(yearTransactions.reduce((acc, t) => {
                const month = format(new Date(t.date), "MMMM");
                if(t.type=="expense") acc[month].expense-=parseFloat(t.amount);
                else if(t.type=="income") acc[month].income+=parseFloat(t.amount);
                else acc[month].invested-=parseFloat(t.amount);
                return acc;
            }, {January: {income: 0, expense: 0, invested: 0},
                February: {income: 0, expense: 0, invested: 0},
                March: {income: 0, expense: 0, invested: 0},
                April: {income: 0, expense: 0, invested: 0},
                May: {income: 0, expense: 0, invested: 0},
                June: {income: 0, expense: 0, invested: 0},
                July: {income: 0, expense: 0, invested: 0},
                August: {income: 0, expense: 0, invested: 0},
                September: {income: 0, expense: 0, invested: 0},
                October: {income: 0, expense: 0, invested: 0},
                November: {income: 0, expense: 0, invested: 0},
                December: {income: 0, expense: 0, invested: 0}
            }));
        }
    }, [yearTransactions, date]);

    useEffect(() => {
        if(date){
            setBarChartData(Object.entries(totalByMonth).map(([month, stats]) => {
                const percentageExpense = parseFloat(stats.income) ? (parseFloat(-stats.expense) / parseFloat(stats.income)) * 100 : 0;
                const percentageInvested = parseFloat(stats.income) ? (parseFloat(-stats.invested) / parseFloat(stats.income)) * 100 : 0;
                return ({month: month, expense: stats.expense, income: stats.income, invested: stats.invested, perE: percentageExpense, perI: percentageInvested});
            }));
        }
    }, [date, totalByMonth]);
    
    const formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <div className="pb-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Cashflow</CardTitle>
                    <div className="flex flex-row items-center justify-between space-y-0">
                        <Button variant="outline" size="sm" onClick={() => setDate(subYears(date, 1))}>
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <CardTitle className=" px-2 text-base font-medium leading-none">Year: {format(date, "yyyy")}</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setDate(addYears(date, 1))} disabled={getYear(new Date()) == getYear(date)}>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="px-18"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-[150px]">
                        <ResponsiveContainer>
                            <BarChart data={barChartData} stackOffset="sign" margin={ { top:0, left:0, right:0, bottom:0 } } >
                                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} />
                                <XAxis dataKey="month" type="category"  fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis type="number" fontSize={12} tickLine={false} axisLine={false} hide={true}/>
                                <Tooltip 
                                    cursor={{ fill: "rgba(124,58,237,0.1)" }}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                    }}
                                    formatter={(value, name, props) => {
                                        if(name != "Income") return null;
                                        const { expense, income, invested, perI, perE } = props.payload;
                                        return [
                                            <div>
                                                <div className="text-sm font-semibold text-green-500 pb-2">Income: {formatter.format(income)}₹</div>
                                                <div className="text-sm font-semibold text-red-500 pb-2">Expense: {formatter.format(expense)}₹ ({formatter.format(perE)}%)</div>
                                                <div className="text-sm font-semibold text-violet-500 pb-2">Income: {formatter.format(invested)}₹ ({formatter.format(perI)}%)</div>
                                            </div>
                                        ];
                                    }}
                                />
                                <Bar dataKey="income" name="Income" fill="#48bb78" stackId="stack" />
                                <Bar dataKey="expense" name="Expense" fill="#F44336" stackId="stack" />
                                <Bar dataKey="invested" name="Saving & Investment"  fill="#7c3aed" stackId="stack" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default CashFlow;