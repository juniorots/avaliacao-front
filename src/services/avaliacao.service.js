import http from "../http-common";

class ClienteService {
    getCliente(id) {
        return http.get("/clientes/{id}")
    }

    create(data){
        return http.post("/clientes", data);
    }

    update(id, data) {
        return http.put("/clientes/{id}", data);
    }

    delete(id) {
        return http.delete("/clientes/{id}");
    }
}

export default new ClienteService();