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
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const RECURRING_INTERVALS = {
    daily:"Daily",
    weekly:"Weekly",
    monthly:"Monthly",
    yearly:"Yearly",
};

function TransactionTable({ transactions, onRefresh }){
    
    const [localTransactions, setLocalTransactions] = useState(transactions);
    const [selectTransactions, setSelectTransactions] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        field : "date",
        direction : "desc",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [recurringFilter, setRecurringFilter] = useState("");
    const [tdata, setTdata] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(undefined);
    const [currPageTransactions, setCurrPageTransactions] = useState([]);

    const entriesPerPage = 20;

    useEffect(() => {
        setLocalTransactions(transactions);
    }, [transactions]);

    const filteredSortedTransactions = useMemo(() => {
        let result = [...localTransactions];

        // Filters
        if(searchTerm){
            const searchLower = searchTerm.toLowerCase();
            result = result.filter((transaction) => transaction.description?.toLowerCase().includes(searchLower));
        }

        if(recurringFilter){
            result = result.filter((transaction) => {
                if(recurringFilter === "recurring") return transaction.isrecurring;
                else return !transaction.isrecurring;
            });
        }

        if(typeFilter){
            result = result.filter((transaction) => transaction.type === typeFilter);
        }

        // Sorting
        result.sort((a, b) => {
            let comparison=0;

            switch(sortConfig.field){
                case "date":
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case "amount":
                    comparison = a.amount - b.amount;
                    break;
                case "category":
                    comparison = (a.category || "").localeCompare(b.category || "");
                    break;
                default:
                    comparison = 0;
            };

            return (sortConfig.direction === "asc" ? comparison : -comparison);
        });

        return result;
    }, [localTransactions, sortConfig, searchTerm, typeFilter, recurringFilter]);

    useEffect(() => {
        setTotalPages(Math.max(1, Math.ceil(filteredSortedTransactions.length/entriesPerPage)));
        setCurrPageTransactions(filteredSortedTransactions.slice((page-1)*entriesPerPage, page*entriesPerPage));
    }, [filteredSortedTransactions, page]);

    useEffect(() => {
        if(tdata && !loading){
            setTimeout(() => {
                toast.success("Transactions Deleted Successfully");
            }, 1000);
        }
    }, [loading, tdata]);

    useEffect(() => {
        if(error){
            toast.error(error.message || "Failed to Delete Transactions");
        }
    }, [error]);

    const { getToken } = useAuth();


    const bulkDeleteTransactions = async () => {
        setLoading(true);
        setError(null);
        try{
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/acnt/bdl", 
                {transactionIds : selectTransactions}, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setTdata(res);
            setError(null);
            if(onRefresh) onRefresh();
        }
        catch(err){
            console.error("Failed to bulk delete transactions:", err.message);
            setError(err);
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    };

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
        setSelectTransactions((current) => current.length === currPageTransactions.length
            ? []
            : currPageTransactions.map((t) => t.id)
        );
    };

    const handleBulkDelete = () => {
        if(!window.confirm(`Are you sure you want to delete ${selectTransactions.length} transactions`)) return;
        bulkDeleteTransactions();
        const deletedIds = new Set(selectTransactions);
        setLocalTransactions(prev => prev.filter(t => !deletedIds.has(t.id)));
        setSelectTransactions([]);
    };

    const handleClearFilter = () => {
        setSearchTerm("");
        setTypeFilter("");
        setRecurringFilter("");
        setSelectTransactions([]);
    };

    const handleEdit = () => {

    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/acnt/bdl", { transactionIds: id },{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTdata(res);
            setError(null);
            setLocalTransactions(prev => prev.filter(t => !id.includes(t.id)));
            if(onRefresh) onRefresh();

        }
        catch(err){
            console.error("Delete failed:", err.message);
            setError(err);
            toast.error("Failed to delete transaction");
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="space-y-4 px-5 pt-5">
                {loading && (<BarLoader className="mt-4" width={"100%"} color="#446B5C" />)}
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
                                        checked={(currPageTransactions.length>0) && (selectTransactions.length === currPageTransactions.length)} />
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
                            {(currPageTransactions.length === 0) ? (   
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">No Transactions Found</TableCell>
                                </TableRow>) : (
                                currPageTransactions.map((transaction) => (
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
                                                    <DropdownMenuItem onClick={()=>handleEdit()}>Edit</DropdownMenuItem>
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

                <div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" onClick={() => setPage((p) => Math.max(1, p-1))} />
                            </PaginationItem>
                            {(totalPages!=undefined) && [...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink href="#" isActive={page === i+1} onClick={() => setPage(i+1)} >{i+1}</PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext href="#" onClick={() => setPage((p) => Math.min(totalPages, p+1))} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}

export default TransactionTable;