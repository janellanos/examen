package ec.edu.insteclrg.view;

import java.util.Iterator;
import java.util.List;

import javax.annotation.PostConstruct;

import org.primefaces.PrimeFaces;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import ec.edu.insteclrg.common.MensajesTipo;
import ec.edu.insteclrg.dto.ApiResponseDTO;
import ec.edu.insteclrg.dto.CategoriaDTO;
import ec.edu.insteclrg.dto.ProductoDTO;
import ec.edu.insteclrg.dto.ProductoDTO;
import ec.edu.insteclrg.handler.CategoriaHandler;
import ec.edu.insteclrg.handler.ProductoHandler;
import ec.edu.insteclrg.utils.Mensajes;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
@Scope("view")
public class ProductoBean {

	private long id;

	private ProductoDTO productoDTO;

	private ProductoHandler handler;

	private CategoriaHandler categoriaHandler;

	private List<ProductoDTO> registros;

	private ProductoDTO selectedProduct;

	private List<ProductoDTO> selectedProducts;

	private String idBuscar;

	private List<CategoriaDTO> categorias;

	private String nombre;

	@PostConstruct
	public void init() {
		productoDTO = new ProductoDTO();
		handler = new ProductoHandler();
		Categorias();
		cargarTodosRegistros();
	}

	private void Categorias() {
		categoriaHandler = new CategoriaHandler();
		ApiResponseDTO<List<CategoriaDTO>> response = categoriaHandler.buscarTodo();
		ObjectMapper mapper = new ObjectMapper();
		if (response.isSuccess())
			this.categorias = mapper.convertValue(response.getResult(), new TypeReference<List<CategoriaDTO>>() {
			});
	}

	private void cargarTodosRegistros() {
		ApiResponseDTO<List<ProductoDTO>> response = handler.buscarTodo();
		ObjectMapper mapper = new ObjectMapper();
		if (response.isSuccess())
			this.registros = mapper.convertValue(response.getResult(), new TypeReference<List<ProductoDTO>>() {
			});
	}

	public void openNew() {
		this.selectedProduct = new ProductoDTO();
	}

	public void saveProduct() {
		_Categoria();
		
		if (this.selectedProduct.getId() == 0) {
			
			ApiResponseDTO<ProductoDTO> response = handler.guardar(selectedProduct);
			if (response.isSuccess()) {
			
	
				Mensajes.addMsg(MensajesTipo.ERROR, "Error: no se pudo guardar");
			} else
			
				Mensajes.addMsg(MensajesTipo.INFORMACION, "Guardado correctamente");
			// -------------------------
			cargarTodosRegistros();
		} else {
					
			ApiResponseDTO<ProductoDTO> response = handler.actualizar(selectedProduct);
			if (response.isSuccess()) {
				Mensajes.addMsg(MensajesTipo.INFORMACION, "Actualizado correctamente");
			} else
				Mensajes.addMsg(MensajesTipo.ERROR, "Error: no se pudo actualizar");
		}
		PrimeFaces.current().executeScript("PF('manageProductDialog').hide()");
		PrimeFaces.current().ajax().update("frm:growl", "frm:dt-products");
	}

	private void _Categoria() {
		CategoriaDTO categoriaDTO=new CategoriaDTO();
		long pos = 0;
		
		for (int i = 0; i < categorias.size(); i++) {
		
			if (nombre.equals(categorias.get(i).getNombre())) {
				pos = categorias.get(i).getId();
			}
		}
		categoriaDTO.setNombre(nombre);
		categoriaDTO.setId(pos);
		
		selectedProduct.setCategoria(categoriaDTO);
	}
	
	

	public void deleteProduct() {
		
		ApiResponseDTO<ProductoDTO> response = handler.eliminar(selectedProduct.getId());
		this.registros.remove(this.selectedProduct);
		this.selectedProduct = null;
	
		
		PrimeFaces.current().ajax().update("frm:growl", "frm:dt-products");	
		
		Mensajes.addMsg(MensajesTipo.INFORMACION, "Eliminado correctamente");
		
		cargarTodosRegistros();
	}

	public void deleteSelectedProducts() {
		for (int i = 0; i < this.selectedProducts.size(); i++) {
			ApiResponseDTO<ProductoDTO> response = handler.eliminar(this.selectedProducts.get(i).getId());
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
		
		ApiResponseDTO<ProductoDTO> response=handler.buscarPorId(this.selectedProduct.getId());
		Mensajes.addMsg(MensajesTipo.INFORMACION, "TODO: SE DEBE CODIFICAR");
		PrimeFaces.current().ajax().update("frm:growl", "frm:dt-products");
		PrimeFaces.current().executeScript("PF('dtProducts').clearFilters()");
	}
}
