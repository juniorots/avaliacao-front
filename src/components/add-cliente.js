import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import ClienteService from "../services/avaliacao.service";

export default class AddCliente extends Component {
    constructor(props) {
        super(props);
        this.saveCliente = this.salvarCliente.bind(this);
        this.newCliente = this.newCliente.bind(this);

        this.state = {
            id: null,
            nomeCliente: "",
            cpf: "",
            enviado: false
        }
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
                    <div>
                        <div className="form-group">                            
                            <input
                                type="text"
                                className="form-control"
                                id="nomeCliente"
                                placeHolder="Nome..."
                                required
                                value={this.state.nome}
                                onChange={value => this.onChangeHandler("nomeCliente", value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cpf">CPF</label>        
                            <input
                                type="text"
                                className="form-control"
                                id="cpf"
                                placeHolder="CPF..."
                                required
                                value={this.state.cpf}
                                onChange={value => this.onChangeHandler("cpf", value)}
                            />
                        </div>

                        <button onClick="{this.saveCliente}" className="btn btn-success">
                            Cadastrar
                        </button>
                    </div>
                )}
            </div>
        );
    }
}