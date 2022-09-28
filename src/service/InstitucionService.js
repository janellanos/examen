import axios from "axios";

const url = "http://localhost:9090/api/v1.0/institucion/";

export class InstitucionService {
    getInstituciones(ruc, state) {
    //    console.log("xxxxxx")
        return axios
            .get(url)
            .then((res) => {
                state(res.data.result);
                const data = res.data.result;
                console.log(data)
                return data;
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    getInstituciones(state) {
        return axios
            .get(url)
            .then((res) => {
                if (res.data.success) {
                    state(res.data.result);
                    return res.data.result;
                }
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }

    updateInstituciones(data) {
        return axios.put(url, data).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }

    postInstitucion(data) {
        return axios.post(url, data).catch(function (error) {
            if (error.response) {
                return error.response.status;
            }
        });
    }
}
