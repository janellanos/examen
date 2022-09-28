import axios from "axios";
const url = "http://localhost:9090/api/v1.0/usuario/";
const url2 = "http://localhost:9090/api/v1.0/credenciales";
export class UsuarioService {
    getUsuarios() {
        return axios.get(url).then((res) => res.data.result);
    }
    postUsuarios(data) {
        return axios.post(url, data);
    }
    updateUsuarios(data) {
        return axios.put(url, data);
    }
    deleteUsuarios(data) {
        return axios.delete(url, data);
    }
    postLogin(data) {
        return axios.post(url2, data);
    }
    getLogin() {
        return axios.get(url2);
    }
    getLogin2() {
        return axios.get(url2).then((result) => {
            localStorage.setItem("rol2", result.data.rol.name);
        });
    }
}
