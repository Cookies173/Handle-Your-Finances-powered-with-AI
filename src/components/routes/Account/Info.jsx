import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PenBox } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { accountNameSchema } from "../../../lib/schema.js";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";

function Info({ account, transactions }){

    const [open, setOpen] = useState(false);
    const [currName, setCurrName] = useState(account.name);

    const { register, handleSubmit, formState:{errors} } = useForm({
        resolver:zodResolver(accountNameSchema),
        defaultValues:{
            name: currName,
        },
    });

    const { getToken } = useAuth();

    const onSubmit = async (data) => {
        try{
            const token = await getToken();
            const res = await axios.post("https://penny-pilot-server.vercel.app/acnt/edt", {name: data.name, accountId: account.id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success("Account name edited successfully");
            setCurrName(data.name);
            setOpen(false);
        }
        catch(err){
            toast.error(err.message || "Failed to edit Account name");
            console.error("Failed to edit account name:", err);
        }
    };

    return (
        <div>
            <div className="space-y-8 px-5 flex gap-4 items-end justify-between pt-20">
                <div>
                    <div className="flex">
                        <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">{currName}</h1>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button className="mt-4" variant="ghost" size="lg"><PenBox size={18} /></Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-sm">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <DialogHeader>
                                    <DialogTitle className="pb-4">Edit Account Name</DialogTitle>
                                </DialogHeader>
                                <FieldGroup className="pb-4">
                                    <Field>
                                    <Input id="name" {...register("name")} />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name.message}</p>
                                    )}
                                    </Field>
                                </FieldGroup>
                                <DialogFooter>
                                    <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <p className="text-muted-foreground">{account.type} Account</p>
                </div>
                <div className="text-right pb-2">
                    <div className="text-xl sm:text-2xl font-bold">₹{parseFloat(account.balance).toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground">{transactions.length} Transactions</p>
                </div>
            </div>
        </div>
    );
}

export default Info;