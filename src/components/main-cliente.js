import React, { Component } from "react";
import AvaliacaoService from "../services/avaliacao.service";

export default class MainCliente extends Component {
    constructor(props) {
        super(props);        
        this.searchCliente = this.searchCliente.bind(this);
        this.updateCliente = this.updateCliente.bind(this);
        this.deleteCliente = this.deleteCliente.bind(this);

        this.state = {
            cliente: {nome:"teste"},
            idCliente: "",
            nomeCliente: "",
            nomePesquisa: "",
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
            found: true,
            searchEvent: false
        };
    }

    onChangeHandler(field, value) {
        this.setState({
            [field]: value
        });
    }

    searchCliente() {
        AvaliacaoService.getCliente(this.state.nomePesquisa)
            .then(response => {
                this.setState({
                    cliente: response.data,
                    found: true
                });
                console.log(response.data);
            }).catch(e => {
                this.setState({
                    found: false
                })
                console.log(e) // :..-(
            })
            this.setState({
                searchEvent: true
            })
    }

    updateCliente() {       
        AvaliacaoService.update(this.state.cliente.id, this.state.cliente)
            .then(response => {
                this.setState({
                    cliente: response.data,
                });
                console.log(response.data);
            }).catch(e => {
                console.log(e) // :..-(
            })
    }

    deleteCliente() {       
        AvaliacaoService.delete(this.state.cliente.id)
            .then(response => {
                this.setState({
                    found: false
                });
                console.log(response.data);
            }).catch(e => {
                console.log(e) // :..-(
            })
    }

    render() {
        const { nomeCliente, cliente, found, 
            nomePesquisa, cpf, searchEvent, endereco, telefone, email } = this.state;
        return(
            <div className="list_row">
                <div className="col-md-10">
                    <div className="input-group mb-3">
                        <input 
                            type="text"
                            className="form-control"
                            style={styleInput}
                            placeHolder="Digite o nome..."                        
                            value={nomePesquisa}
                            onChange={value => this.onChangeHandler("nomePesquisa", value)}
                        />
                        <div className="input-group-append">
                            <button 
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick="{this.searchCliente}">
                                    Pesquisar
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    {cliente ? (
                        <div className="edit-form">
                            <h3 style={styleTitulo}>Informações do Cliente</h3>
                            <input
                                type="text"
                                className="form-control"
                                style={styleInput}
                                id="nomeCliente"
                                placeHolder="Nome"
                                required
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

                            <button
                                className="btn btn-success" style={styleButton}
                                onClick={this.updateCliente} disabled={found === false}>
                                Atualizar
                            </button>

                            <button
                                className="btn btn-warning" style={styleButton}
                                onClick={this.deleteCliente} disabled={found === false}>
                                Apagar
                            </button>
                        </div>
                    ) : (
                        (searchEvent && 
                            <div>
                                <br />
                                <p>Cliente não localizado :-(</p>
                            </div> 
                        )
                    )}
                </div>

            </div>
       ); 
    }
}

const styleInput = {
    marginRight: 5,   
    marginBottom: 5
}
const styleTitulo = {
    paddingTop: 10,
    color: "#0d6efd"
}
const styleButton = {
    marginTop: 10,
    marginRight: 5
}


