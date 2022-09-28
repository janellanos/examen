import axios from "axios";

const url = "http://localhost:9090/api/v1.0/candidato";

export class CandidatoService {
    getCandidato() {
        return axios.get(url).then((res) => res.data.result);
    }
    postCandidato(data) {
        return axios.post(url, data);
    }
    updateCandidato(data) {
        return axios.put(url, data);
    }
    deleteCandidato(data) {
        return axios.delete(url, data);
    }
}
