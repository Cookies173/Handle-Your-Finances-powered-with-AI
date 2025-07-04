import React from "react";
import Header from "../Header/Header.jsx";
import Footer from "../Header/Footer.jsx";
import AddTForm from "./AddTForm.jsx";
import { Toaster } from "@/components/ui/sonner";

function AddTransaction(){
    return (
        <div>
            <Header />
            <AddTForm />
            <Toaster richColors/>
            <Footer />
        </div>
    );
}

export default AddTransaction;