package com.restaurant.repository;

import com.restaurant.entity.Pedido;
import com.restaurant.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario(Usuario usuario);
    List<Pedido> findByEstado(Pedido.Estado estado);
}