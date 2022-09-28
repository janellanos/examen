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
import { ProcesoService } from "../service/ProcesoService";
import { UsuarioService } from "../service/UsuarioService";
import { TipoCandidatoService } from "../service/TipoCandidatoService";
import { CandidatoService } from "../service/CandidatoService";
import { Image } from "primereact/image";

const CrudCandidato = () => {
    let emptyCandidato = {
        id: null,
        usuario: null,
        tipoCandidato: null,
        lista: null,
        procesoEleccion: null,
        imagen: "",
    };

    const [candidato, setCandidato] = useState(emptyCandidato);
    const [candidatos, setCandidatos] = useState(null);

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

    useEffect(() => {
        const candidatoService = new CandidatoService();
        candidatoService.getCandidato().then((data) => setCandidatos(data));

        const votantesService = new UsuarioService();
        votantesService.getUsuarios().then((data) => setVotantes(data));

        const tiposCandidatoService = new TipoCandidatoService();
        tiposCandidatoService.getTipoCandidato().then((data) => setTipoCandidatos(data));

        const listaService = new ListaService();
        listaService.getLista().then((data) => setListas(data));

        const procesoService = new ProcesoService();
        procesoService.getProcesos().then((data) => setProcesos(data));
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
    const saveCandidato = () => {
        setSubmitted(true);
        let _candidatos = [...candidatos];
        let _candidato = { ...candidato };
        if (candidato.id) {
            const index = findIndexById(candidato.id);

            _candidatos[index] = _candidato;

            const candidatoServicio = new CandidatoService();
            const newEstado = {
                ..._candidato,
                lista: listaSeleccionado,
                procesoEleccion: procesoSeleccionado,
                tipoCandidato: tipoCandidatoSeleccionado,
                votante: votanteSeleccionado,
                imagen: imagen,
            };
            candidatoServicio.updateCandidato(newEstado).then(() => {
                candidatoServicio.getCandidato().then((data) => setCandidatos(data));
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Candidato Actualizado",
                    life: 3000,
                });
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
        setImagen(product.imagen);
        setProcesoSeleccionado(product.procesoEleccion);
        setListaSeleccionado(product.lista);
        setTipoCandidatoSeleccionado(product.tipoCandidato);
        setVotanteSeleccionado(product.votante);
        setActivo(product.activo);
        setCandidatosDialog(true);
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

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.id}
            </>
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
                <img src={blobToImage(rowData.imagen).src} alt={rowData.imagen} className="shadow-2" width="80" />
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
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
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveCandidato} />
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
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="imagen" header="Imagen" body={logoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="lista" header="Lista" body={listaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="proceso" header="Proceso" body={procesoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="tipoCandidato" header="Tipo De Candidato" body={tipoCandidatoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="votante" header="Votante" body={votanteBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={candidatosDialog} style={{ width: "450px" }} header="Votante" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="lista">Lista</label>
                            <Dropdown value={listaSeleccionado} options={listas} onChange={onListaChange} optionLabel="nombre" placeholder="Seleccione una Lista" required />
                        </div>
                        <div className="field">
                            <label htmlFor="proceso">Proceso</label>
                            <Dropdown value={procesoSeleccionado} options={procesos} onChange={onProcesoChange} optionLabel="nombreproceso" placeholder="Seleccione un Proceso" required />
                        </div>
                        <div className="field">
                            <label htmlFor="tipoCandidato">Tipo de Candidato</label>
                            <Dropdown value={tipoCandidatoSeleccionado} options={tipoCandidatos} onChange={onTipoCandidatoChange} optionLabel="nombre" placeholder="Seleccione un Tipo de Candidato" required />
                        </div>
                        <div className="field">
                            <label htmlFor="votante">Votante</label>
                            <Dropdown value={votanteSeleccionado} options={votantes} onChange={onVotanteChange} optionLabel="nombre" placeholder="Seleccione un Votante" required />
                        </div>
                        <div className="field">
                            <label htmlFor="imagen">Imagen </label>
                            <FileUpload id="imagen" name="imagen" accept="image/*" onSelect={(e) => onImageChange(e, "imagen")} mode="basic" />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCandidatoDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {candidatos && (
                                <span>
                                    Are you sure you want to delete <b>{candidatos.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCandidatosDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {candidatos && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CrudCandidato, comparisonFn);
