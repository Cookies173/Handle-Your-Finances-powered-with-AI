import React from "react";
import {SignIn} from "@clerk/clerk-react";

function Login(){
    return (
        <div className="flex justify-center pt-40">
            <SignIn signInForceRedirectUrl="/dashboard" />
        </div>
    );
}

export default Login;