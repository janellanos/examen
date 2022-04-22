package ec.edu.insteclrg.springsecuritybasic.services;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.insteclrg.common.exception.ApiException;
import ec.edu.insteclrg.common.persistence.CountryRepository;

import ec.edu.insteclrg.dto.CountryDTO;
import ec.edu.insteclrg.service.GenericCRUDServiceImpl;
import ec.edu.insteclrg.springsecuritybasic.model.Country;

@Service
public class CountryService extends GenericCRUDServiceImpl<Country, CountryDTO> {

	@Autowired
	private CountryRepository repository;

	@Override
	public Country mapearDominio(CountryDTO dtoObject) {
		Country domain = new Country();
		domain.setId(dtoObject.getId());
		domain.setNombre(dtoObject.getNombre());
		return domain;
	}

	@Override
	public CountryDTO mapearDTO(Country domainObject) {
		CountryDTO dto = new CountryDTO();
		dto.setId(domainObject.getId());
		dto.setNombre(domainObject.getNombre());
		return dto;
	}

	@Override
	public Optional<Country> buscar(CountryDTO dtoObject) {
		return repository.findById(dtoObject.getId());
	}

}
