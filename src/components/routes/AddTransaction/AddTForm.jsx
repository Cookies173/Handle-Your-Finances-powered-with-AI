import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { transactionSchema } from "../../../lib/schema";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import CreateAccount from "../Dashboard/CreateAccount.jsx";
import { Button } from "@/components/ui/button";
import { defaultCategories } from "../../../lib/category.jsx";
import {Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ReceiptScanner from "./ReceiptScanner.jsx";
import { useSearchParams } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

function AddTForm(){

    const [accounts, setAccounts] = useState(undefined);
    const [tdata, setTdata] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [initialData, setInitialData] = useState(undefined);

    const [searchParams] = useSearchParams();
    const transactionId = searchParams.get("id");

    useEffect(() => {
        getAccounts();
    }, []);

    useEffect(() => {
        if(transactionId){
            getTransaction();
            setEditMode(true);
        }
    }, [transactionId]);

    const getTransaction = async () => {
        try{
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/tran/gtt", {transactionId : transactionId}, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setInitialData(res.data.transaction);
        }
        catch(err){
            console.error("Failed to get transaction:", err.message);
        }
    };

    useEffect(() => {
        if(initialData && accounts){
            reset({
                type: initialData.type,
                amount: initialData.amount.toString(),
                description: initialData.description,
                accountId: initialData.accountid.toString(),
                category: initialData.category,
                date: new Date(initialData.date),
                isRecurring: initialData.isrecurring,
                ...(initialData.recurringinterval && {
                    recurringInterval: initialData.recurringinterval
                }),
            });
        }
    }, [initialData, accounts]);

    const { register, setValue, handleSubmit, formState:{errors}, watch, getValues, reset } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: "expense",
            amount: "",
            description: "",
            accountId: "",
            date: new Date(),
            isRecurring: false,
        }
    });

    const type = watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");
    const accountId = watch("accountId");
    const category = watch("category");
    const recurringInterval = watch("recurringInterval");
    
    const categories = defaultCategories;
    const filteredCategories = categories.filter((category) => category.type === type);

    const navigate = useNavigate();

    const { getToken } = useAuth();

    const getAccounts = async () => {
        try{
            const token = await getToken();
            const res = await axios.get("https://penny-pilot-server.vercel.app/tran/acc", {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setAccounts(res.data.accounts);
        }
        catch(err){
            console.error("Failed to fetch accounts:", err.message);
        }
    };

    useEffect(() => {
        if(accounts && !transactionId){
            const defaultAcc = accounts.find(acc => acc.isdefault);
            if(defaultAcc){
                setValue("accountId", String(defaultAcc.id));
            }
        }
    }, [accounts]);

    useEffect(() => {
        if(tdata && !loading){
            if(editMode) toast.success("Transaction Updated Successfully");
            else toast.success("Transaction Added Successfully");
            reset();
        }
    }, [loading, tdata, editMode]);

    useEffect(() => {
        if(error){
            toast.error(error.message || "Failed to add Transaction");
        }
    }, [error]);

    const addTransaction = async(data) => {
        setLoading(true);
        setError(null);
        try{
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/tran/crt", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(res.status === 200 && res.data.success){
                setTdata(res);
                setError(null);
                getAccounts();
            }
        }
        catch(err){
            const message = err?.response?.data?.error || "Failed to add transaction";
            toast.error(message);
        }
        finally{
            setLoading(false);
        }
    };

    const updateTransaction = async(data) => {
        setLoading(true);
        setError(null);
        try{
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/tran/udt", {
                    ...data,
                    transactionId: transactionId,
                }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if(res.status === 200 && res.data.success){
                setTdata(res);
                setError(null);
                navigate(-1);
            }
        }
        catch(err){
            const message = err?.response?.data?.error || "Failed to update transaction";
            toast.error(message);
        }
        finally{
            setLoading(false);
        }
    };

    const onSubmit = (data) => {
        if(editMode){
            updateTransaction(data);
        }
        else{
            addTransaction(data);
        }
    };

    const handleSubmitComplete = (scannedData) => {
        if(scannedData){
            setValue("amount", scannedData.amount.toString());
            setValue("date", new Date(scannedData.date));
            if(scannedData.description) setValue("description", scannedData.description);
            if(scannedData.category) setValue("category", scannedData.category);
        }
    };

    return (
        <div>
            <div className="max-w-3xl mx-auto px-5 pt-20">
                <h1 className="text-5xl gradient-title">{editMode ? "Edit" : "Add"} Transaction</h1>
                <CreateAccount open={createDrawerOpen} setOpen={setCreateDrawerOpen} triggerButton={false} onRefresh={getAccounts} />
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {(!editMode) && <ReceiptScanner onScanComplete={handleSubmitComplete} />}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select onValueChange={(value) => setValue("type", value)} value={type ?? ""}>
                            <SelectTrigger className="w-[725px]">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="expense">Expense</SelectItem>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="invested">Saving & Investment</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.type && (
                            <p className="text-sm text-red-500">{errors.type.message}</p>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount</label>
                            <Input type="number" step="0.01" placeholder="0.00" {...register("amount")} />
                            {errors.amount && (
                                <p className="text-sm text-red-500">{errors.amount.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Account</label>
                            <Select 
                                value={accountId ?? ""}
                                onValueChange={(value) => {
                                    if(value === "__create__"){
                                        setCreateDrawerOpen(true);
                                        return;
                                    }
                                    setValue("accountId", value);
                                }}
                            >
                                <SelectTrigger className="w-[350px]">
                                    <SelectValue 
                                        placeholder="Select Account"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts ? (accounts.map((acc) => (
                                        <SelectItem key={acc.id} value={acc.id.toString()}>
                                            {acc.name} ₹{parseFloat(acc.balance).toFixed(2)}
                                        </SelectItem>
                                    ))) : (
                                        <div className="flex items-center">
                                            <Loader2 className="mr-2 animate-spin" />
                                        </div>
                                    )}
                                    <SelectItem value="__create__" className="items-center text-sm font-semibold text-blue-500">
                                        Create Account
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.accountId && (
                                <p className="text-sm text-red-500">{errors.accountId.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select 
                            onValueChange={(value) => setValue("category", value)}
                            value={category ?? ""}
                        >
                            <SelectTrigger className="w-[725px]">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredCategories && filteredCategories.map((category) => (
                                    <HoverCard key={category.id} openDelay={100} closeDelay={100}>
                                        <HoverCardTrigger asChild>
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        </HoverCardTrigger>
                                        <HoverCardContent side="right">
                                            <div className="flex flex-col gap-1">
                                                <h4>{category.description}</h4>
                                                {category.subcategories?.map((sc) => (
                                                    <div key={sc} className="text-muted-foreground text-sm">- {sc}</div>
                                                ))}
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="text-sm text-red-500">{errors.category.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full pl-3 text-left font-normal">
                                    {date ? format(date, "PPP") : <span>Pick a Date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={(date) => setValue("date", date)}
                                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {errors.date && (
                            <p className="text-sm text-red-500">{errors.date.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input placeholder="Enter Description" {...register("description")} />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                            <label className="text-sm font-medium cursor-pointer">Recurring Transaction</label>
                            <p className="text-sm text-muted-foreground">Set up a recurring schedule for this transaction</p>
                        </div>
                        <Switch onCheckedChange={(checked) => setValue("isRecurring", checked)} checked={isRecurring} />
                    </div>

                    {isRecurring && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Recurring Interval</label>
                            <Select 
                                onValueChange={(value) => setValue("recurringInterval", value)}
                                value={recurringInterval ?? ""}
                            >
                                <SelectTrigger className="w-[725px]">
                                    <SelectValue placeholder="Select Interval" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.recurringInterval && (
                                <p className="text-sm text-red-500">{errors.recurringInterval.message}</p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4 pb-20">
                        <Button type="button" variant="outline" className="w-[355px]" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button type="submit" className="w-[355px]" disabled={loading}>
                            {loading ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : editMode ? "Update Transaction" : "Create Transaction"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTForm;