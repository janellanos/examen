package ec.edu.insteclrg.service.crud;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import ec.edu.insteclrg.domain.Categoria;
import ec.edu.insteclrg.domain.Producto;
import ec.edu.insteclrg.dto.CategoriaDTO;
import ec.edu.insteclrg.dto.ProductoDTO;
import ec.edu.insteclrg.persistence.ProductRepository;
import ec.edu.insteclrg.service.GenericCRUDServiceImpl;

@Service
public class ProductService extends GenericCRUDServiceImpl<Producto, ProductoDTO> {

	@Autowired
	ProductRepository repository;

	@Autowired
	ModelMapper mapper;

	@Override
	public ProductoDTO mapearDTO(Producto domainObject) {
		ProductoDTO dto = mapper.map(domainObject, ProductoDTO.class);
		return dto;
	}

	@Override
	public Optional<Producto> buscar(ProductoDTO dtoObject) {
		return repository.findById(dtoObject.getId());
	}

	@Override
	public Producto mapearDominio(ProductoDTO dtoObject) {
		Producto domian = mapper.map(dtoObject, Producto.class);
		return domian;
	}

}
