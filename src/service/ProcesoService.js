import axios from "axios";

const url = "http://localhost:9090/api/v1.0/procesoeleccion";
//const config = authHeader();
//const institucion = JSON.parse(localStorage.getItem("institucion"));

export class ProcesoService {
    getProcesos() {
        return axios.get(url).then((res) => res.data.result);
    }
}
