import React, { Component } from "react";
import AvaliacaoService from "../services/avaliacao.service";
import { Routes, Route, Link, Navigate } from "react-router-dom";

export default class LoginAvaliacao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            senha: "",
            perfilList: [
                {
                    nomePerfil: ""
                }
            ],
            // toElement: "/home-cliente"
            toElement: null
        }
    }

    onChangeHandler = (obj) => {    
        let { name, value } = obj.target;    
        this.setState({
            [name]: value
        });
    }

    tryLogin = () => {          
        let data = {
            login: this.state.login,
            senha: this.state.senha
        }
        AvaliacaoService.validarUsuario(data)
        .then(response => {
            this.setState({
                perfilList: response.data.perfilList
            });
            let url = "/clientes?usr="+this.state.login;
            this.setState({ toElement: url });
            // console.log(response.data);
        }).catch(e => {            
            alert("PROBLEMA COM LOGIN.");
            console.log(e) // :..-(
        })        
    }

    render() {        
        const { login, senha } = this.state;
        if (this.state.toElement) return (<Navigate to={this.state.toElement} props={this.state} />);
        return (            
            <div className="container d-flex justify-content-center">
                <div className="card mt-5 w-40">
                    <div className="card-body">
                        <form>
                            <div className="list_row">
                                <div className="col-md-8">
                                <input 
                                    type="text"
                                    className="form-control"
                                    style={styleInput}
                                    placeHolder="LOGIN" 
                                    name="login"
                                    value={login}
                                    onChange={value => this.onChangeHandler(value)}
                                />
                                <input 
                                    type="password"
                                    className="form-control"
                                    style={styleInput}
                                    placeHolder="***" 
                                    name="senha"
                                    value={senha}
                                    onChange={value => this.onChangeHandler(value)}
                                />
                                <button                                     
                                    className="btn btn-primary"
                                    onClick={() => this.tryLogin()}>
                                        Entrar
                                </button>
                                </div>
                            </div>            
                        </form>
                    </div>
                </div>    
            </div>
        );
    }
}

const styleInput = {
    marginRight: 5,   
    marginBottom: 5,
    width: 250
}