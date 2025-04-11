import { useEffect, useState } from "react";
import { 
  getAllEntities, 
  createEntity, 
  updateEntity, 
  deleteEntity
} from "../services/apiservice";
import { useNavigate } from "react-router-dom";
import "../styles/BasicStyles.css";

const Variable = () => {
  const navigate = useNavigate();
  const [variables, setVariables] = useState([]);
  const [newNombre, setNewNombre] = useState("");
  const [newUsuario, setNewUsuario] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editUsuario, setEditUsuario] = useState("");

  const fetchData = async () => {
    try {
      const data = await getAllEntities("variable");
      setVariables(data || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!newNombre.trim() || !newUsuario.trim()) {
      alert("Complete todos los campos");
      return;
    }

    try {
      await createEntity("variable", {
        nombre: newNombre,
        fechacreacion: new Date().toISOString(),
        fkemailusuario: newUsuario
      });
      setNewNombre("");
      setNewUsuario("");
      fetchData();
    } catch (error) {
      console.error("Error creando:", error);
    }
  };

  const handleUpdate = async (id) => {
    if (!editNombre.trim() || !editUsuario.trim()) {
      alert("Complete todos los campos");
      return;
    }

    try {
      await updateEntity("variable", id, {
        nombre: editNombre,
        fkemailusuario: editUsuario
      });
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error("Error actualizando:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta variable?")) return;
    try {
      await deleteEntity("variable", "id", id);
      fetchData();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  return (
    <div className="entidad-container">
      <h2>Variables</h2>

      <div className="form-container">
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre de la variable"
            value={newNombre}
            onChange={(e) => setNewNombre(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email del usuario"
            value={newUsuario}
            onChange={(e) => setNewUsuario(e.target.value)}
          />
        </div>

        <button onClick={handleCreate}>Agregar Variable</button>
      </div>

      <ul className="list">
        {variables.map(variable => (
          <li key={variable.id}>
            {editId === variable.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                />
                
                <input
                  type="email"
                  value={editUsuario}
                  onChange={(e) => setEditUsuario(e.target.value)}
                />
                
                <div className="button-group">
                  <button onClick={() => handleUpdate(variable.id)}>Guardar</button>
                  <button onClick={() => setEditId(null)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <span>{variable.nombre}</span>
                <span className="usuario">
                  (Creada por: {variable.fkemailusuario})
                </span>
                
                <div className="button-group">
                  <button 
                    className="edit-button"
                    onClick={() => {
                      setEditId(variable.id);
                      setEditNombre(variable.nombre);
                      setEditUsuario(variable.fkemailusuario);
                    }}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(variable.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <button className="back-button" onClick={() => navigate("/")}>
        Volver a Inicio
      </button>
    </div>
  );
};

export default Variable;