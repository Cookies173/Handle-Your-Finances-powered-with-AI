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
                <UserButton />
            </SignedIn>
        </div>
    );
}

export default Profile;