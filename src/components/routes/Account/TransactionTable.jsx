import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "../../../lib/category.jsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

function TransactionTable({ transactions }){
    
    const [filteredTransactions, setFilterTransactions] = useState(undefined);

    useEffect(() => {
        setFilterTransactions(transactions);
    }, []);

    const handleSort = () => {

    };

    return (
        <div>
            <div className="space-y-4 px-5">
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"><Checkbox /></TableHead>
                                <TableHead className="cursor-pointer" onClick={()=>handleSort("date")}>
                                    <div className="flex items-center">Date</div>
                                </TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="cursor-pointer" onClick={()=>handleSort("category")}>
                                    <div className="flex items-center">Category</div>
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={()=>handleSort("amount")}>
                                    <div className="flex items-center justify-end">Amount</div>
                                </TableHead>
                                <TableHead>Recurring</TableHead>
                                <TableHead className="w-[50px]" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(filteredTransactions == undefined) ? (   
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">No Transactions Found</TableCell>
                                </TableRow>) : (
                                filteredTransactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell><Checkbox /></TableCell>
                                        <TableCell>{format(new Date(transaction.date), "PP")}</TableCell>
                                        <TableCell>{transaction.description}</TableCell>
                                        <TableCell className="capitalize ">
                                            <span 
                                                style={{background : categoryColors[transaction.category]}}
                                                className="px-2 py-1 rounded text-white text-sm">
                                                {transaction.category}
                                            </span>
                                        </TableCell>
                                        <TableCell 
                                            className="text-right font-medium" 
                                            style={{color: transaction.type === "expense" ? "red" : "green"}}>
                                            {transaction.type === "expense" ? "-" : "+"}
                                            ₹{parseFloat(transaction.amount).toFixed(2)}
                                        </TableCell>
                                        <TableCell>{!transaction.isRecurring ? (
                                            <div>
                                                <Tooltip>
                                                    <TooltipTrigger>Hover</TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Add to library</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>) : (
                                            <div>
                                                <Badge variant="outline" className="gap-1">
                                                    <Clock className="h-3 w-3"/>
                                                    One-Time
                                                </Badge>
                                            </div>)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default TransactionTable;