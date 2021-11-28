import React, { Component } from "react";
import AvaliacaoService from "../services/avaliacao.service";
import TablePhone from "./table-phone";
import TableEmail from "./table-email";
import InputMask from "react-input-mask";
import Select from 'react-select'

export default class MainCliente extends Component {
    constructor(props) {
        super(props);        
        this.searchCliente = this.searchCliente.bind(this);
        this.updateCliente = this.updateCliente.bind(this);
        this.deleteCliente = this.deleteCliente.bind(this);

        this.state = {
            idCliente: "",
            cpf: "",
            nome: "",
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
            telefones: [],
            emails: [],
            tipoTelefone: [
                { value : "residencial", label: "Residencial" },
                { value : "comercial", label: "Comercial" },
                { value : "celular", label: "Celular" }
            ],
            auditoria: { operador: "OPERADOR 01" },
            found: false,
            searchEvent: false,
            fullForm: false
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
        if (name.includes("nome"))
            value = value.replace(/[!@#¨$%^&*)(+=._-]+/g, "");
        this.setState({
            [name]: value
        });
    }

    searchCliente = () => {
        AvaliacaoService.getCliente(this.state.nomePesquisa)
            .then(response => {
                this.setState({
                    idCliente: response.data.id,
                    nome: response.data.nome,
                    cpf: response.data.cpf,
                    endereco: {
                        cep: response.data.endereco.cep,
                        logradouro: response.data.endereco.logradouro,
                        bairro: response.data.endereco.bairro,
                        cidade: response.data.endereco.cidade,
                        uf: response.data.endereco.uf,
                        complemento: response.data.endereco.complemento
                    },
                    auditoria: {
                        operador: response.data.auditoria.operador
                    },
                    telefones: response.data.telefones,
                    emails: response.data.emails,
                    found: true,
                    fullForm: true
                });
                // console.log(response.data);
            }).catch(e => {
                this.setState({ found: false })
                console.log(e) // :..-(
            })
            this.setState({ searchEvent: true })
    }

    updateCliente() {     
        if (!this.validator()) return;  // :..-(
        AvaliacaoService.update(this.state.idCliente, this.state)
            .then(response => {
                alert("CLIENTE ATUALIZADO");
                console.log(response.data);
            }).catch(e => {
                console.log(e) // :..-(
            })
    }

    deleteCliente() {       
        AvaliacaoService.delete(this.state.idCliente)
            .then(response => {
                alert("EXCLUÍDO COM SUCESSO.");
                this.setState({ found: false });                
            }).catch(e => {
                console.log(e) // :..-(
            })
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
        // this.checkBlank(obj);
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
        // this.checkBlank(obj);
        
        if (value !== undefined && !value.includes("@") && value.length > 0) {
            // e.tabIndex="0";
            e.focus();
            e.style.display = "block";
            return;
        }
        e.style.display = "none";
    }

    validator() {
        let e = document.getElementById("nome");
        if (e.value.length > 0 && e.value.length < 4) return false; // :..-(

        if (this.state.telefones.length === 0) {
            alert("INSIRA PELO MENOS 1 TELEFONE");
            return false;
        }

        if (this.state.emails.length === 0) {
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
        let list = this.state.telefones;        
        list.push({tipo: this.state.tmpTpPhone, numero: e.value });
        this.setState({
            telefones: list
        })
    }

    addEmail = () => {
        let e = document.getElementById("tmpEmail");        
        let list = this.state.emails;        
        list.push({email: e.value });
        this.setState({
            emails: list
        })
    }

    checkBlank = (obj) => {
        let { name, value } = obj.target;
        let e = document.getElementById("error"+name);
        let fields = [
            "nome",
            "cpf",
            // "tmpTelefone",
            // "tmpEmail",
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
        const { nome, found, tipoTelefone, tmpEmail,
            nomePesquisa, cpf, searchEvent, endereco, telefones, emails, tmpTelefone } = this.state;

        return(
            <div className="list_row">
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input 
                            type="text"
                            className="form-control"
                            style={styleInput}
                            placeHolder="Digite o nome..." 
                            name="nomePesquisa"
                            value={nomePesquisa}
                            onChange={value => this.onChangeHandler(value)}
                        />
                        <div className="input-group-append">
                            <button 
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={this.searchCliente}>
                                    Pesquisar
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    {found ? (
                        <div className="edit-form">
                            <h3 style={styleTitulo}>Informações do Cliente</h3>
                            <h8 style={styleWarning} id="lblWarning">
                                Aviso: Informe de 3 a 100 caracteres para o NOME
                            </h8>
                            <div id="errornome" style={styleError}></div>
                            <input
                                type="text"
                                className="form-control"
                                style={styleInput}
                                name="nome"
                                id="nome"
                                placeHolder="Nome"
                                maxLength="100"                                
                                value={nome}
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
                                <Select options={tipoTelefone}/>
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
                            <TablePhone items={telefones}/>

                            <h8 style={styleWarning} id="warningEmail">
                                E-mail inválido.
                            </h8>
                            <div id="errortmpEmail" style={styleError}></div>
                            <div className="input-group mb-1">
                                <input
                                    type="text"
                                    className="form-control"
                                    style={styleMediumInput}
                                    name="tmpEmail"
                                    id="tmpEmail"
                                    placeHolder="E-MAIL"
                                    value={tmpEmail}
                                    onBlur={tmpEmail => this.checkEmail(tmpEmail)}
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
                            <TableEmail items={emails}/>                          

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

                            <button
                                className="btn btn-success" style={styleButton}
                                onClick={this.updateCliente} 
                                disabled={found === false || !this.state.fullForm}>
                                Atualizar
                            </button>

                            <button
                                className="btn btn-warning" style={styleButton}
                                onClick={this.deleteCliente} 
                                disabled={found === false || !this.state.fullForm}>
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
const styleWarning = {
    color: "orange", 
    display: "none"   
}
const styleError = {
    color: "red",
    fontSize:13,
    marginBottom: 2
}
const styleMessage = {
    addingTop: 10,
    color: "#0d6efd",
    fontSize:20,    
}


