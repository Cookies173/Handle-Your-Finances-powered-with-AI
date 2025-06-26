import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function PageNotFound(){
    return(
        <div>
            <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
                <h1 className="text-6xl font-bold gradient-title mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-gray-800 mb-8">Oops! The page you're looking for doesn't exist or has been moved.</p>
                <Link to="/">
                    <Button>Return Home</Button>
                </Link>
            </div>
        </div>
    );
}   

export default PageNotFound;