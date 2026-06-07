# 🍕 RestaurantApp

Aplicación fullstack para gestión de un restaurante. Permite a los clientes ver el menú y realizar pedidos, y a los administradores gestionar platos, pedidos y usuarios.

---

## Stack

| Capa | Tecnología |
|---|---|
| Backend | Java 17 · Spring Boot 3.5 · Spring Security · JPA/Hibernate |
| Base de datos | MySQL |
| Frontend | React · Vite · Tailwind CSS · React Router |
| HTTP Client | Axios |

---

## Funcionalidades

### Cliente
- Iniciar sesión
- Ver el menú con platos disponibles
- Agregar platos al carrito con cantidades
- Confirmar pedidos (el total se calcula correctamente según cantidad × precio)
- Ver el historial de sus pedidos con estado en tiempo real

### Administrador
- Gestión de platos (crear, editar, eliminar, marcar disponibilidad)
- Gestión de pedidos (ver todos los pedidos, cambiar estado)
- Gestión de usuarios (crear, editar, eliminar)

---

## Estructura del proyecto

```
restaurant-app/
├── restaurant-api/          # Backend Spring Boot
│   └── src/main/java/com/restaurant/
│       ├── controller/      # Endpoints REST
│       ├── service/         # Lógica de negocio
│       ├── repository/      # Acceso a datos (Spring Data JPA)
│       ├── entity/          # Entidades JPA (Usuario, Plato, Pedido, PedidoItem)
│       └── dto/             # Data Transfer Objects
│
└── restaurant-front/        # Frontend React
    └── src/
        ├── components/      # Layouts y componentes reutilizables
        ├── context/         # AuthContext (manejo de sesión)
        ├── pages/           # Vistas por rol (admin / cliente)
        └── services/        # Llamadas a la API
```

---

## Requisitos previos

- Java 17+
- Node.js 18+
- MySQL 8+

---

## Instalación y ejecución

### 1. Base de datos

Crear la base de datos en MySQL:

```sql
CREATE DATABASE restaurant_db;
```

### 2. Backend

Configurar las credenciales de la base de datos en `restaurant-api/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/restaurant_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

Luego ejecutar:

```bash
cd restaurant-api/restaurant-api
./mvnw spring-boot:run
```

El servidor levanta en `http://localhost:8080`.

### 3. Frontend

```bash
cd restaurant-front/restaurant-app
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

---

## API — Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/usuarios/login` | Iniciar sesión |
| `GET` | `/api/platos` | Listar todos los platos |
| `GET` | `/api/platos/disponibles` | Listar platos disponibles |
| `POST` | `/api/platos` | Crear plato |
| `PUT` | `/api/platos/{id}` | Editar plato |
| `DELETE` | `/api/platos/{id}` | Eliminar plato |
| `GET` | `/api/pedidos` | Listar todos los pedidos |
| `GET` | `/api/pedidos/usuario/{id}` | Pedidos de un usuario |
| `POST` | `/api/pedidos` | Crear pedido |
| `PATCH` | `/api/pedidos/{id}/estado` | Cambiar estado del pedido |
| `GET` | `/api/usuarios` | Listar usuarios |
| `POST` | `/api/usuarios` | Crear usuario |

---

## Modelo de datos

```
Usuario          Pedido            PedidoItem        Plato
────────         ──────────        ──────────        ─────
id               id                id                id
nombre           usuario_id ──→    pedido_id ──→     nombre
email            estado            plato_id  ──→     descripcion
password         total             cantidad           precio
rol              fechaHora         precioUnitario     categoria
(ADMIN/CLIENTE)  (PENDIENTE /                         imagenUrl
                  EN_PREPARACION /                    disponible
                  ENTREGADO /
                  CANCELADO)
```
