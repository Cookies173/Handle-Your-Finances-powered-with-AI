import React from "react";
import { statsData } from "./data.jsx";

function Stats(){
    return(
        <div className="py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {statsData.map((statsData, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl font-bold text-[#162ab0] mb-2">{statsData.value}</div>
                            <div className="text-gray-800">{statsData.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Stats;