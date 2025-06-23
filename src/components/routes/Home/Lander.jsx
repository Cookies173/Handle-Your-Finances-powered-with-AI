import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"

function Lander(){

    const imageRef = useRef();
    useEffect(() => {
        const imageElement = imageRef.current;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 300;

            if(scrollPosition > scrollThreshold) imageElement.classList.add("scrolled");
            else imageElement.classList.remove("scrolled");
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="pb-40 px-4 pt-35">
            <div className="container mx-auto text-center">
                <h1 className="text-5xl md:text-8xl lg:[105px] pb-6 gradient-title">
                    Pilot your Penny <br /> powered by AI
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    PennyPilot is your Personal AI Co-Pilot for Smart Money Management<br /> 
                    Track, Plan, and Grow your Finances Effortlessly.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link to="/dashboard">
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>
                    <Link to="https://www.youtube.com/watch?v=JgDNFQ2RaLQ" target="_blank">
                        <Button size="lg" variant="outline" className="px-8">Watch Demo</Button>
                    </Link>
                </div>
                <div className="hero-image-wrapper">
                    <div ref={imageRef} className="hero-image">
                        <img className="rounded-lg shadow-2xl border mx-auto" src="Home/Landing Page.png" width={1280} height={720} alt="Landing page" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lander;