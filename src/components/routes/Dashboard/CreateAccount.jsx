import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { accountSchema } from "../../../lib/schema.js";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

function CreateAccount({ open, setOpen, triggerButton, onRefresh }){
    // const [open, setOpen] = useState(false);
    const [tdata, setTdata] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const { register, handleSubmit, formState:{errors}, setValue, watch, reset } = useForm({
        resolver:zodResolver(accountSchema),
        defaultValues:{
            name: "",
            type: "Current",
            balance: "",
            isDefault: false,
        },
    });

    useEffect(() => {
        if(tdata && !loading){
            toast.success("Account Created successfully");
            reset();
            setOpen(false);
        }
    }, [loading, tdata]);

    useEffect(() => {
        if(error){
            toast.error(error.message || "Failed to create Account");
        }
    }, [error]);

    const { getToken } = useAuth();

    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        try{
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/dash/new", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTdata(res);
            setError(null);
            if(onRefresh) onRefresh();
        }
        catch(err){
            console.error("Failed to create account:", err);
            setError(err);
            toast.error(err.message);
        }
        finally{
            setLoading(false);
        }
    };

    return(
        <div>
            <Drawer open={open} onOpenChange={setOpen}>
                {triggerButton && (
                    <DrawerTrigger asChild>
                        <Card className="h-48 hover:shadow-md transition-shadow cursor-pointer border-dashed">
                            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                                <Plus className="h-10 w-10 mb-2"/>
                                <p className="text-sm font-medium">Add New Account</p>
                            </CardContent>
                        </Card>
                    </DrawerTrigger>
                )}
                <DrawerContent aria-describedby={undefined}>
                    <DrawerHeader>
                        <DrawerTitle>Create New Account</DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Account Name</label>
                                <Input id="name" placeholder="e.g., Penny Pilot" {...register("name")} />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="type" className="text-sm font-medium">Account Type</label>
                                <Select onValueChange={(value) => setValue("type", value)} defaultValues={watch("type")}>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Current">Current</SelectItem>
                                        <SelectItem value="Saving">Saving</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.type && (
                                    <p className="text-sm text-red-500">{errors.type.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="balance" className="text-sm font-medium">Initial Balance</label>
                                <Input id="balance" type="number" step="0.01" placeholder="0.00" {...register("balance")} />
                                {errors.balance && (
                                    <p className="text-sm text-red-500">{errors.balance.message}</p>
                                )}
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">Set as Default</label>
                                    <p className="text-sm text-muted-foreground">This account will be selected by default for transactions.</p>
                                </div>
                                <Switch id="isDefault" onCheckedChange={(checked) => setValue("isDefault", checked)} checked={watch("isDefault")} />
                            </div>
                            
                            <div className="flex gap-4 pb-10">
                                <DrawerClose asChild>
                                    <Button type="button" variant="outline" className="flex-1">Cancel</Button>
                                </DrawerClose>
                                <Button type="submit" className="flex-1" disabled={loading}>
                                    {(loading) ? (
                                    <div className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <p>Creating....</p>
                                    </div>) : (
                                        <p>Create Account</p>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

export default CreateAccount;