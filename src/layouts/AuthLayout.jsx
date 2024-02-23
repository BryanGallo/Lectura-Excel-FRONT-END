import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <>
            <main className="mx-auto bg-slate-100 h-screen my-auto p-2 flex justify-center items-center ">
                <div className="md:w-4/4 lg:w-3/4">
                    <Outlet />
                </div>
            </main>
        </>
    );
};

export default AuthLayout;
