import React from "react";

function Info({ account }){
    return (
        <div>
            <div className="space-y-8 px-5 flex gap-4 items-end justify-between pt-20">
                <div>
                    <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">{account.name}</h1>
                    <p className="text-muted-foreground">{account.type} Account</p>
                </div>
                <div className="text-right pb-2">
                    <div className="text-xl sm:text-2xl font-bold">₹{parseFloat(account.balance).toFixed(2)}</div>
                    <p className="text-sm text-muted-foreground">Count Transactions</p>
                </div>
            </div>
        </div>
    );
}

export default Info;