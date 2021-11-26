import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import ClienteService from "../services/avaliacao.service";
import InputMask from "react-input-mask";

export default class AddCliente extends Component {
    constructor(props) {
        super(props);
        // this.saveCliente = this.salvarCliente.bind(this);
        // this.newCliente = this.newCliente.bind(this);

        this.state = {
            cliente: {nome:"teste"},
            idCliente: "",
            nomeCliente: "", 
            cpf: "",           
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
            enviado: false,
            valor: ""          
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

    shapePhone(obj) {
        this.setState({ valor: "TESTE" });
console.log(this.state.valor);
        const { value } = obj.target;
        const newValue = value.replace("-", "").replace("(","").replace(")","").replace(" ", "");
        if (newValue.length === 10) {
            const slice = 6;
            const tmp = `(${newValue.substring(0,2)}) ${newValue.substring(2, slice)}-${newValue.substring(slice, value.length)}`;
            return tmp;
        }
    }

    render() {
        const { nomeCliente,
            cpf, endereco, telefone, email, tmpTelefone } = this.state;
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
                    <div className="col-md-8">
                    <div style={styleContainer}>
                        <h3 style={styleTitulo}>Preencha os dados</h3>
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

                        <div className="input-group mb-3">
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

                        <button onClick="{this.saveCliente}" className="btn btn-success">
                            Cadastrar
                        </button>
                    </div>
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
    marginRight: 5,
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
