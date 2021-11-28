import http from "../http-common";

class ClienteService {
    getCliente(nome) {
        return http.get(`/clientes/${nome}`)
    }

    create(data){
        return http.post("/clientes", data);
    }

    update(id, data) {
        return http.put(`/clientes/${id}`, data);
    }

    delete(id) {
        return http.delete(`/clientes/${id}`);
    }
    validarUsuario(login, senha) {
        return http.get(`/clientes/${login}/${senha}`)
    }
}

export default new ClienteService();