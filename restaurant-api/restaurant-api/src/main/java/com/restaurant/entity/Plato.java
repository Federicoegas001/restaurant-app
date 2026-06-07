package com.restaurant.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "platos")
public class Plato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(length = 500)
    private String descripcion;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private String categoria;

    @Column(length = 1000)
    private String imagenUrl;

    @Column(nullable = false)
    private Boolean disponible = true;
}