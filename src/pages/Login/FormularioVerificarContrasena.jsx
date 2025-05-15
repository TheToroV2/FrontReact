import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";  // Importamos el AuthContext

const FormularioVerificarContrasena = () => {
  const [formData, setFormData] = useState({
    valorUsuario: "",
    valorContrasena: ""
  });

  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Destructuramos setUserRoles desde el contexto
  const { setUserRoles } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setResultado(null);
  
    const { valorUsuario, valorContrasena } = formData;
  
    const contrasen = valorContrasena;
  
    try {
      const response = await fetch(
        `http://localhost:5266/api/proyecto/usuario/verificar-contrasena`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            campoUsuario: "email",            
            campoContrasena: "contrasena",    
            valorUsuario,
            valorContrasena: contrasen // Enviar la contraseña 
          })
        }
      );
  
      const mensaje = await response.text();
  
      if (response.ok) {
        setResultado({ tipo: "exito", mensaje });

        // Si la contraseña es correcta, obtenemos los roles
        try {
          const roles = await obtenerRoles(valorUsuario);
          const nombresRoles = roles.map(r => r.nombre);
          
          // Guardamos los roles en el localStorage
          localStorage.setItem("roles", JSON.stringify(nombresRoles));

          // Actualizamos los roles en el contexto global
          setUserRoles(nombresRoles);

          // Navegamos a la página correspondiente según el rol
          if (nombresRoles.includes("admin")) {
            navigate("/admin/home");
          } else if (nombresRoles.includes("Validador")) {
            navigate("/validador/home");
          } else {
            navigate("/usuario/home");
          }

        } catch (e) {
          setResultado({ tipo: "error", mensaje: "Contraseña verificada, pero no se pudieron cargar los roles." });
        }

      } else {
        setResultado({ tipo: "error", mensaje });
      }
  
    } catch (error) {
      setResultado({
        tipo: "error",
        mensaje: "Error al conectar con el servidor: " + error.message
      });
    } finally {
      setCargando(false);
    }
  };

  const obtenerRoles = async (email) => {
    const respuesta = await fetch("http://localhost:5266/api/proyecto/usuario/ejecutar-consulta-parametrizada", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        consulta: "SELECT r.nombre FROM rol_usuario ur JOIN rol r ON ur.fkidrol = r.id WHERE ur.fkemail = @correo",
        parametros: {
          correo: email
        }
      })
    });

    if (!respuesta.ok) throw new Error("No se pudieron obtener los roles.");

    return await respuesta.json(); // Esto te devuelve un array de objetos con { nombre: "admin" }, etc.
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "2rem" }}>
      <h2>Verificar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="valorUsuario"
          placeholder="Usuario"
          value={formData.valorUsuario}
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="valorContrasena"
          placeholder="Contraseña"
          value={formData.valorContrasena}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit" disabled={cargando}>
          {cargando ? "Verificando..." : "Verificar Contraseña"}
        </button>
      </form>

      {resultado && (
        <div style={{ marginTop: "1rem", color: resultado.tipo === "exito" ? "green" : "red" }}>
          {resultado.mensaje}
        </div>
      )}
    </div>
  );
};

export default FormularioVerificarContrasena;
