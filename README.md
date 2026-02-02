# 📚 PLATAFORMA DE RESERVAS DE LIBROS

## 📖 Descripción

Sistema web completo de reserva de libros. Los usuarios pueden buscar, filtrar por categorías y reservar libros. Los administradores gestionan el catálogo completo (crear, editar, eliminar). Autenticación con JWT y roles definidos.

---

## 🌐 URLs de Acceso

| Servicio | URL |
|----------|-----|
| **Frontend** | http://200.7.102.135:3001 |
| **Backend API** | http://200.7.102.135:3000 |
| **Documentación Swagger** | http://200.7.102.135:3000/api-docs/ |

---

## 🔑 Credenciales de Prueba

### Administrador (Super Usuario)
```
Email: admin
Contraseña: 123456
```
✅ Crear, editar, eliminar libros  
✅ Ver todas las reservas  
✅ Devolver cualquier libro  

### Usuario Regular
```
Email: user1
Contraseña: a12345
```
✅ Ver catálogo de libros  
✅ Buscar y filtrar por categoría  
✅ Hacer reservas  
✅ Ver y devolver mis reservas  

---

## 🛠️ Stack Tecnológico

- **Frontend:** React.js
- **Backend:** Node.js + Express
- **Base de Datos:** MongoDB
- **Autenticación:** JWT (JSON Web Tokens)
- **API Documentation:** Swagger/OpenAPI
- **Servidor:** Ubuntu

---

## 📋 Guía Rápida de Uso

### 1. Iniciar Sesión
1. Ir a http://200.7.102.135:3001
2. Ingresar credenciales (admin/123456 o user1/a12345)
3. Hacer clic en "Iniciar Sesión"

### 2. Registrar Nuevo Usuario
1. En login, hacer clic en "Crear Cuenta"
2. Completar email y contraseña
3. Seleccionar rol "Usuario"
4. Hacer clic en "Registrarse"

### 3. Buscar Libros (Como Usuario)
- **Buscador:** Escribe título o autor en el input
- **Filtro:** Selecciona categoría del dropdown
- Los resultados se actualizan en tiempo real

### 4. Hacer una Reserva (Como Usuario)
1. Selecciona un libro del catálogo
2. Haz clic en "Reservar"
3. Confirma la reserva
4. Verás el libro en "Mis Reservas"

### 5. Devolver un Libro (Como Usuario)
1. Ve a "Mis Reservas"
2. Busca el libro a devolver
3. Haz clic en "Devolver"
4. Confirma la acción

### 6. Gestionar Libros (Solo Admin)

**Ver todos los libros:**
- Dashboard → "Administración de Libros"

**Crear nuevo libro:**
1. Haz clic en "Nuevo Libro"
2. Completa: Título, Autor, Categoría, Descripción
3. Sube una imagen
4. Haz clic en "Crear"

**Editar libro:**
1. Selecciona el libro
2. Haz clic en "Editar"
3. Modifica los campos necesarios
4. Haz clic en "Guardar"

**Eliminar libro:**
1. Selecciona el libro
2. Haz clic en "Eliminar"
3. Confirma la eliminación

---

## 🔐 Seguridad y Roles

### Permisos por Rol

**Admin:**
- ✅ CRUD completo de libros
- ✅ Ver todas las reservas del sistema
- ✅ Devolver cualquier reserva
- ✅ Gestionar usuarios

**User:**
- ✅ Ver catálogo de libros
- ✅ Buscar y filtrar libros
- ✅ Crear reservas
- ✅ Ver sus propias reservas
- ✅ Devolver sus propias reservas
- ❌ No puede editar/eliminar libros
- ❌ No puede ver reservas de otros usuarios

### Autenticación
- Token JWT almacenado en localStorage
- Expiración automática de sesión
- Validación en cada request

---

## 📚 Modelos de Base de Datos

### Usuario
```json
{
  "id": "ObjectId",
  "email": "string (único)",
  "password": "string (hasheado)",
  "role": "Admin | User",
  "createdAt": "date"
}
```

### Libro
```json
{
  "id": "ObjectId",
  "title": "string",
  "author": "string",
  "category": "string",
  "description": "string",
  "imageUrl": "string",
  "available": "boolean",
  "createdAt": "date"
}
```

### Reserva
```json
{
  "id": "ObjectId",
  "userId": "ObjectId (referencia)",
  "bookId": "ObjectId (referencia)",
  "reservationDate": "date",
  "returnDate": "date (null si activa)",
  "status": "active | returned"
}
```

---

## 🔌 Principales Endpoints API

### Autenticación
```
POST /api/auth/register       - Registrar nuevo usuario
POST /api/auth/login          - Iniciar sesión
```

### Libros
```
GET    /api/books             - Listar todos los libros
GET    /api/books/search      - Buscar libros
GET    /api/books/:id         - Obtener detalle del libro
POST   /api/books             - Crear libro (Admin)
PUT    /api/books/:id         - Editar libro (Admin)
DELETE /api/books/:id         - Eliminar libro (Admin)
```

### Reservas
```
GET    /api/reservations      - Ver mis reservas
GET    /api/reservations/all  - Ver todas las reservas (Admin)
POST   /api/reservations      - Crear nueva reserva
PUT    /api/reservations/:id  - Devolver libro
```

### Categorías
```
GET    /api/categories        - Listar todas las categorías
```

**Documentación completa en Swagger:** http://200.7.102.135:3000/api-docs/

---

## 🚀 Iniciar Servicios (Ubuntu)

### Backend
```bash
cd backend
npm install
npm start
# Ejecutándose en http://200.7.102.135:3000
```

### Frontend
```bash
cd frontend
npm install
npm start
# Ejecutándose en http://200.7.102.135:3001
```


### Frontend (.env)
```
REACT_APP_API_URL=http://200.7.102.135:3000
```

---

## 🐛 Solución de Problemas

| Problema | Solución |
|----------|----------|
| Error en login | Verifica credenciales exactas (admin/123456 o user1/a12345) |
| Botones editar/eliminar no aparecen | Debes estar logueado como Admin |
| No puedo devolver libro ajeno | Solo el propietario o Admin pueden devolverlo |
| Búsqueda no funciona | Verifica que backend esté corriendo y MongoDB conectada |
| Token expirado | Cierra sesión y vuelve a iniciar |

---

## 📋 Flujo de Funcionalidades
```
Usuario No Logueado
        ↓
    Login/Registro
        ↓
Usuario Logueado
    ↙         ↘
ADMIN          USER
  ↓              ↓
CRUD de      Ver Catálogo
Libros       Buscar/Filtrar
             Hacer Reservas
             Ver Mis Reservas
             Devolver Libros
```

---

## 📞 Información Técnica

- **Autenticación:** JWT (Bearer Token)
- **Base de Datos:** MongoDB con Mongoose
- **Validaciones:** Servidor (Node.js)
- **Estado:** Redux/Context API (React)
- **Imagenes:** Almacenadas en servidor

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2025  
**Ambiente:** Producción - Ubuntu Server
