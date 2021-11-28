import React, { Component } from "react";
import AvaliacaoService from "../services/avaliacao.service";

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
            ]
        }
    }

    onChangeHandler = (field, value) => {        
        this.setState({
            [field]: value
        });
    }

    tryLogin = () => {

    }

    render() {
        const { login, senha } = this.state;
        return (
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
                    type="text"
                    className="form-control"
                    style={styleInput}
                    placeHolder="***" 
                    secureTextEntry
                    name="login"
                    value={senha}
                    onChange={value => this.onChangeHandler(value)}
                />
                <Button 
                    title="Entrar" 
                    onPress={() => this.tryLogin()}
                />
                </div>
            </div>
            </form>
        );
    }
}

const styleInput = {
    marginRight: 5,   
    marginBottom: 5,
    width: 200
}