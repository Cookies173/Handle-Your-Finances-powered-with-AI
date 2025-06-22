import React from "react";
import Header from "../Header/Header.jsx";
import Lander from "./Lander.jsx";
import Features from "./Features.jsx";
import Howitworks from "./Howitworks.jsx";
import Stats from "./Stats.jsx";
import Testimonials from "./Testimonials.jsx";
import Action from "./Action.jsx";
import Footer from "../Header/Footer.jsx";

function Home(){
    return (
        <div>
            <Header />
            <Lander />
            <Features />
            <Howitworks />
            <Stats />
            <Testimonials />
            <Action />
            <Footer />
        </div>
    );
}

export default Home;