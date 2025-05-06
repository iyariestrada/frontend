import React from "react";

function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
    num_tel: "",
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

    const { name, num_tel, password } = state;
    alert(
      `Registro exitoso con nombre: ${name}, teléfono: ${num_tel} y contraseña: ${password}`
    );

    for (const key in state) {
      setState({
        ...state,
        [key]: "",
      });
    }
  };

  return (
    <div className="form-container-loginview sign-up-container-loginview">
      <form onSubmit={handleOnSubmit}>
        <h1>Registrar cuenta</h1>
        <span>Utilizar número de teléfono previamente autorizado</span>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Nombre completo"
          className="loginview-input"
        />
        <input
          type="number"
          name="num_tel"
          value={state.num_tel}
          onChange={handleChange}
          placeholder="Número de teléfono"
          className="loginview-input"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="loginview-input"
        />
        <button className="loginview-button">Registrar</button>
      </form>
    </div>
  );
}

export default SignUpForm;
