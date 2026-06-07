package com.restaurant.dto;

import lombok.Data;
import java.util.List;

@Data
public class PedidoRequest {
    private Long usuarioId;
    private List<ItemRequest> items;

    @Data
    public static class ItemRequest {
        private Long platoId;
        private Integer cantidad;
    }
}
