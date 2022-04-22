package ec.edu.insteclrg.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import ec.edu.insteclrg.common.ApiException;

@Service
public abstract class GenericCRUDServiceImpl<DOMAIN, DTO> implements GenericCRUDService<DOMAIN, DTO> {

	@Autowired
	private JpaRepository<DOMAIN, Long> repository;

	@Override
	public void guardar(DTO dtoObject) {
		Optional<DOMAIN> optional = buscar(dtoObject);
		if (!optional.isPresent()) {
			DOMAIN domainObject = mapearDominio(dtoObject);
			repository.save(domainObject);
		} else {
			throw new ApiException(String.format("Registro %s ya existe en el sistema", dtoObject));
		}
	}
	
	@Override
	public void eliminar(DTO dtoObject) {
		Optional<DOMAIN> optional = buscar(dtoObject);
		if (optional.isPresent()) {
			DOMAIN domainObject = mapearDominio(dtoObject);
			repository.delete(domainObject);
		} else {
			throw new ApiException(String.format("Registro %s no existe en la base de datos", dtoObject));
		}		
	}

	@Override
	public void actualizar(DTO dtoObject) {
		Optional<DOMAIN> optional = buscar(dtoObject);
		if (optional.isPresent()) {
			DOMAIN domainObject = mapearDominio(dtoObject);
			repository.save(domainObject);
		} else {
			throw new ApiException(String.format("Registro %s no existe en la base de datos", dtoObject));
		}
	}

	@Override
	public List<DTO> buscarTodo(DTO dtoObject) {
		DOMAIN domainObject = mapearDominio(dtoObject);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues().withIgnorePaths("id");
		List<DOMAIN> lstObjs = repository.findAll(Example.of(domainObject, matcher));
		return lstObjs.stream().map(obj -> mapearDTO(obj)).collect(Collectors.toList());
	}

	@Override
	public abstract DOMAIN mapearDominio(DTO dtoObject);

}