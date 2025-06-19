import React from "react";
import Header from "../Header/Header.jsx";
import Lander from "./Lander.jsx";

function Home(){
    return (
        <div>
            <Header />
            <Lander />
            <h1 className="text-3xl font-bold underline my-25">
                Hello world!
            </h1>
            <main className="min-h-screen"> </main>
            <footer className="bg-gray-300 py-10">
                <div className="container mx-auto px-125 text-center text-black">
                <p>© Cookies173</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;