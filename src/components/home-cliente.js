import React, { Component } from "react";
import { Routes, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css"

class HomeCliente extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (            
      <div>
        <nav className="navbar navbar-expand navbar-blue bg-blue">      
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/clientes"} className="nav-link">
                Pesquisar Cliente
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/add-clientes"} className="nav-link">
                Adicionar Cliente
              </Link>
            </li>
          </div>        
        </nav>                
      </div>
    );
  } 
}

export default HomeCliente;
