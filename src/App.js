import React, { Component } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css"

import LoginAvaliacao from "./components/login-avaliacao";
import AddCliente from "./components/add-cliente";
import MainCliente from "./components/main-cliente";

export const ControlAccess = ({children}) => {
  let location = useLocation();
    if (localStorage.getItem("perfil") === "null")       
      return <Navigate to="/login-avaliacao" state={{ from: location }} />;

    return children;    
};  

export const ControlAdmin = ({children}) => {
  let location = useLocation();
    if (localStorage.getItem("perfil") === "comum")       
      return <Navigate to="/clientes" state={{ from: location }} />;

    return children;    
};  

class App extends Component {  
  render() {
    return (                 
      <div className="container mt-3">
        <Routes>
          <Route path="/login-avaliacao" element={<LoginAvaliacao />} />                  
          <Route exact path="/" element={<LoginAvaliacao />} />            
          <Route path="/clientes" element={<ControlAccess> <MainCliente /> </ControlAccess>} />
          <Route path="/add-clientes" 
            element={
                <ControlAccess> 
                  <ControlAdmin> 
                    <AddCliente/> 
                  </ControlAdmin> 
                </ControlAccess>} 
            />
        </Routes>
      </div>
    );
  } 
}

export default App;
