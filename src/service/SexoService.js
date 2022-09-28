import axios from "axios";

const url = "http://localhost:9090/api/v1.0/sexo/";
export class SexoService {
    /*
    getSexo( state) {
        return axios
            .get(url )
            .then((res) => {
                state(res.data.result);
                const data = res.data.result;
                return data;
            })
            .catch(function (error) {
                if (error.response) {
                    return error.response.status;
                }
            });
    }*/

    //     getSexo(state) {
    //         return axios
    //             .get(url)
    //             .then((res) => {
    //                 if (res.data.success) {
    //                     state(res.data.result);
    //                     return res.data.result;
    //                 }
    //             })
    //             .catch(function (error) {
    //                 if (error.response) {
    //                     return error.response.status;
    //                 }
    //             });
    //     }

    //     updateSexo(data) {
    //         return axios.put(url, data).catch(function (error) {
    //             if (error.response) {
    //                 return error.response.status;
    //             }
    //         });
    //     }

    //     postSexo(data) {
    //         return axios.post(url, data).catch(function (error) {
    //             if (error.response) {
    //                 return error.response.status;
    //             }
    //         });
    //     }
    // }

    getSexo() {
        return axios.get("http://localhost:9090/api/v1.0/sexo/").then((res) => res.data.result);
    }

    putSexo(sx) {
        return axios.get("http://localhost:9090/api/v1.0/sexo/"), sx;
    }
    postSexo(sex) {
        return axios.get("http://localhost:9090/api/v1.0/sexo/"), sex;
    }

    deleteSexo(id) {
        return axios.get("http://localhost:9090/api/v1.0/sexo/+id");
    }
}
