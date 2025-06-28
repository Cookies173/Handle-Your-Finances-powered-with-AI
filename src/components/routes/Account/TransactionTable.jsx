import React, { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "../../../lib/category.jsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RECURRING_INTERVALS = {
    daily:"Daily",
    weekly:"Weekly",
    monthly:"Monthly",
    yearly:"Yearly",
};

function TransactionTable({ transactions }){
    
    // const [filteredSortedTransactions, setFilterSortedTransactions] = useState(undefined);
    const [selectTransactions, setSelectTransactions] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        field : "date",
        direction : "desc",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");

    const filteredSortedTransactions = useMemo(() => {
        let result = [...transactions];

        return result;
    }, [transactions, sortConfig, searchTerm, typeFilter, recurringFilter]);

    // useEffect(() => {
    //     setFilterSortedTransactions(transactions);
    // }, []);

    const handleSort = (field) => {
        setSortConfig(current => ({
            field,
            direction : current.field == field && current.direction === "asc" ? "desc" : "asc", 
        }));
    };

    const handleSelect = (id) => {
        setSelectTransactions((current) => current.includes(id) 
            ? current.filter(item => item!=id) 
            : [...current, id]
        );
    };

    const handleSelectAll = () => {
        setSelectTransactions((current) => current.length === filteredSortedTransactions.length
            ? []
            : filteredSortedTransactions.map((t) => t.id)
        );
    };

    const handleBulkDelete = () => {

    };

    const handleClearFilter = () => {
        setSearchTerm("");
        setTypeFilter("");
        setRecurringFilter("");
        setSelectTransactions([]);
    };

    const handleEdit = () => {

    };

    const handleDelete = () => {

    };

    return (
        <div>
            <div className="space-y-4 px-5">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            className="pl-8"
                            placeholder="Search Transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={recurringFilter} onValueChange={(value) => setRecurringFilter(value)}>
                            <SelectTrigger className="width-[140px]">
                                <SelectValue placeholder="All Transactions" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recurring">Recurring Only</SelectItem>
                                <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
                            </SelectContent>
                        </Select>

                        {selectTransactions.length>0 && (
                            <div className="flex items-center gap-2">
                                <Button variant="destructive" size="sm" onClick={() => handleBulkDelete()}>
                                    <Trash className="h-4 w-4" />
                                    Delete Selected ({selectTransactions.length})
                                </Button>
                            </div>
                        )}

                        {(searchTerm || typeFilter || recurringFilter) && (
                            <div>
                                <Button variant="outline" size="icon" onClick={() => handleClearFilter()} title="Clear Filters">
                                    <X className="h-4 w-5" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]">
                                    <Checkbox 
                                        onCheckedChange={() => handleSelectAll()}
                                        checked={(filteredSortedTransactions!=undefined) && (selectTransactions.length === filteredSortedTransactions.length)} />
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={()=>handleSort("date")}>
                                    <div className="flex items-center">
                                        Date
                                        {sortConfig.field === "date" && (
                                            sortConfig.direction === "asc" ? (
                                                <ChevronUp className="ml-1 h-4 w-4" />
                                            ) : ( <ChevronDown className="ml-1 h-4 w-4" />)
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="cursor-pointer" onClick={()=>handleSort("category")}>
                                    <div className="flex items-center">
                                        Category
                                        {sortConfig.field === "category" && (
                                            sortConfig.direction === "asc" ? (
                                                <ChevronUp className="ml-1 h-4 w-4" />
                                            ) : ( <ChevronDown className="ml-1 h-4 w-4" />)
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={()=>handleSort("amount")}>
                                    <div className="flex items-center justify-end">
                                        Amount
                                        {sortConfig.field === "amount" && (
                                            sortConfig.direction === "asc" ? (
                                                <ChevronUp className="ml-1 h-4 w-4" />
                                            ) : ( <ChevronDown className="ml-1 h-4 w-4" />)
                                        )}
                                    </div>
                                </TableHead>
                                <TableHead>Recurring</TableHead>
                                <TableHead className="w-[50px]" />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(filteredSortedTransactions == undefined) ? (   
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">No Transactions Found</TableCell>
                                </TableRow>) : (
                                filteredSortedTransactions.map((transaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>
                                            <Checkbox 
                                                onCheckedChange={() => handleSelect(transaction.id)} 
                                                checked={selectTransactions.includes(transaction.id)}/>
                                        </TableCell>
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
                                        <TableCell>{transaction.isrecurring ? (
                                            <div>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                                                            <RefreshCw className="h-3 w-3"/>
                                                            {RECURRING_INTERVALS[transaction.recurringinterval]}
                                                        </Badge>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <div className="text-sm">
                                                            <div className="font-medium">Next Date:</div>
                                                            <div>{format(new Date(transaction.nextrecurringdate), "PP")}</div>
                                                        </div>
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
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuLabel onClick={()=>handleEdit()}>Edit</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={()=>handleDelete([transaction.id])} className="text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
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