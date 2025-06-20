import React from "react";
import Header from "../Header/Header.jsx";
import Lander from "./Lander.jsx";
import Features from "./Features.jsx";
import Howitworks from "./Howitworks.jsx";
import Stats from "./Stats.jsx";

function Home(){
    return (
        <div>
            <Header />
            <Lander />
            <Features />
            <Howitworks />
            <Stats />

            <footer className="bg-gray-300 py-10">
                <div className="container mx-auto px-125 text-center text-black">
                <p>© Cookies173</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;