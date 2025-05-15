import { useEffect, useState } from "react";
import { getAllEntities, createEntity, updateEntity, deleteEntity } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import "../styles/Sentido.css";

const Seccion = () => {
  const navigate = useNavigate();
  const [secciones, setSecciones] = useState([]);
  const [newNombre, setNewNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const nombreTabla = "Seccion";

  const fetchData = async () => {
    try {
      const data = await getAllEntities(nombreTabla);
      console.log("📢 API Response:", data);
      setSecciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setSecciones([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newNombre.trim()) {
      alert("❌ Ingresa un nombre válido.");
      return;
    }

    const nuevaSeccion = { nombre: newNombre };

    try {
      await createEntity(nombreTabla, nuevaSeccion);
      setNewNombre("");
      fetchData();
    } catch (error) {
      console.error("❌ No se pudo crear:", error.message);
    }
  };

  const handleUpdate = async (id) => {
    if (!editNombre.trim()) {
      alert("❌ Ingresa un nombre válido.");
      return;
    }

    const updatedSeccion = { nombre: editNombre };

    try {
      await updateEntity(nombreTabla, id, updatedSeccion);
      setEditId(null);
      setEditNombre("");
      fetchData();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("❗¿Estás seguro de que deseas eliminar esta sección?");
    if (!isConfirmed) return;

    try {
      await deleteEntity(nombreTabla, id);
      fetchData();
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  };

  return (
    <div className="sentido-container">
      <h2 className="sentido-title">Secciones</h2>

      <div>
        <input
          type="text"
          className="input-field"
          placeholder="Nueva Sección"
          value={newNombre}
          onChange={(e) => setNewNombre(e.target.value)}
        />
        <button className="add-button" onClick={handleCreate}>➕ Agregar</button>
      </div>

      <ul className="list">
        {secciones.map((item) => (
          <li key={item.id} className="list-item">
            {editId === item.id ? (
              <div className="edit-group">
                <input
                  type="text"
                  value={editNombre}
                  onChange={(e) => setEditNombre(e.target.value)}
                />
                <button className="save-button" onClick={() => handleUpdate(item.id)}>💾 Guardar</button>
              </div>
            ) : (
              <>
                {item.nombre}
                <div className="button-group">
                  <button className="edit-button" onClick={() => { setEditId(item.id); setEditNombre(item.nombre); }}>
                    ✏ Editar
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(item.id)}>
                    🗑 Eliminar
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <button className="back-button" onClick={() => navigate("/")}>
        ⬅️ Volver a Inicio
      </button>
    </div>
  );
};

export default Seccion;
