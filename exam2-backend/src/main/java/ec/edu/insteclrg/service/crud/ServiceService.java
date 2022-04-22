package ec.edu.insteclrg.service.crud;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.insteclrg.domain.Categoria;
import ec.edu.insteclrg.domain.Servicio;
import ec.edu.insteclrg.dto.CategoriaDTO;
import ec.edu.insteclrg.dto.ServicioDTO;
import ec.edu.insteclrg.persistence.ServiceRepository;
import ec.edu.insteclrg.service.GenericCRUDServiceImpl;

@Service
public class ServiceService extends GenericCRUDServiceImpl<Servicio, ServicioDTO>{
	
	@Autowired
	ServiceRepository repository;

	@Override
	public ServicioDTO mapearDTO(Servicio domainObject) {
		ServicioDTO dto=new ServicioDTO();
		dto.setId(domainObject.getId());
		dto.setNombre(domainObject.getNombre());
		return dto;
	}

	
	@Override
	public Servicio mapearDominio(ServicioDTO dtoObject) {
		Servicio domain= new Servicio();
		domain.setNombre(dtoObject.getNombre());
		domain.setId(dtoObject.getId());		
		return domain;
	}
	
	@Override
	public Optional<Servicio> buscar(ServicioDTO dtoObject) {
		return repository.findById(dtoObject.getId());
	}

}