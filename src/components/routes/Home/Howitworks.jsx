import React from "react";
import { howItWorksData } from "./data.jsx";

function Howitworks(){
    return(
        <div className="py-20 bg-[#ecf4f1]">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {howItWorksData.map((work, index) => (
                        <div key={index} className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">{work.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                            <p className="text-gray-800">{work.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Howitworks;