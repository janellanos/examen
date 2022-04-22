package ec.edu.insteclrg.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ec.edu.insteclrg.domain.Categoria;
import ec.edu.insteclrg.domain.Producto;

@Repository
public interface ProductRepository extends JpaRepository<Producto, Long> {

}
