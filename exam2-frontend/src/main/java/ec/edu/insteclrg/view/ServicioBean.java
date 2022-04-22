package ec.edu.insteclrg.view;

import java.util.List;

import javax.annotation.PostConstruct;

import org.primefaces.PrimeFaces;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import ec.edu.insteclrg.common.MensajesTipo;
import ec.edu.insteclrg.dto.ApiResponseDTO;
import ec.edu.insteclrg.dto.ServicioDTO;
import ec.edu.insteclrg.dto.ServicioDTO;
import ec.edu.insteclrg.handler.CategoriaHandler;
import ec.edu.insteclrg.handler.ServicioHandler;
import ec.edu.insteclrg.utils.Mensajes;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@Scope("view")
public class ServicioBean {


	private long id;

	private ServicioDTO servicioDTO;

	private ServicioHandler handler;

	private List<ServicioDTO> registros;

	private ServicioDTO selectedProduct;

	private List<ServicioDTO> selectedProducts;

	private String idBuscar;

	@PostConstruct
	public void init() {
		servicioDTO = new ServicioDTO();
		handler = new ServicioHandler();
		cargarTodosRegistros();
	}

	private void cargarTodosRegistros() {
		ApiResponseDTO<List<ServicioDTO>> response = handler.buscarTodo();
		ObjectMapper mapper = new ObjectMapper();
		if (response.isSuccess())
			this.registros = mapper.convertValue(response.getResult(), new TypeReference<List<ServicioDTO>>() {
			});
	}

	public void openNew() {
		this.selectedProduct = new ServicioDTO();
	}

	public void saveProduct() {
		if (this.selectedProduct.getId() == 0) {
			ApiResponseDTO<ServicioDTO> response = handler.guardar(selectedProduct);
			if (response.isSuccess()) {
			
			Mensajes.addMsg(MensajesTipo.ERROR, "Error: no se pudo guardar");
			} else
			
				Mensajes.addMsg(MensajesTipo.INFORMACION, "Guardado correctamente");
				cargarTodosRegistros();
		} else {
			ApiResponseDTO<ServicioDTO> response = handler.actualizar(selectedProduct);
			if (response.isSuccess()) {
				Mensajes.addMsg(MensajesTipo.INFORMACION, "Actualizado correctamente");
			} else
				Mensajes.addMsg(MensajesTipo.ERROR, "Error: no se pudo actualizar");
		}
		PrimeFaces.current().executeScript("PF('manageProductDialog').hide()");
		PrimeFaces.current().ajax().update("frm:growl", "frm:dt-products");
	}

	public void deleteProduct() {
		ApiResponseDTO<ServicioDTO> response = handler.eliminar(selectedProduct.getId());
		this.registros.remove(this.selectedProduct);
		this.selectedProduct = null;
		Mensajes.addMsg(MensajesTipo.INFORMACION, "Eliminado correctamente");
		PrimeFaces.current().ajax().update("frm:growl", "frm:dt-products");
	}

	public void deleteSelectedProducts() {
		for (int i = 0; i < this.selectedProducts.size(); i++) {
			ApiResponseDTO<ServicioDTO> response = handler.eliminar(this.selectedProducts.get(i).getId());
			if (!response.isSuccess()) {
				Mensajes.addMsg(MensajesTipo.INFORMACION, "Registros no eliminados");
			}
		}

		this.registros.removeAll(this.selectedProducts);
		this.selectedProducts = null;
		Mensajes.addMsg(MensajesTipo.INFORMACION, "Registros eliminados correctamente");
		PrimeFaces.current().ajax().update("frm:growl", "frm:dt-products");
		PrimeFaces.current().executeScript("PF('dtProducts').clearFilters()");
	}

	public String getDeleteButtonMessage() {
		if (hasSelectedProducts()) {
			int size = this.selectedProducts.size();
			return size > 1 ? size + " registros seleccionados" : "1 registro seleccionado";
		}
		return "Eliminar";
	}

	public boolean hasSelectedProducts() {
		return this.selectedProducts != null && !this.selectedProducts.isEmpty();
	}

	public void buscarPorId() {
		
		System.err.print(""+this.selectedProduct.getId());
	//	ApiResponseDTO<ServicioDTO> response=handler.buscarPorId(this.selectedProduct.getId());
		Mensajes.addMsg(MensajesTipo.INFORMACION, "TODO: SE DEBE CODIFICAR");
		cargarTodosRegistros();
		PrimeFaces.current().ajax().update("frm:growl", "frm:dt-products");
		PrimeFaces.current().executeScript("PF('dtProducts').clearFilters()");
	}
}
