import React from "react";
import Header from "../Header/Header.jsx";
import Footer from "../Header/Footer.jsx";
import AddTForm from "./AddTForm.jsx";

function AddTransaction(){
    return (
        <div>
            <Header />
            <div className="max-w-3xl mx-auto px-5 pt-20">
                <h1 className="text-5xl gradient-title">Add Transaction</h1>
                <AddTForm />
            </div>
            <Footer />
        </div>
    );
}

export default AddTransaction;