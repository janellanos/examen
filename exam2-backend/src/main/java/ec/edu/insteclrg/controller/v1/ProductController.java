package ec.edu.insteclrg.controller.v1;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ec.edu.insteclrg.domain.Categoria;
import ec.edu.insteclrg.domain.Producto;
import ec.edu.insteclrg.dto.ApiResponseDTO;
import ec.edu.insteclrg.dto.CategoriaDTO;
import ec.edu.insteclrg.dto.ProductoDTO;
import ec.edu.insteclrg.persistence.ProductRepository;
import ec.edu.insteclrg.dto.ProductoDTO;
import ec.edu.insteclrg.service.crud.CategoryService;
import ec.edu.insteclrg.service.crud.ProductService;

@RestController
@RequestMapping("/v1.0/producto")
public class ProductController {

	@Autowired
	ProductService service;

	@Autowired
	ProductRepository repository;

	@PostMapping(path = "/guardar")
	public ResponseEntity<Object> guardar(@RequestBody ProductoDTO dto) {
		service.guardar(dto);
		return new ResponseEntity<>(new ApiResponseDTO<>(true, "guardado"), HttpStatus.CREATED);
	}

	@PutMapping(path = "/actualizar")
	public ResponseEntity<Object> actualizar(@RequestBody ProductoDTO dto) {
		service.actualizar(dto);
		return new ResponseEntity<>(new ApiResponseDTO<>(true, "actualizado"), HttpStatus.CREATED);
	}

	@GetMapping(path = "/listar")
	public ResponseEntity<Object> listar() {
		List<ProductoDTO> list = service.buscarTodo(new ProductoDTO());
		if (!list.isEmpty()) {
			ApiResponseDTO<List<ProductoDTO>> response = new ApiResponseDTO<>(true, list);
			return (new ResponseEntity<Object>(response, HttpStatus.OK));
		} else {
			return new ResponseEntity<>(new ApiResponseDTO<>(false, " ok  "), HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping(path = "/{id}/buscar")
	public ResponseEntity<Object> buscar(@PathVariable Long id) {
		ProductoDTO dto = new ProductoDTO();
		dto.setId(id);
		Optional<Producto> domain = service.buscar(dto);
		if (!domain.isEmpty()) {
			dto = service.mapearDTO(domain.get());
			return new ResponseEntity<>(new ApiResponseDTO<>(true, dto), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new ApiResponseDTO<>(false, " ok "), HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping(path = "/{id}/eliminar")
	public ResponseEntity<Object> eliminar(@PathVariable Long id) {
		ProductoDTO dto = new ProductoDTO();
		dto.setId(id);
		service.eliminar(dto);
		return new ResponseEntity<>(new ApiResponseDTO<>(true, "eliminado "), HttpStatus.CREATED);
	}

}