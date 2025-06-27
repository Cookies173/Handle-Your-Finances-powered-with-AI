import React from "react";
import { featuresData } from "../../../lib/data.jsx";
import { Card, CardContent } from "@/components/ui/card"

function Features(){
    return(
        <div className="pb-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">Everything you need to Manage your Finances</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresData.map((feature, index) => (
                        <Card key={index} className="p-6">
                            <CardContent className="pt-2 space-y-2">
                                {feature.icon}
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                                <p className="text-gray-800">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Features;