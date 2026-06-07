package com.restaurant.service;

import com.restaurant.entity.Plato;
import com.restaurant.repository.PlatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PlatoService {

    private final PlatoRepository platoRepository;

    public List<Plato> obtenerTodos() {
        return platoRepository.findAll();
    }

    public List<Plato> obtenerDisponibles() {
        return platoRepository.findByDisponibleTrue();
    }

    public List<Plato> obtenerPorCategoria(String categoria) {
        return platoRepository.findByCategoria(categoria);
    }

    public Optional<Plato> obtenerPorId(Long id) {
        return platoRepository.findById(id);
    }

    public Plato guardar(Plato plato) {
        return platoRepository.save(plato);
    }

    public void eliminar(Long id) {
        platoRepository.deleteById(id);
    }

    public Plato actualizarDisponibilidad(Long id, Boolean disponible) {
        Plato plato = platoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plato no encontrado"));
        plato.setDisponible(disponible);
        return platoRepository.save(plato);
    }
}