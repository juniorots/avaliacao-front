import React, { Component } from "react";
import AvaliacaoService from "../services/avaliacao.service";
import InputMask from "react-input-mask";

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
            tmpTelefone: "",
            telefone: [],
            email: [],
            operador: "",
            found: true,
            searchEvent: false
        };
    }

    onChangeHandler(obj) {
        const { name, value } = obj.target;
        if (name.includes("endereco")) {
            const { endereco } = this.state;
            const enderecoAtual = endereco;
            enderecoAtual[name.substring(name.indexOf(".")+1,name.length)] = value;
            this.setState({ endereco: enderecoAtual });
            return;
        }
        this.setState({
            [name]: value
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
        AvaliacaoService.update(this.state.cliente.idCliente, this.state.cliente)
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

    shapePhone(obj) {
        const { value } = obj.target;
        const newValue = value.replace("-", "").replace("(","").replace(")","").replace(" ", "");
        if (newValue.length === 10) {
            const slice = 6;
            const tmp = `(${newValue.substring(0,2)}) ${newValue.substring(2, slice)}-${newValue.substring(slice, value.length)}`;
            this.setState({ tmpTelefone: tmp }, () => {
                obj.target.value = this.state.tmpTelefone;
            });
        }
    }

    render() {
        const { nomeCliente, cliente, found, 
            nomePesquisa, cpf, searchEvent, endereco, telefone, email, tmpTelefone } = this.state;
        return(
            <div className="list_row">
                <div className="col-md-8">
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
                                name="nomeCliente"
                                placeHolder="Nome"
                                required
                                value={nomeCliente}
                                onChange={value => this.onChangeHandler(value)}
                            />
                            <InputMask
                                type="text"
                                className="form-control"
                                style={styleShortInput}
                                name="cpf"
                                mask="999.999.999-99"
                                maskChar=""
                                placeHolder="CPF"
                                required
                                value={cpf}
                                onChange={value => this.onChangeHandler(value)}
                            />
                            
                            <div className="input-group mb-3 w-50">
                                <InputMask
                                    type="text"
                                    className="form-control"
                                    style={styleShortInput}
                                    mask={tmpTelefone < 11 ? "(99) 9999-9999" : "(99) 99999-9999" }
                                    maskChar=""
                                    name="tmpTelefone"
                                    placeHolder="TELEFONE"
                                    required
                                    value={tmpTelefone}
                                    onBlur={value => this.shapePhone(value)}
                                    onChange={value => this.onChangeHandler(value)}
                                />
                                <div className="input-group-append">
                                    <button 
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick="{this.addTelefone}">
                                            Adicionar
                                    </button>
                                </div>
                            </div>

                            <div className="input-group mb-1">
                                <input
                                    type="text"
                                    className="form-control"
                                    style={styleMediumInput}
                                    name="email"
                                    placeHolder="E-MAIL"
                                    required
                                    value={email}
                                    onChange={value => this.onChangeHandler(value)}
                                />   
                                <div className="input-group-append">
                                    <button 
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick="{this.addEmail}">
                                            Adicionar
                                    </button>
                                    </div>
                            </div>   

                            <h5 style={styleTitulo}>Endereço</h5>
                            <InputMask
                                type="text"
                                className="form-control"
                                style={styleShortInput}
                                mask="99.999-999"
                                maskChar=""
                                name="endereco.cep"
                                placeHolder="CEP"
                                required
                                value={endereco.cep}
                                onChange={value => this.onChangeHandler(value)}
                            />
                            <input
                                type="text"
                                className="form-control"
                                style={styleInput}
                                name="endereco.logradouro"
                                placeHolder="LOGRADOURO"
                                required
                                value={endereco.logradouro}
                                onChange={value => this.onChangeHandler(value)}
                            />
                            <input
                                type="text"
                                className="form-control"
                                style={styleMediumInput}
                                name="endereco.bairro"
                                placeHolder="BAIRRO"
                                required
                                value={endereco.bairro}
                                onChange={value => this.onChangeHandler(value)}
                            />
                            <input
                                type="text"
                                className="form-control"
                                style={styleMediumInput}
                                name="endereco.cidade"
                                placeHolder="CIDADE"
                                required
                                value={endereco.cidade}
                                onChange={value => this.onChangeHandler(value)}
                            />
                            <input
                                type="text"
                                className="form-control"
                                style={styleShortInput}
                                name="endereco.uf"
                                placeHolder="UF"
                                required
                                value={endereco.uf}
                                onChange={value => this.onChangeHandler(value)}
                            />
                            <input
                                type="text"
                                className="form-control"
                                style={styleInput}
                                name="endereco.complemento"
                                placeHolder="COMPLEMENTO"                                
                                value={endereco.complemento}
                                onChange={value => this.onChangeHandler(value)}
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
                                <p style={styleTitulo}>Cliente não localizado :-(</p>
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
    marginBottom: 5,
    width: 600
}
const styleMediumInput = {
    marginBottom: 5,
    marginleft: 5,
    marginRight: 5,
    width: 300
}
const styleShortInput = {
    marginBottom: 5,
    marginleft: 5,
    marginRight: 5,
    width: 150
}
const styleTitulo = {
    paddingTop: 10,
    color: "#0d6efd"
}
const styleButton = {
    marginTop: 10,
    marginRight: 5
}



