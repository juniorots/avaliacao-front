import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import TablePhone from "./table-phone";
import TableEmail from "./table-email";
import ClienteService from "../services/avaliacao.service";
import InputMask from "react-input-mask";
import Select from 'react-select'

export default class AddCliente extends Component {
    constructor(props) {
        super(props);
        // this.saveCliente = this.salvarCliente.bind(this);
        // this.newCliente = this.newCliente.bind(this);

        this.state = {
            cliente: {id: "", nome:"teste"},
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
            telefone: [
                {
                    tipo: "",
                    numero: ""
                }
            ],
            tmpEmail: "",
            email: [
                {
                    endereco: ""
                }
            ],
            tipoTelefone: [
                { value : "residencial", label: "Residencial" },
                { value : "comercial", label: "Comercial" },
                { value : "celular", label: "Celular" }
            ],
            operador: "",
            found: true,
            searchEvent: false,
            enviado: false
        };        
    }
    
    onChangeHandler(obj) {
        let { name, value } = obj.target;
        if (name.includes("endereco")) {
            const { endereco } = this.state;
            const enderecoAtual = endereco;
            enderecoAtual[name.substring(name.indexOf(".")+1,name.length)] = value;
            this.setState({ endereco: enderecoAtual });
            return;
        }        
        if (name.includes("nomeCliente"))
            value = value.replace(/[!@#¨$%^&*)(+=._-]+/g, "");
        this.setState({
            [name]: value
        });
    }
    
    saveCliente() {
        if (!this.validator()) return;
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
        let { value } = obj.target;
        let newValue = value.replace("-", "").replace("(","").replace(")","").replace(" ", "");
        if (newValue.length === 10) {
            const slice = 6;
            const tmp = `(${newValue.substring(0,2)}) ${newValue.substring(2, slice)}-${newValue.substring(slice, value.length)}`;
            this.setState({ tmpTelefone: tmp }, () => {
                obj.target.value = this.state.tmpTelefone;
            });
        }
    }

    checkMinLength(obj) {
        let { value } = obj.target;
        let e = document.getElementById("lblWarning");
        if (value.length > 0 && value.length < 4) {
            e.tabIndex="0";
            e.focus();
            e.style.display = "block";
            return;
        }
        e.style.display = "none";
    }

    checkEmail(obj) {
        let { tmpEmail } = obj.target;
        let e = document.getElementById("warningEmail");
        if (tmpEmail !== undefined && !tmpEmail.includes("@") && tmpEmail.length > 0) {
            e.tabIndex="0";
            e.focus();
            e.style.display = "block";
            return;
        }
        e.style.display = "none";
    }

    validator() {
        let e = document.getElementByName("nomeCliente");
        if (e.value.length > 0 && e.value.length < 4) return false;

        return true;
    }

    render() {
        const { nomeCliente, tipoTelefone, tmpEmail,
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
                        <h8 style={styleWarning} id="lblWarning">
                            Aviso: Informe de 3 a 100 caracteres para o NOME
                        </h8>
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
                        
                        <div className="input-group mb-3 w-40">
                            <Select options={tipoTelefone} />
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
                        <TablePhone items={telefone}/>

                        <h8 style={styleWarning} id="warningEmail">
                            E-mail inválido.
                        </h8>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                style={styleMediumInput}
                                name="tmpEmail"
                                placeHolder="E-MAIL"
                                required
                                value={tmpEmail}
                                onBlur={value => this.checkEmail(value)}
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
                        <TableEmail items={email}/>

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
const styleWarning = {
    color: "orange", 
    display: "none"   
}

