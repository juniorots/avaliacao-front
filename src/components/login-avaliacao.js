import React, { Component } from "react";
import AvaliacaoService from "../services/avaliacao.service";
import { Navigate } from "react-router-dom";

export default class LoginAvaliacao extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: "",
            senha: "",
            perfilList: [
                {
                    nomePerfil: null
                }
            ],
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
            localStorage.setItem("perfil", this.state.perfilList[0].nomePerfil);
            // let url = "/clientes?u="+this.state.login+"&p="+this.state.perfilList[0].nomePerfil;
            let url = "/clientes";
            this.setState({ toElement: url });         
        }).catch(e => {   
            this.setState({ perfilList: [{nomePerfil: null }]})         
            localStorage.setItem("perfil", this.state.perfilList[0].nomePerfil);
            alert("FALHA, VERIFIQUE SEU LOGIN E SENHA.");
            console.log(e) // :..-(
        }) 
    }
    
    render() {          
        const { login, senha } = this.state;
        if (this.state.toElement) return (<Navigate to={this.state.toElement} />);
        return (            
            <div className="container d-flex justify-content-center">
                <div className="card mt-5 w-40">
                    <div className="card-body">

                            <div className="list_row">
                                <div className="col-md-8">
                                <input 
                                    type="text"
                                    className="form-control"
                                    style={styleInput}
                                    placeholder="LOGIN" 
                                    name="login"
                                    value={login}
                                    onChange={value => this.onChangeHandler(value)}
                                />
                                <input 
                                    type="password"
                                    className="form-control"
                                    style={styleInput}
                                    placeholder="***" 
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