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

const Resultados = () => {
    let emptyCandidato = {
        id: null,
        imagen: null,
        lista: null,
        procesoEleccion: null,
        tipoCandidato: null,
        votante: null,
        conteo: "",
    };

    const [candidato, setCandidato] = useState(emptyCandidato);
    const [candidatos, setCandidatos] = useState(null);
    const [dale, setDale] = useState(emptyCandidato);
    const [listaPresidente, setListaPresidente] = useState(null);
    const [listaVicepresidente, setListaVicepresidente] = useState(null);
    const [candidatosDialog, setCandidatosDialog] = useState(false);
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
        });
        const votoService = new VotoService();
        votoService.getConteoVoto().then((data) => {
            setDale(data.data);
        });
    }, []);

    const hideDialog = () => {
        setSubmitted(false);
        setSubmitted(false);
    };

    const prueba = () => {
        const prueba2 = [];
        console.log("elementos");
        console.log(dale);
        listaPresidente.forEach((element) => {
            dale.forEach((element2) => {
                if (element.lista.id == element2.lista) {
                    let e2 = { ...element, conteo: element2.conteo };
                    prueba2.push(e2);
                }
            });
        });
        console.log(prueba2);
        setCandidatos(prueba2);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Actualizar" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => prueba()} />
                </div>
            </React.Fragment>
        );
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

    const conteoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">proceso</span>
                {rowData.conteo}
            </>
        );
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
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={candidatos}
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
                        <Column field="candidato" header="Total de Votos" body={conteoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
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

export default React.memo(Resultados, comparisonFn);
