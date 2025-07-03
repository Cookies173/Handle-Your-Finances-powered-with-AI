import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

function ReceiptScanner({ onScanComplete }){

    const [tdata, setTdata] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);

    const fileInputRef = useRef();

    const { getToken } = useAuth();

    useEffect(() => {
        if(tdata && !loading){
            onScanComplete(tdata);
            toast.success("Receipt Scanned Successfully");
        }
    }, [loading, tdata]);

    useEffect(() => {
        if(error){
            toast.error(error || "Failed to scan Receipt");
        }
    }, [error]);

    const handleReceiptScan = async (file) => {

        if(file.size > 5*1024*1024){
            toast.error("File size should be less than 5MB");
            return;
        }

        setLoading(true);
        setError(null);
        try{
            const token = await getToken();

            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post("https://penny-pilot-server.vercel.app/tran/api", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(res);
            setTdata(res.data);
            setError(null);
        }
        catch(err){
            setError(err.response.data.error);
        }
        finally{
            setLoading(false);
        }
    };

    return (
        <div>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                capture="environment"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if(file) handleReceiptScan(file)
                }}
            />
            <Button 
                type="button"
                variant="outline"
                className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 
                animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
            >{loading ? (
                <div className="flex items-center">
                    <Loader2 className="mr-2 animate-spin" />
                    <span>Scanning Receipt... </span>
                </div>
            ) : (
                <div className="flex items-center">
                    <Camera className="mr-2" />
                    <span>Scan Receipt with AI</span>
                </div>
            )}</Button>
        </div>
    );
}

export default ReceiptScanner;