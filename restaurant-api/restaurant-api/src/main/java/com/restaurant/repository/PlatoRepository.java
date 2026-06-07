package com.restaurant.repository;

import com.restaurant.entity.Plato;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlatoRepository extends JpaRepository<Plato, Long> {
    List<Plato> findByDisponibleTrue();
    List<Plato> findByCategoria(String categoria);
}
