import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import AuthLayout from "./layouts/AuthLayout";
import OlvidePassword from "./page/OlvidePassword";
import RutaProtegida from "./layouts/RutaProtegida";
import Ventas from "./page/Ventas";
import Locales from "./page/Locales";
import LocalInformacion from "./page/LocalInformacion";
import { VentasProvider } from "./context/VentasProvider";
import { AuthProvider } from "./context/AuthProvider";
import { LocalesProvider } from "./context/LocalesProvider";
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <VentasProvider>
                    <LocalesProvider>
                        <Routes>
                            <Route path="/" element={<AuthLayout />}>
                                <Route index element={<Login />} />
                                <Route
                                    path="olvide-password"
                                    element={<OlvidePassword />}
                                />
                            </Route>
                            <Route path="/ventas" element={<RutaProtegida />}>
                                <Route index element={<Ventas />} />
                                <Route path="locales" element={<Locales />} />
                                <Route
                                    path="locales/:id"
                                    element={<LocalInformacion />}
                                />
                            </Route>
                        </Routes>
                    </LocalesProvider>
                </VentasProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
