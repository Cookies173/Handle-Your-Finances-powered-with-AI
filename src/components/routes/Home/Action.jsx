import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"

function Action(){
    return(
        <div className="py-20 bg-[#294933]">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to take Control of your Finances?</h2>
                <p className="text-white mb-8 max-w-2xl mx-auto">Joint thousands of users who are already managing their finances smarter with PennyPilot</p>
                <Link to="/dashboard">
                    <Button size="lg" className="bg-white text-[#294933] hover:bg-[#ecf4f1] animate-bounce">Start Free Trial</Button>
                </Link>
            </div>
        </div>
    );
}

export default Action;