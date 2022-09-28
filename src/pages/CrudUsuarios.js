import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

import { UsuarioService } from "../service/UsuarioService";
import { InstitucionService } from "../service/InstitucionService";
import { GrupoService } from "../service/GrupoService";
import { SexoService } from "../service/SexoService";

import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { FileUpload } from "primereact/fileupload";
const CrudUsuario = () => {
    let emptyProduct = {
        id: null,
        nombre: "",
        apellido: "",
        cedula: "",
        correo: "",
        celular: "",
        institucion: null,
        grupo: "",
        sexo: "",
        codigo: "",
    };

    const [votantes, setvotantes] = useState(null);
    const [instituciones, setinstituciones] = useState(null);
    const [grupos, setgrupos] = useState(null);
    const [sexos, setsexos] = useState(null);
    const [codigo, setCodigo] = useState("");

    const [institucionesSeleccionada, setinstitucionesSeleccionada] = useState(null);
    const [gruposSeleccionada, setgruposSeleccionada] = useState(null);
    const [sexosSeleccionada, setsexosSeleccionada] = useState(null);
    const [codigoSeleccionada, setCodigoSeleccionada] = useState("");

    const [votantesDialog, setVotantesDialog] = useState(false);
    const [deleteVotanteDialog, setDeleteVotanteDialog] = useState(false);
    const [deleteVotantesDialog, setDeleteVotantesDialog] = useState(false);

    const [votante, setVotante] = useState(emptyProduct);
    const [institucion, setinstitucion] = useState(null);
    const [grupo, setGrupo] = useState(null);
    const [sexo, setSexo] = useState(null);
    const [activo, setActivo] = useState(false);
    const [activeCedula, setActiveCedula] = useState(true);

    const [selectedvotantes, setSelectedvotantes] = useState(null);

    const [submitted, setSubmitted] = useState(false);
    const [submittedInstitucion, setSubmittedInstitucion] = useState(false);
    const [submittedGrupo, setSubmittedGrupo] = useState(false);
    const [submittedSexo, setSubmittedSexo] = useState(false);

    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const data = JSON.parse(window.localStorage.getItem("institucion"));
    useEffect(() => {
        const candService = new UsuarioService();
        candService.getUsuarios().then((data) => setvotantes(data));

        const institucion = new InstitucionService();
        institucion.getInstituciones(setinstituciones);

        const grupo = new GrupoService();
        grupo.getGrupos(setgrupos);

        const sexo = new SexoService();
        sexo.getSexo().then((data) => setsexos(data));
    }, []);

    const openNew = () => {
        setVotante(emptyProduct);
        setinstitucionesSeleccionada(null);
        setgruposSeleccionada(null);
        setsexosSeleccionada(null);
        setSubmittedInstitucion(false);
        setSubmittedGrupo(false);
        setSubmittedSexo(false);

        setVotantesDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSubmittedInstitucion(false);
        setVotantesDialog(false);
        setSubmittedGrupo(false);
        setSubmittedSexo(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteVotanteDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteVotantesDialog(false);
    };

    const saveVotante = () => {
        setSubmitted(true);

        if (votante.nombre.trim()) {
            let _votantes = [...votantes];
            let _votante = { ...votante };
            if (votante.id) {
                const index = findIndexById(votante.id);

                _votantes[index] = _votante;

                const votantesServicio = new UsuarioService();
                const newEstado = {
                    ..._votante,
                    grupo: gruposSeleccionada,
                    institucion: institucionesSeleccionada,
                    sexo: sexosSeleccionada,
                };
                votantesServicio.updateUsuarios(newEstado).then(() => {
                    votantesServicio.getUsuarios().then((data) => setvotantes(data));
                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Usuario Actualizado",
                        life: 3000,
                    });
                });
            } else {
                const votantesServicio = new UsuarioService();
                const newEstado = {
                    ..._votante,
                    grupo: gruposSeleccionada,
                    institucion: institucionesSeleccionada,
                    sexo: sexosSeleccionada,
                    codigo: codigo,
                    activo: true,
                    password: votante.cedula,
                    rol: {
                        id: 2,
                        nombre: "User",
                    },
                };
                votantesServicio
                    .postUsuarios(newEstado)
                    .then(() => {
                        votantesServicio.getUsuarios().then((data) => setvotantes(data));
                        toast.current.show({
                            severity: "success",
                            summary: "Successful",
                            detail: "Usuario Creado",
                            life: 3000,
                        });
                    })
                    .catch((error) => {
                        toast.current.show({
                            severity: "error",
                            summary: "Successful",
                            detail: "El Usuario Ya existe ",
                            life: 3000,
                        });
                    });
            }

            setCodigo("");
            setvotantes(_votantes);
            setVotantesDialog(false);
            setVotante(emptyProduct);
        }
    };

    const editProduct = (votante) => {
        setCodigo(votante.codigo);
        setinstitucionesSeleccionada(votante.institucion);
        setgruposSeleccionada(votante.grupo);
        setsexosSeleccionada(votante.sexo);
        setVotante({ ...votante });
        setVotantesDialog(true);
    };

    const confirmDeleteProduct = (votante) => {
        setVotante(votante);
        setDeleteVotanteDialog(true);
    };

    const deleteProduct = () => {
        const votanteService = new UsuarioService();
        let _votantes;
        votanteService.deleteVotante(votante.id).then((res) => {
            if (res === 500) {
                toast.current.show({ severity: "error", summary: "Error Message", detail: "votante no eliminada", life: 3000 });
            } else if (res === 401) {
                window.localStorage.removeItem("institucion");
            } else {
                _votantes = votantes.filter((val) => val.id !== votante.id);
                setvotantes(_votantes);
                setVotante(emptyProduct);
                toast.current.show({ severity: "success", summary: "Successful", detail: "votante eliminada", life: 3000 });
            }
        });
        setDeleteVotanteDialog(false);
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < votantes.length; i++) {
            if (votantes[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteVotantesDialog(true);
    };

    const deleteSelectedProducts = () => {
        const votanteService = new UsuarioService();
        let _votantes;
        selectedvotantes.map((res) =>
            votanteService.deleteVotante(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "votantes no eliminadas", life: 3000 });
                } else if (res === 401) {
                    window.localStorage.removeItem("institucion");
                } else {
                    _votantes = votantes.filter((val) => !selectedvotantes.includes(val));
                    setvotantes(_votantes);
                    setSelectedvotantes(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "votantes eliminadas", life: 3000 });
                }
            })
        );
        setDeleteVotantesDialog(false);
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...votante };
        _product[`${nombre}`] = val;

        setVotante(_product);
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

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.nombre}
            </>
        );
    };

    const apellidoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">lastname</span>
                {rowData.apellido}
            </>
        );
    };

    const cedulaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">cedula</span>
                {rowData.cedula}
            </>
        );
    };

    const correoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">email</span>
                {rowData.correo}
            </>
        );
    };
    const celularBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">celular</span>
                {rowData.celular}
            </>
        );
    };

    const institucionBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">institucion</span>
                {rowData.institucion.nombre}
            </>
        );
    };

    const grupoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">grupo</span>
                {rowData.grupo.nombre}
            </>
        );
    };
    const sexoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">sexo</span>
                {rowData.sexo.nombre}
            </>
        );
    };

    const codigoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
                {rowData.codigo}
            </>
        );
    };

    const handleCodigo = (e) => {
        const date = new Date();
        const codigo = date.getFullYear() + "" + date.getMonth() + "" + date.getDay() + "" + date.getHours() + "" + date.getMinutes() + "" + date.getSeconds() + "" + date.getMilliseconds();
        setCodigo(codigo);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const onInstitucionChange = (e) => {
        setinstitucionesSeleccionada(e.value);
    };

    const onGrupoChange = (e) => {
        setgruposSeleccionada(e.value);
    };

    const onSexoChange = (e) => {
        setsexosSeleccionada(e.value);
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Votantes</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveVotante} />
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

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={votantes}
                        selection={selectedvotantes}
                        onSelectionChange={(e) => setSelectedvotantes(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="apellido" header="Apellido" body={apellidoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="cedula" header="Cedula" body={cedulaBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="correo" header="Correo" body={correoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="celular" header="Celular" body={celularBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="grupo" header="Grupo" body={grupoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="institucion" header="Institucion" body={institucionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>

                        <Column field="sexo" header="Sexo" body={sexoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="codigo" header="Codigo" body={codigoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={votantesDialog} style={{ width: "450px" }} header="Votante" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre </label>
                            <InputText id="nombre" value={votante.nombre} onChange={(e) => onInputChange(e, "nombre")} required autoFocus />

                            <label htmlFor="name">Apellido </label>
                            <InputText id="apellido" value={votante.apellido} onChange={(e) => onInputChange(e, "apellido")} required autoFocus />

                            <label htmlFor="name">cedula </label>
                            <InputText id="cedula" value={votante.cedula} onChange={(e) => onInputChange(e, "cedula")} required autoFocus />
                            {submitted && !votantes.cedula && <small className="p-invalid">La cedula es requerida.</small>}
                            <label htmlFor="name">Correo </label>
                            <InputText id="correo" value={votante.correo} onChange={(e) => onInputChange(e, "correo")} required autoFocus />
                            <label htmlFor="name">Celular </label>
                            <InputText id="celular" value={votante.celular} onChange={(e) => onInputChange(e, "celular")} required autoFocus />

                            <div className="field ">
                                <label htmlFor="codigo">Codigo--</label>
                                <label htmlFor="codigo">{codigo}</label>
                                <Button label="Gemerar codigo" icon="pi pi-plus" className="p-button-success mr-2" onClick={handleCodigo} />
                            </div>
                            <label htmlFor="votante">Institucion</label>
                            <Dropdown id="name" value={institucionesSeleccionada} required options={instituciones} onChange={onInstitucionChange} optionLabel="nombre" placeholder="Selecione la institucion" />
                        </div>

                        <p />
                        <div>
                            <Dropdown id="name" value={gruposSeleccionada} required options={grupos} onChange={onGrupoChange} optionLabel="nombre" placeholder="Selecione un grupo" className={classNames({ "p-invalid": submittedInstitucion && !grupo.nombre })} />
                            {submittedGrupo && !grupo.nombre && <small className="p-invalid">Es requerido </small>}
                        </div>

                        <p />
                        <div>
                            <Dropdown id="name" value={sexosSeleccionada} required options={sexos} onChange={onSexoChange} optionLabel="nombre" placeholder="Selecione un sexo" className={classNames({ "p-invalid": submittedSexo && !sexo.nombre })} />
                            {submittedSexo && !sexo.nombre && <small className="p-invalid">Es requerido </small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteVotanteDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {votantes && (
                                <span>
                                    Are you sure you want to delete <b>{votantes.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteVotantesDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {votantes && <span>Are you sure you want to delete the selected products?</span>}
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

export default React.memo(CrudUsuario, comparisonFn);
