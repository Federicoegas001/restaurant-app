package com.restaurant.controller;

import com.restaurant.entity.Plato;
import com.restaurant.service.PlatoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/platos")
@RequiredArgsConstructor
public class PlatoController {

    private final PlatoService platoService;

    @GetMapping
    public List<Plato> obtenerTodos() {
        return platoService.obtenerTodos();
    }

    @GetMapping("/disponibles")
    public List<Plato> obtenerDisponibles() {
        return platoService.obtenerDisponibles();
    }

    @GetMapping("/categoria/{categoria}")
    public List<Plato> obtenerPorCategoria(@PathVariable String categoria) {
        return platoService.obtenerPorCategoria(categoria);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plato> obtenerPorId(@PathVariable Long id) {
        return platoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Plato crear(@RequestBody Plato plato) {
        return platoService.guardar(plato);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plato> actualizar(@PathVariable Long id, @RequestBody Plato plato) {
        return platoService.obtenerPorId(id)
                .map(p -> {
                    plato.setId(id);
                    return ResponseEntity.ok(platoService.guardar(plato));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/disponibilidad")
    public ResponseEntity<Plato> actualizarDisponibilidad(@PathVariable Long id, @RequestParam Boolean disponible) {
        return ResponseEntity.ok(platoService.actualizarDisponibilidad(id, disponible));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        platoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}