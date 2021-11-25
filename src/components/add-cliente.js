import React, { Component } from "react";
import { StyleSheet } from "react-native";
import Alert from "react-bootstrap/Alert";
import ClienteService from "../services/avaliacao.service";

export default class AddCliente extends Component {
    constructor(props) {
        super(props);
        // this.saveCliente = this.salvarCliente.bind(this);
        // this.newCliente = this.newCliente.bind(this);

        this.state = {
            cliente: {nome:"teste"},
            idCliente: "",
            nomeCliente: "",            
            endereco: {
                cep: "",
                logradouro: "",
                bairro: "",
                cidade: "",
                uf: "",
                complemento: ""
            },
            telefone: [],
            email: [],
            operador: "",
            enviado: false            
        };
    }
    onChangeHandler(field, value) {
        this.setState({
            [field]: value
        });
    }
    
    saveCliente() {
        var data = {
            nome: this.state.nomeCliente,
            cpf: this.state.cpf
        }

        ClienteService.create(data).then(response => {
            this.setState({
                id: response.data.id,
                nomeCliente: response.data.nome,
                cpf: response.data.cpf,
                enviado: true
            });
            console.log(response.data);
        }).catch(e => {
            console.log(e); // :..-(
        })
    }

    newCliente() {
        this.state({
            id: null,
            nomeCliente: "",
            cpf: "",
            enviado: false
        });
    }

    render() {
        const { nomeCliente,
            cpf, endereco, telefone, email } = this.state;
        return (
            <div className="submit-form">
                {this.state.enviado ? (
                    <Alert key={"1"} variant={"primary"}>
                        Cliente Cadastrado. 
                        <Alert.Link href="{this.newCliente}">
                            Novo Cliente
                        </Alert.Link>
                    </Alert>
                ) : (
                    <div style={styleContainer}>
                        <h3 style={styleTitulo}>Preencha os dados</h3>
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            id="nomeCliente"
                            placeHolder="Nome"
                            required
                            size="20"
                            value={nomeCliente}
                            onChange={value => this.onChangeHandler("nomeCliente", value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            id="cpf"
                            placeHolder="CPF"
                            required
                            value={cpf}
                            onChange={value => this.onChangeHandler("nomeCliente", value)}
                        />
                        
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            id="telefone"
                            placeHolder="TELEFONE"
                            required
                            value={telefone}
                            onChange={value => this.onChangeHandler("telefone", value)}
                        />

                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            id="email"
                            placeHolder="E-MAIL"
                            required
                            value={email}
                            onChange={value => this.onChangeHandler("email", value)}
                        />   

                        <h5 style={styleTitulo}>Endereço</h5>
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            id="cep"
                            placeHolder="CEP"
                            required
                            value={endereco.cep}
                            onChange={value => this.onChangeHandler("endereco.cep", value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            id="logradouro"
                            placeHolder="LOGRADOURO"
                            required
                            value={endereco.logradouro}
                            onChange={value => this.onChangeHandler("endereco.logradouro", value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            id="bairro"
                            placeHolder="BAIRRO"
                            required
                            value={endereco.bairro}
                            onChange={value => this.onChangeHandler("endereco.bairro", value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            id="cidade"
                            placeHolder="CIDADE"
                            required
                            value={endereco.cidade}
                            onChange={value => this.onChangeHandler("endereco.cidade", value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            id="uf"
                            placeHolder="UF"
                            required
                            value={endereco.uf}
                            onChange={value => this.onChangeHandler("endereco.uf", value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            id="complemento"
                            placeHolder="COMPLEMENTO"                                
                            value={endereco.complemento}
                            onChange={value => this.onChangeHandler("endereco.complemento", value)}
                        />

                        <button onClick="{this.saveCliente}" className="btn btn-success">
                            Cadastrar
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

const styleContainer = {
    margin: 5
}
const styleInput = {
    marginBottom: 5,
    marginleft: 5,
    marginRight: 5
}
const styleTitulo = {
    paddingTop: 10,
    color: "#0d6efd"
}
