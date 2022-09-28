import React, { useEffect, useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { UsuarioService } from "../service/UsuarioService";
import { Toast } from "primereact/toast";
import { Link, Redirect, useHistory } from "react-router-dom";

const Login = () => {
    let emptyLogin = {
        username: "",
        password: "",
    };

    const [login, setLogin] = useState(emptyLogin);
    const toast = useRef(null);
    const redirect = useHistory();

    const [submitted, setSubmitted] = useState(false);
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _login = { ...login };
        _login[`${name}`] = val;

        setLogin(_login);
    };

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const defaultValues = {
        name: "",
        email: "",
        password: "",
        accept: false,
    };

    const ingresar = () => {
        setSubmitted(true);
        if (login.username.trim()) {
            let _login = { ...login };
            const usuarioService = new UsuarioService();
            const result = usuarioService.postLogin(_login);
            result
                .then((response) => {
                    usuarioService.getLogin2();

                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("rol", localStorage.getItem("rol2"));
                })
                .then(() => {
                    const result2 = usuarioService.getLogin();
                    result2.then((result) => {
                        localStorage.setItem("usuario", result.data.username);
                        localStorage.setItem("rol", result.data.rol.nombre);
                    });
                    redirect.push("/dashboard");
                })
                .catch((error) => {
                    toast.current.show({
                        severity: "error",
                        summary: "Successful",
                        detail: "Los Datos Ingresados Son Incorrectos",
                        life: 3000,
                    });
                });
        }
    };

    //retorno html
    const dialogFooter = (
        <div className="flex justify-content-center">
            <Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} />
        </div>
    );

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <Dialog
                visible={showMessage}
                onHide={() => setShowMessage(false)}
                position="top"
                footer={dialogFooter}
                showHeader={false}
                // breakpoints={{ "960px": "100vw" }}
                style={{ width: "30vw" }}
            >
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: "5rem", color: "var(--green-500)" }}></i>
                    <h5>Login Exitoso</h5>
                    <p style={{ lineHeight: 1.5, textIndent: "1rem" }}>listo</p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">Ingreso De Usuarios</h5>
                    <form className="p-fluid">
                        <div className="field">
                            <label htmlFor="name">Usuario</label>
                            <InputText
                                id="username"
                                value={login.username}
                                onChange={(e) => onInputChange(e, "username")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !login.email,
                                })}
                            />
                            {submitted && !login.email && <small className="p-invalid">El email de la informacion es necesario.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="password">Contraseña</label>
                            <Password
                                id="password"
                                value={login.password}
                                feedback={false}
                                onChange={(e) => onInputChange(e, "password")}
                                required
                                className={classNames({
                                    "p-invalid": submitted && !login.password,
                                })}
                            />
                            {submitted && !login.password && <small className="p-invalid">La contraseña es necesaria.</small>}
                        </div>

                        <Button label="Ingresar" onClick={ingresar} />

                        {/* <Link to="/registro">
              <Button label="Registrarse" className="p-button-text" />
            </Link> */}
                    </form>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Login, comparisonFn);
