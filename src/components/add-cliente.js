import React, { Component } from "react";
import { useLocation } from "react-router-dom";
import TablePhone from "./table-phone";
import TableEmail from "./table-email";
import ClienteService from "../services/avaliacao.service";
import InputMask from "react-input-mask";
import Select from 'react-select'
import HomeCliente from "./home-cliente";

export default class AddCliente extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            cliente: {id: "", nome:"teste"},
            idCliente: "",
            nomeCliente: "",
            cpf: "",
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
            tmpTpPhone: "",
            tmpEmail: "",
            telefone: [],
            email: [],
            tipoTelefone: [
                { value : "residencial", label: "Residencial" },
                { value : "comercial", label: "Comercial" },
                { value : "celular", label: "Celular" }
            ],
            auditoria: { operador: "OPERADOR 01" },
            found: true,
            searchEvent: false,
            enviado: false,
            fullForm: true
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
    
    saveCliente = () => {
        if (!this.validator()) return;
        var data = {
            nome: this.state.nomeCliente,
            cpf: this.state.cpf,
            endereco: this.state.endereco,
            telefones: this.state.telefone,
            emails: this.state.email,
            auditoria: this.state.auditoria
        }

        ClienteService.create(data).then(response => {
            this.newCliente();
            alert("CLIENTE CADASTRADO.");
// console.log(response.data);
        }).catch(e => {
            console.log(e); // :..-(
        })
    }

    newCliente = () => {
        this.setState({
            nomeCliente: "",
            cpf: "",
            endereco : {
                cep: "",
                cidade: "",
                logradouro: "",
                bairro: "",
                uf: "",
                complemento: ""
            },
            tmpTelefone: "",
            tmpTpPhone: "",
            tmpEmail: "",
            telefone: [],
            email: []
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
        this.checkBlank(obj);
    }

    checkMinLength(obj) {
        let { value } = obj.target;
        let e = document.getElementById("lblWarning");
        this.checkBlank(obj)
  
        if (value.length > 0 && value.length < 4) {
            // e.tabIndex="0";
            e.focus();
            e.style.display = "block";
            return;
        }
        e.style.display = "none";
    }

    checkEmail(obj) {
        let { value } = obj.target;
        let e = document.getElementById("warningEmail");
        this.checkBlank(obj);
        if (value !== undefined && !value.includes("@") && value.length > 0) {
            // e.tabIndex="0";
            e.focus();
            e.style.display = "block";
            return;
        }
        e.style.display = "none";
    }

    validator = () => {
        let e = document.getElementById("nomeCliente");
        if (e.value.length > 0 && e.value.length < 4) return false; // :..-(

        if (this.state.telefone.length === 0) {
            alert("INSIRA PELO MENOS 1 TELEFONE");
            return false;
        }

        if (this.state.email.length === 0) {
            alert("INSIRA PELO MENOS 1 E-MAIL");
            return false;
        }

        return true;
    }

    getCep(obj) {
        let { value } = obj.target;
        this.checkBlank(obj);
        if ( value.length === 0) return;

        value = value.replace("-","").replace(".","");

        fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then((resp) => resp.json())
        .then((data) => {            
            if (data.hasOwnProperty("erro")) {                
                alert('PROBLEMAS COM O SERVIDOR, TENTE MAIS TARDE.');
                return;
            }
            this.setState({
                endereco: {
                    cep: value,
                    uf: data.uf,
                    cidade: data.localidade,
                    bairro: data.bairro,
                    logradouro: data.logradouro
                }
            })
        })
        .catch(erro => console.log(erro));
    }

    addPhone = () => {
        let e = document.getElementById("tmpTelefone");        
        let list = this.state.telefone;        
        list.push({tipo: this.state.tmpTpPhone, numero: e.value });
        this.setState({
            telefone: list
        })
    }

    addEmail = () => {
        let e = document.getElementById("tmpEmail");        
        let list = this.state.email;        
        list.push({email: e.value });
        this.setState({
            email: list
        })
    }

    onSubmit = e => {
        e.preventDefault();
    }

    checkBlank = (obj) => {
        let { name, value } = obj.target;
        let e = document.getElementById("error"+name);
        let fields = [
            "nomeCliente",
            "cpf",
            "tmpTelefone",
            "tmpEmail",
            "endereco.cep",
            "endereco.logradouro",
            "endereco.bairro",
            "endereco.cidade",
            "endereco.uf"
        ]
        e.innerHTML = "";

        if (value.length === 0) 
            e.innerHTML = "* Obrigatório";     
        
        this.setState({ fullForm: true });
        fields.map((field) => {
            if (document.getElementById(field).value === "") 
                this.setState({ fullForm: false }); 
        });
    }

    render() {
        const { nomeCliente, tipoTelefone, tmpEmail,
            cpf, endereco, telefone, email, tmpTelefone } = this.state;
        return (
            <div className="submit-form">    
                <HomeCliente />            
                <div className="col-md-8">
                    <div style={styleContainer}>
                        <h3 style={styleTitulo}>Preencha os dados</h3>
                        <h8 style={styleWarning} id="lblWarning">
                            Aviso: Informe de 3 a 100 caracteres para o NOME
                        </h8>
                        <div id="errornomeCliente" style={styleError}></div>
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}                                                        
                            name="nomeCliente"
                            id="nomeCliente"
                            placeHolder="Nome"
                            value={nomeCliente}
                            onBlur={value => this.checkMinLength(value)}
                            onChange={value => this.onChangeHandler(value)}
                        />
                        <div id="errorcpf" style={styleError}></div>
                        <InputMask
                            type="text"
                            className="form-control"
                            style={styleShortInput}
                            name="cpf"
                            id="cpf"
                            mask="999.999.999-99"
                            maskChar=""
                            placeHolder="CPF"
                            value={cpf}
                            onBlur={ value => this.checkBlank(value)}
                            onChange={value => this.onChangeHandler(value)}
                        />
                        
                        <div id="errortmpTelefone" style={styleError}></div>
                        <div className="input-group mb-3 w-40">
                            <Select 
                                options={tipoTelefone} 
                                onChange={e => {
                                    this.setState({
                                        tmpTpPhone: e.value
                                    }, () => {
                                        // console.log(this.state.tmpTpPhone);
                                    })
                                }}/>
                            <InputMask
                                type="text"
                                className="form-control"
                                style={styleShortInput}
                                mask={tmpTelefone < 11 ? "(99) 9999-9999" : "(99) 99999-9999" }
                                maskChar=""
                                name="tmpTelefone"
                                id="tmpTelefone"
                                placeHolder="TELEFONE"
                                value={tmpTelefone}
                                onBlur={value => this.shapePhone(value)}
                                onChange={value => this.onChangeHandler(value)}
                            />
                            <div className="input-group-append">
                                <button 
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={this.addPhone}>
                                        Adicionar
                                </button>
                            </div>
                        </div>
                        <TablePhone items={telefone}/>

                        <h8 style={styleWarning} id="warningEmail">
                            E-mail inválido.
                        </h8>
                        <div id="errortmpEmail" style={styleError}></div>
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                style={styleMediumInput}
                                name="tmpEmail"
                                id="tmpEmail"
                                placeHolder="E-MAIL"                                
                                value={tmpEmail}
                                onBlur={value => this.checkEmail(value)}
                                onChange={value => this.onChangeHandler(value)}
                            />   
                            <div className="input-group-append">
                                <button 
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={this.addEmail}>
                                        Adicionar
                                </button>
                                </div>
                        </div>   
                        <TableEmail items={email}/>

                        <h5 style={styleTitulo}>Endereço</h5>
                        <div id="errorendereco.cep" style={styleError}></div>
                        <InputMask
                            type="text"
                            className="form-control"
                            style={styleShortInput}
                            mask="99.999-999"
                            maskChar=""
                            name="endereco.cep"
                            id="endereco.cep"
                            placeHolder="CEP"
                            value={endereco.cep}
                            onBlur={value => this.getCep(value)}
                            onChange={value => this.onChangeHandler(value)}
                        />
                        <div id="errorendereco.logradouro" style={styleError}></div>
                        <input
                            type="text"
                            className="form-control"
                            style={styleInput}
                            name="endereco.logradouro"
                            id="endereco.logradouro"
                            placeHolder="LOGRADOURO"
                            value={endereco.logradouro}
                            onBlur={value => this.checkBlank(value)}
                            onChange={value => this.onChangeHandler(value)}
                        />
                        <div id="errorendereco.bairro" style={styleError}></div>
                        <input
                            type="text"
                            className="form-control"
                            style={styleMediumInput}
                            name="endereco.bairro"
                            id="endereco.bairro"
                            placeHolder="BAIRRO"
                            value={endereco.bairro}
                            onBlur={value => this.checkBlank(value)}
                            onChange={value => this.onChangeHandler(value)}
                        />
                        <div id="errorendereco.cidade" style={styleError}></div>
                        <input
                            type="text"
                            className="form-control"
                            style={styleMediumInput}
                            name="endereco.cidade"
                            id="endereco.cidade"
                            placeHolder="CIDADE"
                            value={endereco.cidade}
                            onBlur={value => this.checkBlank(value)}
                            onChange={value => this.onChangeHandler(value)}
                        />
                        <div id="errorendereco.uf" style={styleError}></div>
                        <input
                            type="text"
                            className="form-control"
                            style={styleShortInput}
                            name="endereco.uf"
                            id="endereco.uf"
                            placeHolder="UF"
                            value={endereco.uf}
                            onBlur={value => this.checkBlank(value)}
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

                        <button onClick={this.saveCliente} className="btn btn-success" disabled={!this.state.fullForm}>
                            Cadastrar
                        </button>
                    </div>
                </div>
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
const styleError = {
    color: "red",
    fontSize:13,
    marginBottom: 2
}
