package ec.edu.insteclrg.controller.v1;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import ec.edu.insteclrg.domain.Categoria;
import ec.edu.insteclrg.dto.ApiResponseDTO;
import ec.edu.insteclrg.dto.CategoriaDTO;
import ec.edu.insteclrg.persistence.CategoryRepository;
import ec.edu.insteclrg.service.crud.CategoryService;

@RestController
@RequestMapping("/v1.0/categoria")
public class CategoryController {

	@Autowired
	CategoryService service;
	
	@PostMapping(path = "/guardar")
	public ResponseEntity<Object> guardar(@RequestBody CategoriaDTO dto) {
		service.guardar(dto);
		return new ResponseEntity<>(new ApiResponseDTO<>(true, "guardado"), HttpStatus.CREATED);
	}
	
	@PutMapping(path = "/actualizar")
	public ResponseEntity<Object> actualizar(@RequestBody CategoriaDTO dto) {
		service.actualizar(dto);
		return new ResponseEntity<>(new ApiResponseDTO<>(true, "actualizado"), HttpStatus.CREATED);
	}

	@GetMapping(path = "/listar")
	public ResponseEntity<Object> listar() {
		List<CategoriaDTO> list = service.buscarTodo(new CategoriaDTO());
		if (!list.isEmpty()) {
			ApiResponseDTO<List<CategoriaDTO>> response = new ApiResponseDTO<>(true, list);
			return (new ResponseEntity<Object>(response, HttpStatus.OK));
		} else {
			return new ResponseEntity<>(new ApiResponseDTO<>(false, "ok"), HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping(path = "/{id}/buscar")
	public ResponseEntity<Object> buscar(@PathVariable Long id) {
		CategoriaDTO dto = new CategoriaDTO();
		dto.setId(id);
		Optional<Categoria> domain = service.buscar(dto);
		if (!domain.isEmpty()) {
			dto = service.mapearDTO(domain.get());
			return new ResponseEntity<>(new ApiResponseDTO<>(true, dto), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new ApiResponseDTO<>(false, "ok"), HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping(path = "/{id}/eliminar")
	public ResponseEntity<Object> eliminar(@PathVariable Long id) {
		CategoriaDTO dto = new CategoriaDTO();
		dto.setId(id);
		service.eliminar(dto);
		return new ResponseEntity<>(new ApiResponseDTO<>(true, "eliminado"), HttpStatus.CREATED);
	}


}
