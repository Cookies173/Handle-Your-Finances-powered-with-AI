import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes(){
    const {isSignedIn, isLoaded} = useAuth();
    if(!isLoaded) return null;
    if(!isSignedIn){
        return <Navigate to="/login" />;
    }
    return <Outlet />;
}

export default ProtectedRoutes;