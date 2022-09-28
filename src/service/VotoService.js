import axios from "axios";

const url = "http://localhost:9090/api/v1.0/voto";

export class VotoService {
    postVoto(data) {
        return axios.post(url, data);
    }
    updateVoto(data) {
        return axios.put(url, data);
    }
    deleteVoto(data) {
        return axios.delete(url, data);
    }
    getConteoVoto() {
        return axios.get(url + "/conteo");
    }
}
