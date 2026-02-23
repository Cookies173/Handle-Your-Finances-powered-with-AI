import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { format, addYears, subYears, getYear } from "date-fns";
import { defaultCategories, idToName, nameToColor } from "../../../lib/category.jsx";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Yearly({ transactions }){

    const [type, setType] = useState("expense");
    const [date, setDate] = useState(new Date());
    const [typeTransactions, setTypeTransactions] = useState([]);
    const [typeTotalSum, setTypeTotalSum] = useState(0);
    const [typeByCategory, setTypeByCategory] = useState({});
    const [barChartData, setBarChartData] = useState(undefined);
    const [typeDescription, setTypeDescription] = useState({});
    const [arr1, setArr1] = useState([]);
    const [arr2, setArr2] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        if(transactions && date && type){
            setTypeTransactions(transactions.filter((t) => {
                const transactionDate = new Date(t.date);
                return (
                    t.type == type && transactionDate.getYear() == date.getYear()
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
            setTypeDescription(typeTransactions.reduce((acc, t) => {
                const category=t.category;
                const description = t.description;
                if(!acc[idToName[category]]) acc[idToName[category]] = {};
                if(!acc[idToName[category]][description]) acc[idToName[category]][description]=0;
                acc[idToName[category]][description] += parseFloat(t.amount);
                return acc;
            }, {}));
        }
    }, [date, type, typeTransactions]);

    useEffect(() => {
        if(date && type){
            setArr1(Object.entries(typeByCategory).map(([category, amount]) => {
                const percentage = (typeTotalSum) ? (parseFloat(amount) / parseFloat(typeTotalSum)) * 100 : 0;
                return ({name: category, value: percentage, amount: amount});
            }));

            setArr2(Object.entries(typeDescription).map(([category, description]) => {
                return({name: category, description: description});
            }));
        }
    }, [date, typeByCategory, typeTotalSum, typeDescription, type]);

    useEffect(() => {
        setBarChartData(arr1.map(item => {
            const match = arr2.find(i => i.name == item.name);
            if(match){
                return {...item, ...match};
            }
            else return item;
        }));
    }, [arr1, arr2]);

    const formatter = new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle>Yearly Breakdown</CardTitle>
                    <div className="flex flex-row items-center justify-between space-y-0">
                        <Button variant="outline" size="sm" onClick={() => setDate(subYears(date, 1))}>
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="px-2 items-center flex flex-col">
                            <CardTitle className="text-base font-medium leading-none">Year: {format(date, "yyyy")}</CardTitle>
                            <p className="text-center text-muted-foreground">Total: {formatter.format(typeTotalSum)} ₹</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setDate(addYears(date, 1))} disabled={getYear(new Date()) == getYear(date)}>
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
                    <div className="h-[320px]">
                        <ResponsiveContainer>
                            <BarChart data={barChartData} margin={ { top:0, left:50, right:100, bottom:0 } } layout="vertical" >
                                <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} />
                                <XAxis type="number"  fontSize={12} tickLine={false} axisLine={false} hide={true} tickFormatter={(value) => `${parseFloat(value).toFixed(2)}%`} />
                                <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    active={activeIndex !== null}
                                    cursor={{ fill: "rgba(124,58,237,0.1)" }}
                                    trigger="click"
                                    wrapperStyle={{ pointerEvents: "auto" }}
                                    formatter={(value, name, props) => {
                                        const { amount, description } = props.payload;
                                        return [
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800 pb-2">{parseFloat(value).toFixed(2)}% (₹{formatter.format(amount)})</div>
                                                <div className="bg-white shadow-xl rounded-xl border border-gray-200 p-2 w-72 max-h-50 overflow-y-auto">
                                                    {description && Object.entries(description).map(([key, value]) => (
                                                        <div key={key} style={{ marginTop: "6px", fontSize: "12px", color: "#6b7280" }}>{key}: {value}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        ];
                                    }}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                    }}
                                />
                                <Bar
                                    dataKey="value" 
                                    name="Contribution"
                                    radius={[0, 4, 4, 0]} 
                                    barSize={20} 
                                    label={{ position: 'right', formatter: (value) => `${parseFloat(value).toFixed(2)}%` }}
                                    onClick={(data, index) => {
                                        if (activeIndex === index) setActiveIndex(null);
                                        else setActiveIndex(index);
                                    }}
                                >
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

export default Yearly;