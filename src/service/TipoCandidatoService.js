import axios from "axios";

const url = "http://localhost:9090/api/v1.0/tipoCandidato/";

export class TipoCandidatoService {
    getTipoCandidato() {
        return axios.get(url).then((res) => res.data.result);
    }
    postTipoCandidato(data) {
        return axios.post(url, data);
    }
    updateTipoCandidato(data) {
        return axios.put(url, data);
    }
    deleteTipoCandidato(data) {
        return axios.delete(url, data);
    }
}
