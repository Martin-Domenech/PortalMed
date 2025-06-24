#  PortalMed

**PortalMed** es una aplicación web fullstack para la **gestión de pacientes y sus historial de evoluciones médicas**. Permite a profesionales médicos registrar usuarios, cargar pacientes, registrar y consultar historiales clínicos, y almacenar archivos relacionados con cada paciente.

> 🔐 El sistema utiliza autenticación con JWT y ofrece una interfaz moderna construida con React.

## 🚀 Demo en producción

🌐 https://portalmedapp.com  
📡 API: https://api.portalmedapp.com

---

## 🛠️ Tecnologías utilizadas

### Backend (Node.js + Express)

- Express.js
- MongoDB + Mongoose
- JWT para autenticación
- Bcrypt para hash de contraseñas
- Multer (para subir archivos)
- CORS
- Dotenv
- Cookie-parser

### Frontend (React)

- React + Vite
- React Router DOM
- CSS personalizado
- Fetch API
- Manejo de cookies con `credentials: 'include'`

---

## 🔐 Autenticación

- Los usuarios se registran con `username`, `password`, `first_name`, `last_name`, `email`.
- El sistema genera un JWT que se guarda en una **cookie HTTPOnly**.
- Acciones protegidas (como ver evoluciones) requieren que el token sea válido.

---

## 🧪 Endpoints principales del backend

- POST /api/sessions/register → Registro de usuario (Solu un user con rol: admin puede registrarlo)
- POST /api/sessions/login → Login (genera JWT)
- GET /api/sessions/current → Devuelve usuario autenticado
- POST /api/patients → Crea un nuevo paciente
- GET /api/patients/:id → Consulta un paciente
- PUT /api/patients/update/:id → Modifica un paciente
- DELETE /api/patients/delete/:id → Elimina un paciente
- POST /api/evos/:patientId → Crea una evolución
- PUT /api/evos/update/:evoId → Modifica una evolucion
- GET /api/evos/:patientId → Lista de evoluciones
- DELETE /api/patients/delete/:evoId → Elimina una evolucion

## 🧑‍💻 Instalación local

### Requisitos

- Node.js v18+
- MongoDB Atlas o local
- Yarn o npm

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

###  Usuario de prueba

Si desea probar el funcionamiento de la aplicación web, puede utilizar el siguiente usuario de prueba:

- **Username:** `User_Prueba01`  
- **Contraseña:** `User01`

> Este usuario ha sido creado exclusivamente con fines demostrativos. Cualquier modificación que realice dentro de la aplicación utilizando esta cuenta no afectará a datos reales.

## 🌐 Producción

- **Frontend** desplegado en **Vercel**
- **Backend** desplegado en **Railway**
- **Dominio principal**: [https://portalmedapp.com](https://portalmedapp.com)
- **Subdominio del backend**: [https://api.portalmedapp.com](https://api.portalmedapp.com)
- Ambas partes conectadas con **CORS** y **cookies activadas**

---

## 📸 Funcionalidades

- ✅ Registro e inicio de sesión con JWT
- ✅ Gestión de pacientes
- ✅ Registro de evoluciones médicas (motivo y descripción)
- ✅ Interfaz protegida para médicos logueados
- ✅ Modal para agregar nuevas evoluciones
- ✅ Responsive design (pantalla completa y móviles)

---

## 📌 ToDo (futuro)

- [ ] Capacidad para cargar imágenes y archivos en las evoluciones médicas.
- [ ] Sistema de calendario para el manejo de turnos.
- [ ] Implementación de roles avanzados que limiten el acceso de usuarios administrativos a información sensible de pacientes.

---

## 👤 Autor

- 👨‍💻 Desarrollado por **Martin Domenech**
- 📧 martin.domenech.99[@]gmail.com
- 🐙 GitHub: [https://github.com/Martin-Domenech](https://github.com/Martin-Domenech)

---

## 📝 Licencia

MIT © 2025 - Todos los derechos reservados