import React, { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { endOfDay, format, parseISO, startOfDay, subDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DATE_RANGES = {
    "7D" : { label : "Last 7 Days", days : 7 },
    "1M" : { label : "Last 1 Month", days : 30 },
    "3M" : { label : "Last 3 Months", days : 90 },
    "6M" : { label : "Last 6 Months", days : 180 },
    "ALL" : { label : "All Time", days : null },
};

function Chart({ transactions }){

    const [dateRange, setDateRange] = useState("1M");

    const filteredData = useMemo(() => {
        const range = DATE_RANGES[dateRange];
        const now = new Date();
        const startDay = range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));
        const endDay = endOfDay(now);

        const filtered = transactions.filter((t) => {
            const tDate = parseISO(t.date);
            return tDate >= startDay && tDate <=endDay;
        });

        const grouped = filtered.reduce((acc, t) => {
            const key = format(new Date(t.date), "yyyy-MM-dd");
            if(!acc[key]){
                acc[key] = {
                    sortDate: key,
                    date: format(new Date(t.date), "MMM dd"),
                    income: 0,
                    expense: 0,
                    invested: 0
                };
            }
            if(t.type === "income"){
                acc[key].income += parseFloat(t.amount);
            } 
            else if(t.type === "invested"){
                acc[key].invested += parseFloat(t.amount);
            }
            else{
                acc[key].expense += parseFloat(t.amount);
            }

            return acc;
        }, {});
        
        return Object.values(grouped).sort((a, b) => (
            new Date(a.sortDate) - new Date(b.sortDate)
        ));

    }, [transactions, dateRange]);

    const totals = useMemo(() => {
        return filteredData.reduce((acc, t) => (
            {
                income : acc.income + t.income, 
                expense : acc.expense + t.expense,
                invested : acc.invested + t.invested
            }
        ), {income : 0, expense : 0, invested : 0});
    }, [filteredData]);


    return (
        <div className="px-5">
            <Card>
                <CardHeader className="flex items-center justify-between space-y-0 pb-7">
                    <CardTitle className="text-base font-normal">Transactions Overview</CardTitle>
                    <Select defaultValue={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Select Range" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(DATE_RANGES).map(([key, { label }]) => {
                                return <SelectItem key={key} value={key}>{label}</SelectItem>;
                            })}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-around text-sm mb-6">
                        <div className="text-center">
                            <p className="text-muted-foreground">Total Income</p>
                            <p className="text-lg font-bold text-green-500">₹{totals.income.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-muted-foreground">Total Expense</p>
                            <p className="text-lg font-bold text-red-500">₹{totals.expense.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-muted-foreground">Total Investments</p>
                            <p className="text-lg font-bold text-violet-500">₹{totals.invested.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-muted-foreground">Net Amount</p>
                            <p className={`text-lg font-bold ${(totals.income-totals.expense-totals.invested>=0) ? "text-green-500" : "text-red-500"}`}>
                                ₹{(totals.income-totals.expense-totals.invested).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="h-[300px]">
                        <ResponsiveContainer>
                            <BarChart data={filteredData} margin={ { top:10, left:10, right:10, bottom:0 } }>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="income" name="Income" fill="#48bb78" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" name="Expense" fill="#F44336"  radius={[4, 4, 0, 0]} />
                                <Bar dataKey="invested" name="Saving & Investment" fill="#7c3aed"  radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Chart;