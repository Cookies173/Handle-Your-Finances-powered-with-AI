import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Profile(){
    return (
        <div>
            <SignedOut>
                <Link to="/login">
                    <Button variant="outline">Log in</Button>
                </Link>
            </SignedOut>
            <SignedIn>
                <UserButton appearance={{
                    elements:{
                        avatarBox : "w-24 h-24",
                    },
                }} />
            </SignedIn>
        </div>
    );
}

export default Profile;