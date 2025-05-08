import { useEffect, useState } from "react";
import { getAllEntities, createEntity, updateEntity, deleteEntity } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import "../styles/Fuente.css";

const Fuente = () => {
  const navigate = useNavigate();
  const [fuentes, setFuentes] = useState([]);
  const [newNombre, setNewNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const nombreTabla = "fuente";

  const fetchData = async () => {
    try {
      const data = await getAllEntities(nombreTabla);
      console.log("📢 API Response:", data);
  
      setFuentes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setFuentes([]);
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

    const nuevaFuente = { nombre: newNombre };

    try {
      await createEntity(nombreTabla, nuevaFuente);
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

    const updatedfuente = { nombre: editNombre };

    try {
      console.log("📢 Sending update request:", updatedfuente);

      await updateEntity(nombreTabla, id, updatedfuente);

      setEditId(null);
      setEditNombre("");
      fetchData();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("❗¿Estás seguro de que deseas eliminar esta fuente?");
    if (!isConfirmed) return;

    try {
      await deleteEntity(nombreTabla, id);
      fetchData();
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  };

  return (
    <div className="fuente-container">
      <h2 className="fuente-title">Sentidos</h2>

      {/* ✅ Input para nuevo sentido */}
      <div>
        <input
          type="text"
          className="input-field"
          placeholder="Nueva fuente"
          value={newNombre}
          onChange={(e) => setNewNombre(e.target.value)}
        />
        <button className="add-button" onClick={handleCreate}>➕ Agregar</button>
      </div>

      {/* ✅ Lista de Sentidos */}
      <ul className="list">
        {fuentes.map((item) => (
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
                {item.nombre} {/* ✅ Mostrar nombre correctamente */}
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

      {/* ✅ Botón de Volver a Inicio */}
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅️ Volver a Inicio
      </button>
    </div>
  );
};

export default Fuente;
