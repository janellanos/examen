import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { SexoService } from "../service/SexoService";

const CrudSexo = () => {
    let emptyProduct = {
        id: null,
        nombre: "",
    };

    const [sexos, setSexos] = useState(null);
    const [sexosDialog, setSexosDialog] = useState(false);
    const [deleteSexoDialog, setDeleteSexoDialog] = useState(false);
    const [deleteSexosDialog, setDeleteSexosDialog] = useState(false);

    const [sexo, setSexo] = useState(emptyProduct);

    const [selectedSexo, setSelectedSexos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const sexService = new SexoService();
        sexService.getSexo().then((data) => setSexos(data));
    }, []);

    const openNew = () => {
        setSexo(emptyProduct);
        setSubmitted(false);
        setSexosDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSexosDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteSexoDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteSexosDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (sexo.nombre.trim()) {
            let _products = [...sexos];
            let _product = { ...sexo };
            if (sexo.id) {
                const index = findIndexById(sexo.id);

                _products[index] = _product;
                const sexoservice = new SexoService();
                sexoservice.putSexo(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Updated",
                    life: 3000,
                });
            } else {
                const sexoService = new SexoService();
                sexoService.postSexo(_product);
                /*   _product.id = createId();
                  _product.image = "product-placeholder.svg";
                _products.push(_product);*/

                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Product Created",
                    life: 3000,
                });
            }

            setSexo(_products);
            setSexosDialog(false);
            setSexo(emptyProduct);
        }
    };

    const editProduct = (product) => {
        setSexos({ ...product });
        setSexosDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setSexo(product);
        setDeleteSexoDialog(true);
    };

    const deleteProduct = () => {
        let _products = sexos.filter((val) => val.id !== sexos.id);
        setSexo(_products);
        setDeleteSexoDialog(false);
        setSexo(emptyProduct);
        const sexService = new SexoService();
        sexService.deleteSexo(sexos.id);

        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Product Deleted",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < sexos.length; i++) {
            if (sexos[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const deleteSelectedProducts = () => {
        let _products = sexos.filter((val) => !selectedSexo.includes(val));
        setDeleteSexoDialog(_products);
        setDeleteSexoDialog(false);
        setSelectedSexos(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Products Deleted",
            life: 3000,
        });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...sexos };
        _product[`${name}`] = val;

        setSexo(_product);
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

    const codeBodyTemplate = (rowData) => {
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

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Sexo</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
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
                        value={sexos}
                        selection={selectedSexo}
                        onSelectionChange={(e) => setSelectedSexos(e.value)}
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
                        <Column field="id" header="Id" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={nombreBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={sexosDialog} style={{ width: "450px" }} header="Provincia" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre </label>
                            <InputText
                                id="nombre"
                                value={sexo.nombre}
                                onChange={(e) => onInputChange(e, "nombre")}
                                required
                                autoFocus
                                className={classNames({
                                    "p-invalid": submitted && !sexos.nombre,
                                })}
                            />
                            {submitted && !sexos.nombre && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                    </Dialog>
                    <Dialog visible={deleteSexoDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {sexos && (
                                <span>
                                    Are you sure you want to delete <b>{sexos.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSexosDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {sexos && <span>Are you sure you want to delete the selected products?</span>}
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

export default React.memo(CrudSexo, comparisonFn);
