package ec.edu.insteclrg.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ec.edu.insteclrg.domain.Categoria;

@Repository
public interface CategoryRepository extends JpaRepository<Categoria, Long> {

}
