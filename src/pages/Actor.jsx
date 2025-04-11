import { useEffect, useState } from "react";
import { 
  getAllEntities, 
  createEntity, 
  updateEntity, 
  deleteEntity
} from "../services/apiservice";
import { useNavigate } from "react-router-dom";
import "../styles/BasicStyles.css";

const Actor = () => {
  const navigate = useNavigate();
  const [actores, setActores] = useState([]);
  const [newNombre, setNewNombre] = useState("");
  const [newTipo, setNewTipo] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editTipo, setEditTipo] = useState("");
  const [tiposActor, setTiposActor] = useState([]);

  const fetchData = async () => {
    try {
      const [acts, tipos] = await Promise.all([
        getAllEntities("actor"),
        getAllEntities("tipoactor")
      ]);
      
      setActores(acts || []);
      setTiposActor(tipos || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!newNombre.trim() || !newTipo) {
      alert("Complete todos los campos");
      return;
    }

    try {
      await createEntity("actor", {
        nombre: newNombre,
        fkidtipoactor: newTipo
      });
      setNewNombre("");
      setNewTipo("");
      fetchData();
    } catch (error) {
      console.error("Error creando:", error);
    }
  };

  const handleUpdate = async (id) => {
    if (!editNombre.trim() || !editTipo) {
      alert("Complete todos los campos");
      return;
    }

    try {
      await updateEntity("actor", id, {
        nombre: editNombre,
        fkidtipoactor: editTipo
      });
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error("Error actualizando:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este actor?")) return;
    try {
      await deleteEntity("actor", "id", id);
      fetchData();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  return (
    <div className="entidad-container">
      <h2>Actores</h2>

      <div className="form-container">
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre del actor"
            value={newNombre}
            onChange={(e) => setNewNombre(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <select
            value={newTipo}
            onChange={(e) => setNewTipo(e.target.value)}
          >
            <option value="">Seleccione tipo...</option>
            {tiposActor.map(t => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <button onClick={handleCreate}>Agregar Actor</button>
      </div>

      <ul className="list">
        {actores.map(actor => (
          <li key={actor.id}>
            {editId === actor.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                />
                
                <select
                  value={editTipo}
                  onChange={(e) => setEditTipo(e.target.value)}
                >
                  <option value="">Seleccione tipo...</option>
                  {tiposActor.map(t => (
                    <option key={t.id} value={t.id}>{t.nombre}</option>
                  ))}
                </select>
                
                <div className="button-group">
                  <button onClick={() => handleUpdate(actor.id)}>Guardar</button>
                  <button onClick={() => setEditId(null)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <span>{actor.nombre}</span>
                <span className="tipo">
                  ({tiposActor.find(t => t.id === actor.fkidtipoactor)?.nombre || 'Tipo desconocido'})
                </span>
                
                <div className="button-group">
                  <button 
                    className="edit-button"
                    onClick={() => {
                      setEditId(actor.id);
                      setEditNombre(actor.nombre);
                      setEditTipo(actor.fkidtipoactor);
                    }}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(actor.id)}
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

export default Actor;