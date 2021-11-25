import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css"

function App() {
  return (
    <div>
      <nav className="navbar navbar-expand navbar-blue bg-blue">
        <a href="/clientes" className="navbar-brand">
          Pesquisar Cliente   
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"\add-clientes"} className="nav-link">
              Adicionar
            </Link>
          </li>
        </div>        
      </nav>

      <div className="container mt-3"> 
        <Switch>
          <Route exact path={["/", "/clientes"]} component={ClienteList} />
          <Route exact path="/add-clientes" component={AddCliente} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
