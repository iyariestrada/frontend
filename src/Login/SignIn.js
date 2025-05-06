import React from "react";
import "./loginview.css";

function SignInForm() {
  const [num_tel, setNumTel] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [state, setState] = React.useState({
    num_tel: "",
    password: "",
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();

    const { num_tel, password } = state;
    alert(`Has iniciado sesión con teléfono: ${num_tel}`);

    for (const key in state) {
      setState({
        ...state,
        [key]: "",
      });
    }
  };

  return (
    <div className="form-container-loginview sign-in-container-loginview">
      <form onSubmit={handleOnSubmit} className="loginview-form">
        <h1>Iniciar sesión</h1>
        <input
          type="number"
          placeholder="Número de teléfono"
          name="num_tel"
          value={state.num_tel}
          onChange={handleChange}
          className="loginview-input"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={state.password}
          onChange={handleChange}
          className="loginview-input"
          required
        />
        <a href="#" className="forgot-password-loginview">
          ¿Olvidaste tu contraseña?
        </a>
        <button className="loginview-button">Iniciar sesión</button>
      </form>
    </div>
  );
}

export default SignInForm;
