import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"

function Lander(){
    return (
        <div className="pb-40 px-4 pt-35">
            <div className="container mx-auto text-center">
                <h1 className="text-5xl md:text-8xl lg:[105px] pb-6 text-[#43B0AF]">
                    Pilot your Penny <br /> powered by AI
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    PennyPilot is your Personal AI Co-Pilot for Smart Money Management 
                    - Track, Plan, and Grow your Finances Effortlessly.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link to="/dashboard">
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>
                    <Link to="https://www.youtube.com/watch?v=8rx6IKbmPhA">
                        <Button size="lg" variant="outline" className="px-8">Watch Demo</Button>
                    </Link>
                </div>
                <div>
                    <div>
                        <img className="rounded-lg shadow-2xl border mx-auto" src="Home/Landing Page.png" width={1280} height={720} alt="Landing page" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lander;