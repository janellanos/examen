import axios from "axios";

const url = "http://localhost:9090/api/v1.0/lista/";

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token === "" || token === null) {
            return config;
        } else {
            config.headers["Authorization"] = `Bearer ${token}`;
            return config;
        }
    },
    (error) => {
        Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export class ListaService {
    getLista() {
        return axios.get(url).then((res) => res.data.result);
    }
    postLista(data) {
        return axios.post(url, data);
    }
    updateLista(data) {
        return axios.put(url, data);
    }
    deleteLista(data) {
        return axios.delete(url, data);
    }
    getUnaLista(data) {
        return axios.get(url + data + "/buscar");
    }
}
