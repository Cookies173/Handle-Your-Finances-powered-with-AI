import React from "react";
import {SignUp} from "@clerk/clerk-react";

function Register(){
    return (
        <div className="flex justify-center pt-40">
            <SignUp signUpForceRedirectUrl="/dashboard" />
        </div>
    );
}

export default Register;