import React from "react";
import Profile from "./Profile.jsx";
import { SignedIn } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChartPie, LayoutDashboard, PenBox } from "lucide-react";

function Header(){
    return (
        <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
            <nav className="container flex items-center mx-auto px-4 py-4 justify-between">
                <Link to="/">
                    <img className="size-11 w-auto opacity-100 object-contain" src="/Header/pilot-svgrepo-com.png" alt="PennyPilot Logo" />
                </Link>
                <div className="flex items-center space-x-4">
                    <SignedIn>
                        <Link to="/analytics" className="text-gray-600 hover:text-blue-800 flex items-center gap-2">
                            <Button variant="outline">
                                <ChartPie size={18} /><span className="hidden md:inline">Analytics</span>
                            </Button>
                        </Link>
                    </SignedIn>
                    <SignedIn>
                        <Link to="/dashboard" className="text-gray-600 hover:text-blue-800 flex items-center gap-2">
                            <Button variant="outline">
                                <LayoutDashboard size={18} /><span className="hidden md:inline">Dashboard</span>
                            </Button>
                        </Link>
                    </SignedIn>
                    <SignedIn>
                        <Link to="/transaction/create" className="flex items-center gap-2">
                            <Button>
                                <PenBox size={18} /><span className="hidden md:inline">Add Transaction</span>
                            </Button>
                        </Link>
                    </SignedIn>
                    <Profile />
                </div>
            </nav>
        </div>
    );
}

export default Header;