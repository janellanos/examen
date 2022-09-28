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
import { Blob } from "react-blob";

import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { ListaService } from "../service/ListaService";
import { ProcesoService } from "../service/ProcesoService";
import { Image } from "primereact/image";

const Lista = () => {
    let emptyLista = {
        id: null,
        logo: "",
        nombre: "",
        activo: false,
        procesoeleccion: null,
    };

    const [procesoSeleccionado, setProcesoSeleccionado] = useState(null);

    const [listas, setListas] = useState(null);
    const [listasDialog, setListasDialog] = useState(false);
    const [listaDialog, setListaDialog] = useState(false);

    const [proceso, setProceso] = useState(null);
    const [procesos, setProcesos] = useState(null);

    const [deleteListaDialog, setDeleteListaDialog] = useState(false);
    const [deleteListasDialog, setDeleteListasDialog] = useState(false);

    const [lista, setLista] = useState(emptyLista);

    const [activo, setActivo] = useState(false);
    const [logo, setLogo] = useState("");

    const [selectedlistas, setSelectedListas] = useState(null);

    const [submitted, setSubmitted] = useState(false);

    const [active, setActive] = useState(false);

    const [institucion, setinstitucion] = useState(null);

    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const listaService = new ListaService();
        listaService.getLista().then((data) => setListas(data));

        const procesoService = new ProcesoService();
        procesoService.getProcesos().then((data) => setProcesos(data));
    }, []);

    const openNew = () => {
        setLista(emptyLista);
        setLogo("");
        setProcesoSeleccionado(null);
        setActivo(false);
        setSubmitted(false);
        setListasDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setListasDialog(false);
        setSubmitted(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteListaDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteListasDialog(false);
    };
    const saveLista = () => {
        setSubmitted(true);
        if (lista.nombre.trim()) {
            let _listas = [...listas];
            let _lista = { ...lista };
            if (lista.id) {
                const index = findIndexById(lista.id);

                _listas[index] = _lista;

                const listaServicio = new ListaService();
                const newEstado = {
                    ..._lista,
                    logo: logo,
                    activo: activo,
                    procesoeleccion: procesoSeleccionado,
                };
                listaServicio.updateLista(newEstado).then(() => {
                    listaServicio.getLista().then((data) => setListas(data));
                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Lista Actualizada",
                        life: 3000,
                    });
                });
            } else {
                const listaServicio = new ListaService();
                const newEstado = {
                    ..._lista,
                    logo: logo,
                    activo: activo,
                    procesoeleccion: procesoSeleccionado,
                };
                listaServicio.postLista(newEstado).then(() => {
                    listaServicio.getLista().then((data) => setListas(data));
                    toast.current.show({
                        severity: "success",
                        summary: "Successful",
                        detail: "Lista Creada",
                        life: 3000,
                    });
                });
            }

            setListas(_listas);
            setListasDialog(false);
            setLista(emptyLista);
        }
    };
    const editProduct = (product) => {
        setLista({ ...product });
        setLogo(product.logo);
        setProcesoSeleccionado(product.procesoeleccion);
        setActivo(product.activo);
        setListasDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setLista(product);
        setDeleteListaDialog(true);
    };

    const deleteProduct = () => {
        const liService = new ListaService();
        liService.deleteLista(listas.id);

        let _listas = listas.filter((val) => val.id !== listas.id);
        setLista(_listas);
        setDeleteListaDialog(false);
        setLista(emptyLista);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Lista Deleted",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < listas.length; i++) {
            if (listas[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const deleteSelectedProducts = () => {
        const listaService = new ListaService();
        let _listas;
        selectedlistas.map((res) =>
            listaService.deleteLista(res.id).then((res) => {
                if (res === 500) {
                    toast.current.show({ severity: "error", summary: "Error Message", detail: "listas no eliminadas", life: 3000 });
                } else {
                    _listas = listas.filter((val) => !selectedlistas.includes(val));
                    setListas(_listas);
                    setSelectedListas(null);
                    toast.current.show({ severity: "success", summary: "Successful", detail: "listas eliminadas", life: 3000 });
                }
            })
        );
        setDeleteListasDialog(false);
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...lista };
        _product[`${nombre}`] = val;

        setLista(_product);
    };

    const onEmpresaChange = (e) => {
        setProcesoSeleccionado(e.value);
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
        blobToImage(rowData.logo);
        return (
            <>
                <span className="p-column-title">logo</span>
                <img src={blobToImage(rowData.logo).src} alt={rowData.imagen} className="shadow-2" width="80" />
            </>
        );
    };

    const nombreBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">nombre</span>
                {rowData.nombre}
            </>
        );
    };

    const procesoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">proceso</span>
                {rowData.procesoeleccion.nombreproceso}
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
        setLogo("");
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
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveLista} />
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
            setLogo(base64data);
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
                        value={listas}
                        selection={selectedlistas}
                        onSelectionChange={(e) => setSelectedListas(e.value)}
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
                        <Column field="logo" header="logo" body={logoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="proceso" header="proceso" body={procesoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={listasDialog} style={{ width: "450px" }} header="Votante" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nombre">Nombre </label>
                            <InputText id="nombre" value={lista.nombre} onChange={(e) => onInputChange(e, "nombre")} required autoFocus />
                        </div>
                        <div className="field">
                            <label htmlFor="logo">Logo </label>
                            <FileUpload id="logo" name="logo" accept="image/*" onSelect={(e) => onImageChange(e, "logo")} mode="basic" />
                        </div>
                        <div className="field">
                            <h6>Activo</h6>
                            <InputSwitch checked={activo} onChange={(e) => setActivo(e.value)} color="primary" name="status" />
                        </div>

                        <div className="field">
                            <label htmlFor="proceso">Proceso</label>
                            <Dropdown
                                value={procesoSeleccionado}
                                options={procesos}
                                onChange={onEmpresaChange}
                                optionLabel="nombreproceso"
                                placeholder="Seleccione un Proceso"
                                required
                                className={classNames({
                                    "p-invalid": submitted && !lista.procesoeleccion,
                                })}
                            />
                            {submitted && !lista.procesoeleccion && <small className="p-invalid">La empresa es necesaria.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteListaDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {listas && (
                                <span>
                                    Are you sure you want to delete <b>{listas.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteListasDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {listas && <span>Are you sure you want to delete the selected products?</span>}
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

export default React.memo(Lista, comparisonFn);
