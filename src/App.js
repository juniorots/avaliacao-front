import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css"

import LoginAvaliacao from "./components/login-avaliacao";
import AddCliente from "./components/add-cliente";
import MainCliente from "./components/main-cliente";

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (                 
      <div className="container mt-3">
        <Routes>
          <Route exact path="/login-avaliacao" element={<LoginAvaliacao />} />                  
          <Route exact path="/" element={<LoginAvaliacao />} />   
          <Route path="/clientes" element={<MainCliente />} />
          <Route path="/add-clientes" element={<AddCliente/>} />
        </Routes>      
      </div>
    );
  } 
}

export default App;
