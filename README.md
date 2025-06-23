
componentes utiles de material ui
https://mui.com/x/common-concepts/custom-components/
https://mui.com/material-ui/react-app-bar/#app-bar-with-responsive-menu
https://mui.com/toolpad/core/react-sign-in-page/

creacion de imagenes por ia:
https://designer.microsoft.com/image-creator

Admin User: tinchodome@gmail.com    pass: aaaj1985

//////////// Si por algun motivo hay que insertar un user admin//////////////////
import User from '../models/userModel.js'; // Asegúrate de tener el modelo importado

const newUser = {
    first_name: "Martin",
    last_name: "Domenech",
    email: "tinchodome@gmail.com",
    age: 25, // Puedes usar un número directamente
    password: "$2b$10$DKYWDbqqP0OsvMlFqZ3WQuNGXy5ZegMso1KulLjKjovI7nQERD/0m", // Contraseña hasheada
    role: "admin"
};

try {
    const user = new User(newUser); // Crear una nueva instancia del modelo
    await user.save(); // Guardar el nuevo usuario en la base de datos
    console.log("Usuario insertado con éxito:", user);
} catch (error) {
    console.error("Error al insertar el usuario:", error);
}
/////////////////////////////////////////////////////////////////
 
para detail patient:
https://mui.com/material-ui/react-bottom-navigation/

EVOLUCIONES:
    fecha
    motivo de consulta
    info de evolucion
    imagenes
    consentimientos informados



usuario de prueba
mail: user@gmail.com
pass: user01


hostinger portalmedapp-api.com
en railway alojar el back y que apunte a la api
