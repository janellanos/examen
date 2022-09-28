import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FileUpload } from "primereact/fileupload";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { ListaService } from "../service/ListaService";
import { Splitter, SplitterPanel } from "primereact/splitter";
import { ProcesoService } from "../service/ProcesoService";
import { UsuarioService } from "../service/UsuarioService";
import { TipoCandidatoService } from "../service/TipoCandidatoService";
import { CandidatoService } from "../service/CandidatoService";
import { Image } from "primereact/image";
import { VotoService } from "../service/VotoService";
import { useHistory } from "react-router-dom";

const Voto = () => {
    let emptyCandidato = {
        id: null,
        usuario: null,
        tipoCandidato: null,
        lista: null,
        procesoEleccion: null,
        imagen: "",
    };

    const [candidato, setCandidato] = useState(emptyCandidato);
    const [votante, setVotante] = useState(null);
    const [candidatos, setCandidatos] = useState(null);
    const [listaPresidente, setListaPresidente] = useState(null);
    const [listaVicepresidente, setListaVicepresidente] = useState(null);

    const [listaSeleccionado, setListaSeleccionado] = useState(null);
    const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);
    const [tipoCandidatoSeleccionado, setTipoCandidatoSeleccionado] = useState(null);
    const [votanteSeleccionado, setVotanteSeleccionado] = useState(null);

    const [candidatosDialog, setCandidatosDialog] = useState(false);
    const [votantes, setVotantes] = useState(null);
    const [tipoCandidatos, setTipoCandidatos] = useState(null);
    const [listas, setListas] = useState(null);
    const [procesos, setProcesos] = useState(null);

    const [deleteCandidatoDialog, setDeleteCandidatoDialog] = useState(false);
    const [deleteCandidatosDialog, setDeleteCandidatosDialog] = useState(false);

    const [activo, setActivo] = useState(false);
    const [imagen, setImagen] = useState("");

    const [selectedCandidatos, setSelectedCandidatos] = useState(null);

    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const redirect = useHistory();

    useEffect(() => {
        const candidatoService = new CandidatoService();
        candidatoService.getCandidato().then((data) => {
            const listap = data.filter((x) => x.tipoCandidato.nombre === "Presidente");
            setListaPresidente(listap);

            const usuarioService = new UsuarioService();
            const result2 = usuarioService.getLogin();
            result2.then((result) => {
                setVotante(result.data);
            });
        });

        const tiposCandidatoService = new TipoCandidatoService();
        tiposCandidatoService.getTipoCandidato().then((data) => setTipoCandidatos(data));

        const listaService = new ListaService();
        listaService.getLista().then((data) => setListas(data));
    }, []);

    const openNew = () => {
        setCandidato(emptyCandidato);
        setImagen("");
        setProcesoSeleccionado(null);
        setListaSeleccionado(null);
        setTipoCandidatoSeleccionado(null);
        setVotanteSeleccionado(null);
        setActivo(false);
        setSubmitted(false);
        setCandidatosDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setCandidatosDialog(false);
        setSubmitted(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteCandidatoDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteCandidatosDialog(false);
    };
    const saveVoto = () => {
        setSubmitted(true);
        let _candidatos = {};
        let _candidato = { ...candidato };
        if (candidato.id) {
            console.log(_candidato);
            const fecha = new Date().toISOString().slice(0, 19).replace("T", " ");
            const fecha2 = new Date(fecha);
            const votoService = new VotoService();
            const { accountNonLocked, authorities, credentialsNonExpired, enabled, username, ...resto } = votante;
            const newEstado = {
                fechaRegistro: fecha2,
                lista: _candidato.lista,
                procesoEleccion: _candidato.procesoEleccion,
                votante: resto,
            };
            votoService.postVoto(newEstado).then(() => {});

            const votantesServicio = new UsuarioService();
            const newEstado2 = {
                ...resto,
                activo: true,
            };
            votantesServicio.updateUsuarios(newEstado2).then(() => {
                redirect.push("/salir");
            });
        } else {
            const candidatoServicio = new CandidatoService();
            const newEstado = {
                ..._candidato,
                lista: listaSeleccionado,
                procesoEleccion: procesoSeleccionado,
                tipoCandidato: tipoCandidatoSeleccionado,
                votante: votanteSeleccionado,
                imagen: imagen,
            };
            candidatoServicio.postCandidato(newEstado).then(() => {
                candidatoServicio.getCandidato().then((data) => setCandidatos(data));
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Candidato Creado",
                    life: 3000,
                });
            });
        }

        setCandidatos(_candidatos);
        setCandidatosDialog(false);
        setCandidato(emptyCandidato);
    };
    const editProduct = (product) => {
        setCandidato({ ...product });
        setCandidatosDialog(true);
        const candidatoService = new CandidatoService();
        candidatoService.getCandidato().then((data) => {
            const listavp = data.filter((x) => x.tipoCandidato.nombre === "Vicepresidente");
            const l1 = listavp.filter((x) => x.lista.nombre === product.lista.nombre);
            setListaVicepresidente(l1[0]);
        });
    };

    const confirmDeleteProduct = (product) => {
        setCandidato(product);
        setDeleteCandidatoDialog(true);
    };

    const deleteProduct = () => {
        const liService = new ListaService();
        liService.deleteLista(candidatos.id);

        let _listas = candidatos.filter((val) => val.id !== candidatos.id);
        setCandidato(_listas);
        setDeleteCandidatoDialog(false);
        setCandidato(emptyCandidato);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Lista Deleted",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < candidatos.length; i++) {
            if (candidatos[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const deleteSelectedProducts = () => {
        const listaService = new ListaService();
        let _listas;
        selectedCandidatos.map((res) =>
            listaService.deleteLista(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "listas no eliminadas", life: 3000 });
                } else {
                    _listas = candidatos.filter((val) => !selectedCandidatos.includes(val));
                    setCandidatos(_listas);
                    setSelectedCandidatos(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "listas eliminadas", life: 3000 });
                }
            })
        );
        setDeleteCandidatosDialog(false);
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...candidato };
        _product[`${nombre}`] = val;

        setCandidato(_product);
    };

    const onProcesoChange = (e) => {
        setProcesoSeleccionado(e.value);
    };

    const onListaChange = (e) => {
        setListaSeleccionado(e.value);
    };
    const onTipoCandidatoChange = (e) => {
        setTipoCandidatoSeleccionado(e.value);
    };

    const onVotanteChange = (e) => {
        setVotanteSeleccionado(e.value);
    };

    const blobToImage = (blob) => {
        let imagen = new Image();
        imagen.src = `data:image/jpg;base64,${blob}`;
        return imagen;
    };

    const logoBodyTemplate = (rowData) => {
        blobToImage(rowData.imagen);
        return (
            <>
                <span className="p-column-title">logo</span>
                <img src={blobToImage(rowData.imagen).src} alt={rowData.imagen} className="shadow-2" width="100" />
            </>
        );
    };
    const imagenBodyTemplate = (rowData) => {
        blobToImage(rowData.imagen);
        return (
            <>
                <span className="p-column-title">logo</span>
                <img src={blobToImage(rowData.lista.logo).src} alt={rowData.imagen} className="shadow-2" width="100" />
            </>
        );
    };

    const listaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">nombre</span>
                {rowData.lista.nombre}
            </>
        );
    };

    const tipoCandidatoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">nombre</span>
                {rowData.tipoCandidato.nombre}
            </>
        );
    };

    const votanteBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">nombre</span>
                {rowData.votante.nombre}
            </>
        );
    };

    const procesoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">proceso</span>
                {rowData.procesoEleccion.nombreproceso}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-send" onClick={() => editProduct(rowData)} label="Votar" />
            </div>
        );
    };

    const onCancel = () => {
        setImagen("");
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Lista</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-danger" onClick={hideDialog} />
            <Button label="Votar" icon="pi pi-check" className="p-button-success" onClick={saveVoto} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            const base64data = reader.result;
        };
    };

    const getBase64StringFromDataURL = (dataURL) => dataURL.replace("data:", "").replace(/^.+,/, "");

    const onImageChange = async (e) => {
        const file = e.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            const base64data = getBase64StringFromDataURL(reader.result);
            setImagen(base64data);
        };
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable
                        ref={dt}
                        value={listaPresidente}
                        selection={selectedCandidatos}
                        onSelectionChange={(e) => setSelectedCandidatos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No Lista found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column field="lista" header="Lista" body={listaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="imagen" header="Logo" body={imagenBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="candidato" header="Candidato" body={logoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="tipoCandidato" header="Tipo De Candidato" body={tipoCandidatoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                    </DataTable>

                    <Dialog visible={candidatosDialog} style={{ width: "450px" }} header="Confirmacion" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <h2 className="text-center"> {candidato.lista !== null ? candidato.lista.nombre : ""}</h2>
                        </div>
                        <Splitter className="mb-5">
                            <SplitterPanel className="flex align-items-center justify-content-center">
                                <div className="field-col">
                                    <label htmlFor="proceso">Presidente</label>
                                    <div>
                                        <img src={blobToImage(candidato.imagen).src} alt={candidato.imagen} className="shadow-2" width="100%" />
                                    </div>
                                </div>
                            </SplitterPanel>
                            <SplitterPanel className="flex align-items-center justify-content-center">
                                {" "}
                                <div className="field-col">
                                    <label htmlFor="proceso">Vicepresidente</label>
                                    <div>
                                        <img src={listaVicepresidente !== null ? blobToImage(listaVicepresidente.imagen).src : ""} className="shadow-2" width="100%" />
                                    </div>
                                </div>
                            </SplitterPanel>
                        </Splitter>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Voto, comparisonFn);
