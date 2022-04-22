package ec.edu.insteclrg.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ec.edu.insteclrg.domain.Categoria;
import ec.edu.insteclrg.domain.Servicio;

@Repository
public interface ServiceRepository extends JpaRepository<Servicio, Long> {

}
