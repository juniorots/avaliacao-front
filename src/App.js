import React, { Component } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css"

import LoginAvaliacao from "./components/login-avaliacao";
import { isLogado } from "./components/login-avaliacao";
import AddCliente from "./components/add-cliente";
import MainCliente from "./components/main-cliente";

export const ControlAccess = ({children}) => {
  let location = useLocation();
console.log(isLogado);
    if (isLogado)       
      return <Navigate to="/login-avaliacao" state={{ from: location }} />;
    return children;    
};  

class App extends Component {  
  render() {
    return (                 
      <div className="container mt-3">
        <Routes>
          <Route path="/login-avaliacao" element={<LoginAvaliacao />} />                  
          <Route exact path="/" element={<LoginAvaliacao />} />   
          <Route path="/clientes" component={<MainCliente />} />
          
          {/* <Route path="/clientes" component={<ControlAccess> <MainCliente /> </ControlAccess>} />
          <Route path="/add-clientes" component={<ControlAccess> <AddCliente/> </ControlAccess>} /> */}
        </Routes>
      </div>
    );
  } 
}

export default App;
