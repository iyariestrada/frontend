import React, { useState } from "react";
import "./loginview.css";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import logo from "../public/LogoOficial_HIC_horizontal.png";

function LoginView() {
  const [type, setType] = useState("signIn");
  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container-loginview " +
    (type === "signUp" ? "right-panel-active-loginview" : "");
  return (
    <div className="loginview">
      <div className="header-container-loginview">
        <div className="logo-container-loginview">
          <img
            src={logo}
            alt="Logo Oficial HIC"
            className="hospital-logo-loginview"
          />
        </div>
      </div>
      <div className={containerClass} id="container-loginview">
        <SignUpForm />
        <SignInForm />
        <div className="overlay-container-loginview">
          <div className="overlay-loginview">
            <div className="overlay-panel-loginview overlay-left-loginview">
              <h1>Bienvenido</h1>
              <p>Ingresa tus datos personales.</p>
              <button
                className="ghost-loginview"
                id="signIn-loginview"
                onClick={() => handleOnClick("signIn")}>
                Iniciar Sesión
              </button>
            </div>
            <div className="overlay-panel-loginview overlay-right-loginview">
              <h1>Bienvenido de nuevo</h1>
              <p>
                Para mantenerte conectado con nosotros, por favor inicia sesión
                con tu información de acceso.
              </p>
              <button
                className="ghost-loginview"
                id="signUp-loginview"
                onClick={() => handleOnClick("signUp")}>
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
