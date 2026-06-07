package com.restaurant.service;

import com.restaurant.dto.PedidoRequest;
import com.restaurant.entity.Pedido;
import com.restaurant.entity.PedidoItem;
import com.restaurant.entity.Plato;
import com.restaurant.entity.Usuario;
import com.restaurant.repository.PedidoRepository;
import com.restaurant.repository.PlatoRepository;
import com.restaurant.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PlatoRepository platoRepository;
    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<Pedido> obtenerTodos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> obtenerPorUsuario(Usuario usuario) {
        return pedidoRepository.findByUsuario(usuario);
    }

    public List<Pedido> obtenerPorEstado(Pedido.Estado estado) {
        return pedidoRepository.findByEstado(estado);
    }

    public Optional<Pedido> obtenerPorId(Long id) {
        return pedidoRepository.findById(id);
    }

    public Pedido crearPedido(PedidoRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFechaHora(LocalDateTime.now());
        pedido.setEstado(Pedido.Estado.PENDIENTE);

        List<PedidoItem> items = request.getItems().stream()
                .map(itemReq -> {
                    Plato plato = platoRepository.findById(itemReq.getPlatoId())
                            .orElseThrow(() -> new RuntimeException("Plato no encontrado: " + itemReq.getPlatoId()));
                    PedidoItem item = new PedidoItem();
                    item.setPedido(pedido);
                    item.setPlato(plato);
                    item.setCantidad(itemReq.getCantidad());
                    item.setPrecioUnitario(plato.getPrecio());
                    return item;
                })
                .toList();

        pedido.setItems(items);

        double total = items.stream()
                .mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad())
                .sum();
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

    public Pedido actualizarEstado(Long id, Pedido.Estado estado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        pedido.setEstado(estado);
        return pedidoRepository.save(pedido);
    }

    public void eliminar(Long id) {
        pedidoRepository.deleteById(id);
    }
}
