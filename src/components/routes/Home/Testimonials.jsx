import React from "react";
import { testimonialsData } from "./data.jsx";
import { Card, CardContent } from "@/components/ui/card"

function Testimonials(){
    return(
        <div className="pb-20">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">What our Users Say</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonialsData.map((testimonial, index) => (
                        <Card key={index} className="p-6">
                            <CardContent className="pt-2 space-y-2">
                                <div className="flex items-center mb-4">
                                    <img className="rounded-full" src={testimonial.image} alt={testimonial.name} width={40} height={40} />
                                    <div className="ml-4">
                                        <div className="font-semibold">{testimonial.name}</div>
                                        <div className="text-sm text-gray-800">{testimonial.role}</div>
                                    </div>
                                </div>
                                <p className="text-gray-800">{testimonial.quote}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Testimonials;