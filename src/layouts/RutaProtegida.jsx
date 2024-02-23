import { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
// import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const RutaProtegida = () => {
    const { auth, validando } = useAuth();
    console.log(auth);
    console.log(auth.id);

    console.log(validando);

    if (validando) return "Cargando....";
    return (
        <>
            {auth.id ? (
                <div className="bg-gray-100">
                    <Header />
                    <div className=" md:min-h-screen">
                        <main className="md:p-3 min-lg:flex-1 ">
                            <Outlet />
                        </main>
                    </div>
                    <Footer />
                </div>
            ) : (
                <Navigate to="/" />
            )}
        </>
    );
};

export default RutaProtegida;
