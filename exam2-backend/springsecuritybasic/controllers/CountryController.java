package ec.edu.insteclrg.springsecuritybasic.controllers;

import java.util.List;

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


import ec.edu.insteclrg.dto.ApiResponseDTO;
import ec.edu.insteclrg.dto.CountryDTO;
import ec.edu.insteclrg.springsecuritybasic.services.CountryService;

@RestController
@RequestMapping("/v1.0/country")
public class CountryController {

	@Autowired
	CountryService service;

	@PostMapping(path = "/guardar")
	public ResponseEntity<Object> guardar(@RequestBody CountryDTO dto) {
		service.guardar(dto);
		return new ResponseEntity<>(new ApiResponseDTO<>(true, null), HttpStatus.CREATED);
	}

	@PutMapping(path = "/actualizar")
	public ResponseEntity<Object> actualizar(@RequestBody CountryDTO dto) {
		service.actualizar(dto);
		return new ResponseEntity<>(new ApiResponseDTO<>(true, null), HttpStatus.CREATED);
	}

	@GetMapping(path = "/listar")
	public ResponseEntity<Object> listar() {
		List<CountryDTO> list = service.buscarTodo(new CountryDTO());
		if (!list.isEmpty()) {
			ApiResponseDTO<List<CountryDTO>> response = new ApiResponseDTO<>(true, list);
			return (new ResponseEntity<Object>(response, HttpStatus.OK));
		} else {
			return new ResponseEntity<>(new ApiResponseDTO<>(false, null), HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping(path = "/{nombre}/buscar")
	public ResponseEntity<Object> buscar(@PathVariable String nombre) {
		CountryDTO dto = new CountryDTO();
		dto.setNombre(nombre);
		List<CountryDTO> list = service.buscarTodo(dto);
		if (!list.isEmpty()) {
			ApiResponseDTO<List<CountryDTO>> response = new ApiResponseDTO<>(true, list);
			return (new ResponseEntity<Object>(response, HttpStatus.OK));
		} else {
			return new ResponseEntity<>(new ApiResponseDTO<>(false, null), HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping(path = "/{id}/eliminar")
	public ResponseEntity<Object> eliminar(@PathVariable Long id) {
		CountryDTO dto = new CountryDTO();
		dto.setId(id);
		service.eliminar(dto);
		return new ResponseEntity<>(new ApiResponseDTO<>(true, null), HttpStatus.CREATED);
	}
}
