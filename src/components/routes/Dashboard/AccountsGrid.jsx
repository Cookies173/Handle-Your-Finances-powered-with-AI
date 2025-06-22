import React from "react";
import CreateAccount from "./CreateAccount";

function AccountsGrid(){
    return(
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-5">
            <CreateAccount />
        </div>
    );
}

export default AccountsGrid;