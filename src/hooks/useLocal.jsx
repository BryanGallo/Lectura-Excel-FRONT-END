import { useContext } from "react";
import LocalesContext from "../context/LocalesProvider";

const useLocal = () => {
    return useContext(LocalesContext)
};

export default useLocal;
