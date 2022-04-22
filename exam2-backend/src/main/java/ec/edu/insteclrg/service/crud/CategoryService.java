package ec.edu.insteclrg.service.crud;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ec.edu.insteclrg.domain.Categoria;
import ec.edu.insteclrg.domain.Producto;
import ec.edu.insteclrg.dto.CategoriaDTO;
import ec.edu.insteclrg.dto.ProductoDTO;
import ec.edu.insteclrg.persistence.CategoryRepository;
import ec.edu.insteclrg.service.GenericCRUDServiceImpl;

@Service
public class CategoryService extends GenericCRUDServiceImpl<Categoria, CategoriaDTO> {

	@Autowired
	private CategoryRepository repository;
	
	@Override
	public Categoria mapearDominio(CategoriaDTO dtoObject) {
		Categoria domain= new Categoria();
		domain.setNombre(dtoObject.getNombre());
		domain.setId(dtoObject.getId());		
		return domain;
	}

	@Override
	public CategoriaDTO mapearDTO(Categoria domainObject) {
		CategoriaDTO dto=new CategoriaDTO();
		dto.setId(domainObject.getId());
		dto.setNombre(domainObject.getNombre());
		return dto;
	}

	@Override
	public Optional<Categoria> buscar(CategoriaDTO dtoObject) {
		return repository.findById(dtoObject.getId());
	}
}
