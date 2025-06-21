import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

function Profile(){

    const {user, isLoaded} = useUser();
    const { getToken } = useAuth();

    useEffect(() => {
        const syncUser = async () => {
            if(isLoaded && user){
                try{
                    const token = await getToken();
                    const res = await axios.post("https://penny-pilot-server.vercel.app/auth/user", null,{
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log("User synced:", res.data);
                }
                catch(err){
                    console.error("Failed to sync user:", err);
                }
            }
        }; 
        syncUser();
    }, [isLoaded, user, getToken]);

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