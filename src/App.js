// import React, { Component } from "react";
import { Link, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import AddCliente from "./components/add-cliente";
import MainCliente from "./components/main-cliente";

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-blue bg-blue">
        <a href="/clientes" className="navbar-brand">
          Pesquisar Cliente   
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/add-clientes"} className="nav-link">
              Adicionar
            </Link>
          </li>
        </div>        
      </nav>

      <div className="container mt-3"> 
        <Routes>
          <Route exact path={["/", "/clientes"]} component={MainCliente} />
          <Route exact path="/add-clientes" component={AddCliente} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
