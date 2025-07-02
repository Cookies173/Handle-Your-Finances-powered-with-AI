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
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function AddTForm(){

    const [accounts, setAccounts] = useState(undefined);
    const [tdata, setTdata] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

    const { register, setValue, handleSubmit, formState:{errors}, watch, getValues, reset } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues:{
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
    
    const categories = defaultCategories;
    const filteredCategories = categories.filter((category) => category.type === type);

    const navigate = useNavigate();

    const { getToken } = useAuth();

    useEffect(() => {
        getAccounts();
    }, []);

    const getAccounts = async () => {
        try{
            const token = await getToken();
            const res = await axios.get("https://penny-pilot-server.vercel.app/tran/acc", {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setAccounts(res.data.accounts);
            const defaultId = (res.data.accounts).find((acc) => acc.isdefault)?.id;
            const defaultIdString = String(defaultId);
            if(defaultIdString){
                reset((prev) => ({
                    ...prev,
                    accountId: defaultIdString,
                }));
            }
        }
        catch(err){
            console.error("Failed to fetch accounts:", err.message);
        }
    };

    useEffect(() => {
        if(tdata && !loading){
            toast.success("Transaction Added Successfully");
            reset();
        }
    }, [loading, tdata]);

    useEffect(() => {
        if(error){
            toast.error(error.message || "Failed to add Transaction");
        }
    }, [error]);

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try{
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/tran/crt", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTdata(res);
            setError(null);
            // if(onRefresh) onRefresh();
        }
        catch(err){
            console.error("Failed to add transaction:", err);
            setError(err);
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div>
            <CreateAccount open={createDrawerOpen} setOpen={setCreateDrawerOpen} triggerButton={false} onRefresh={getAccounts} />
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select onValueChange={(value) => setValue("type", value)} defaultValues={type}>
                        <SelectTrigger className="w-[725px]">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="expense">Expense</SelectItem>
                            <SelectItem value="income">Income</SelectItem>
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
                            onValueChange={(value) => {
                                if(value === "__create__"){
                                    setCreateDrawerOpen(true);
                                    return;
                                }
                                setValue("accountId", value);
                            }}
                            // defaultValues={getValues("accountId")} // Notworking rn
                            defaultValues={accountId}
                        >
                            <SelectTrigger className="w-[350px]">
                                <SelectValue 
                                    placeholder="Select Account"
                                    children={
                                        accounts?.find(acc => acc.id == accountId)?.name 
                                        ? `${accounts.find(acc => acc.id == accountId)?.name}` 
                                        : "Select Account"
                                    } 
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {accounts && accounts.map((acc) => (
                                    <SelectItem key={acc.id} value={acc.id}>
                                        {acc.name} ₹{parseFloat(acc.balance).toFixed(2)}
                                    </SelectItem>
                                ))}
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
                        onValueChange={(value) => setValue("category", value)} defaultValues={getValues("category")}>
                        <SelectTrigger className="w-[725px]">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredCategories && filteredCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
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
                            onValueChange={(value) => setValue("recurringInterval", value)} defaultValues={getValues("recurringInterval")}>
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
                    <Button type="submit" className="w-[355px]" disabled={loading}>Create Transaction</Button>
                </div>
            </form>
        </div>
    );
}

export default AddTForm;