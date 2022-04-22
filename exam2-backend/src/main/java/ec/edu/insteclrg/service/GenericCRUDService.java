package ec.edu.insteclrg.service;

import java.util.List;
import java.util.Optional;

public interface GenericCRUDService<DOMAIN, DTO> {

	void guardar(DTO dtoObject);

	void actualizar(DTO dtoObject);
	
	void eliminar(DTO dtoObject);

	List<DTO> buscarTodo(DTO dtoObject);

	DOMAIN mapearDominio(DTO dtoObject);

	DTO mapearDTO(DOMAIN domainObject);

	abstract Optional<DOMAIN> buscar(DTO dtoObject);
}