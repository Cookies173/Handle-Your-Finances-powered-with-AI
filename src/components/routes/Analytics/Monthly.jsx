import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { format, addMonths, subMonths, getMonth } from "date-fns";
import { defaultCategories, idToName, nameToColor } from "../../../lib/category.jsx";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Monthly({ transactions }){

    const [type, setType] = useState("expense");
    const [date, setDate] = useState(new Date());
    const [typeTransactions, setTypeTransactions] = useState([]);
    const [typeTotalSum, setTypeTotalSum] = useState(0);
    const [typeByCategory, setTypeByCategory] = useState({});
    const [barChartData, setBarChartData] = useState(undefined);

    useEffect(() => {
        if(transactions && date && type){
            setTypeTransactions(transactions.filter((t) => {
                const transactionDate = new Date(t.date);
                return (
                    t.type == type && transactionDate.getMonth() == date.getMonth() && transactionDate.getFullYear() == date.getFullYear()
                );
            }));
        }
    }, [transactions, date, type]);

    useEffect(() => {
        if(defaultCategories && date && type){
            setTypeByCategory(defaultCategories.reduce((acc, t) => {
                const category=t.id;
                if(!acc[idToName[category]] && t.type == type) acc[idToName[category]] = 0;
                return acc;
            }, {}));
        }
    }, [typeTransactions, defaultCategories, date, type]);

    useEffect(() => {
        if(date){
            setTypeTotalSum(typeTransactions.reduce((acc, t) => {
                acc += parseFloat(t.amount);
                return acc;
            }, 0));
            setTypeByCategory(typeTransactions.reduce((acc, t) => {
                const category=t.category;
                if(!acc[idToName[category]]) acc[idToName[category]] = 0;
                acc[idToName[category]] += parseFloat(t.amount);
                return acc;
            }, typeByCategory));
        }
    }, [typeByCategory, date]);

    

    useEffect(() => {
        if(date && type){
            setBarChartData(Object.entries(typeByCategory).map(([category, amount]) => {
                const percentage = (typeTotalSum) ? (parseFloat(amount) / parseFloat(typeTotalSum)) * 100 : 0;
                return ({name: category, value: percentage, amount: amount});
            }));
        }
    }, [date, typeByCategory, typeTotalSum, type]);

    return (
        <div className="py-8">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Monthly Breakdown</CardTitle>
                    <div className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <Button variant="outline" size="sm" onClick={() => setDate(subMonths(date, 1))}>
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <CardTitle className="text-base font-normal px-2">{format(date, "MMMM, yyyy")}</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => setDate(addMonths(date, 1))} disabled={getMonth(new Date()) == getMonth(date)}>
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="income">Income</SelectItem>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="invested">Saving & Investment</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="h-[360px]">
                        <ResponsiveContainer>
                            <BarChart data={barChartData} margin={ { top:0, left:50, right:100, bottom:0 } } layout="vertical" >
                                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} />
                                <XAxis type="number"  fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${parseFloat(value).toFixed(2)}%`} />
                                <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{ fill: "rgba(124,58,237,0.1)" }}
                                    formatter={(value, name, props) => {
                                        const { amount } = props.payload;
                                        return `${parseFloat(value).toFixed(2)}% (₹${parseFloat(amount).toFixed(2)})`;
                                    }}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                    }}
                                />
                                <Bar dataKey="value" name="Contribution" radius={[0, 4, 4, 0]} barSize={15} label={{ position: 'right', formatter: (value) => `${parseFloat(value).toFixed(2)}%` }}>
                                    {barChartData && (barChartData.map((entry, index) => (
                                        <Cell key={index} fill={nameToColor[entry.name]} />
                                    )))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Monthly;