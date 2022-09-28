import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { UsuarioService } from "../service/UsuarioService";

const Clear = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.clear();
    return (
        <>
            <Redirect to="/" />
        </>
    );
};

export default Clear;
