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
            tmpTpPhone: "",
            telefone: [],
            tmpEmail: "",
            email: [],
            tipoTelefone: [
                { value : "residencial", label: "Residencial" },
                { value : "comercial", label: "Comercial" },
                { value : "celular", label: "Celular" }
            ],
            operador: "",
            found: true,
            searchEvent: false
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
        if (!this.validator()) return;  
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
        let { value } = obj.target;
        let e = document.getElementById("warningEmail");
        if (value !== undefined && !value.includes("@") && value.length > 0) {
            e.tabIndex="0";
            e.focus();
            e.style.display = "block";
            return;
        }
        e.style.display = "none";
    }

    validator() {
        let e = document.getElementById("nomeCliente");
        if (e.value.length > 0 && e.value.length < 4) return false;

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
        list.push({endereco: e.value });
        this.setState({
            email: list
        })
    }

    render() {
        const { nomeCliente, cliente, found, tipoTelefone, tmpEmail,
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
                                onClick={this.searchCliente}>
                                    Pesquisar
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    {cliente ? (
                        <div className="edit-form">
                            <h3 style={styleTitulo}>Informações do Cliente</h3>
                            <h8 style={styleWarning} id="lblWarning">
                                Aviso: Informe de 3 a 100 caracteres para o NOME
                            </h8>
                            <input
                                type="text"
                                className="form-control"
                                style={styleInput}
                                name="nomeCliente"
                                id="nomeCliente"
                                placeHolder="Nome"
                                required
                                maxLength="100"                                
                                value={nomeCliente}
                                onBlur={value => this.checkMinLength(value)}
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
                                required
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
                            <div className="input-group mb-1">
                                <input
                                    type="text"
                                    className="form-control"
                                    style={styleMediumInput}
                                    name="tmpEmail"
                                    id="tmpEmail"
                                    placeHolder="E-MAIL"
                                    required
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
                                onBlur={value => this.getCep(value)}
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
const styleWarning = {
    color: "orange", 
    display: "none"   
}




