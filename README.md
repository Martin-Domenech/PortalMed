#  PortalMed

**PortalMed** es una aplicación web fullstack para la ** gestión de pacientes, turnos y evoluciones clínicas**. Permite a profesionales médicos registrar usuarios, cargar pacientes, registrar y consultar historiales clínicos, agendar turnos y almacenar archivos relacionados con cada paciente.

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
- AWS S3 
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

## ☁️ Almacenamiento de archivos con AWS S3

El sistema permite subir **archivos clínicos** (imágenes, PDFs, etc.) a evoluciones médicas, los cuales son almacenados directamente en un bucket de **Amazon S3**.

- ✅ Los archivos se cargan con `multer-s3` desde el backend.
- ✅ El frontend muestra imágenes en miniatura y permite abrirlas en otra pestaña.
- ✅ Los PDFs se listan como enlaces clickeables.
- ✅ Se limita la carga a **5 archivos por evolución**.
- ✅ Los archivos se renombran con un prefijo de timestamp para evitar colisiones.

---

## 🔐 Autenticación

- Los usuarios se registran con `username`, `password`, `first_name`, `last_name`, `email`.
- El sistema genera un JWT que se guarda en una **cookie HTTPOnly**.
- Acciones protegidas (como ver evoluciones) requieren que el token sea válido.
- Soporte para distintos roles:
  - user: profesional médico (tiene acceso completo)
  - secretary: usuario administrativo (puede ver/crear pacientes y turnos, pero no accede a evoluciones clínicas)
  - admin: acceso extendido


---

## 🧪 Endpoints principales del backend

- POST /api/sessions/register → Registro de usuario (Solo un user con rol: admin puede registrarlo)
- POST /api/sessions/login → Login (genera JWT)
- GET /api/sessions/current → Devuelve usuario autenticado
- POST /api/patients → Crea un nuevo paciente
- GET /api/patients/:id → Consulta un paciente
- PUT /api/patients/update/:id → Modifica un paciente
- DELETE /api/patients/delete/:id → Elimina un paciente
- POST /api/evos/:patientId → Crea una evolución
- PUT /api/evos/update/:evoId → Modifica una evolucion
- GET /api/evos/:patientId → Lista de evoluciones
- DELETE /api/evos/delete/:evoId → Elimina una evolucion
- POST /api/turnos → Crea un nuevo turno
- GET /api/turnos?fecha=YYYY-MM-DD → Lista los turnos de una fecha
- DELETE /api/turnos/:id → Elimina un turno



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
- ✅ Sistema de turnos por fecha  
- ✅ Modal para agregar nuevas evoluciones  
- ✅ Subida de archivos clínicos con AWS S3  
- ✅ Interfaz protegida según rol  
- ✅ Responsive design (pantalla completa y móviles)  

---

## 👤 Autor

- 👨‍💻 Desarrollado por **Martin Domenech**
- 📧 martin.dome99@gmail.com
- 🐙 GitHub: [https://github.com/Martin-Domenech](https://github.com/Martin-Domenech)

---

## 📝 Licencia

MIT © 2025 - Todos los derechos reservados