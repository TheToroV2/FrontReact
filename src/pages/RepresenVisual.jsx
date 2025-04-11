import { useEffect, useState } from "react";
import { getAllEntities, createEntity, updateEntity, deleteEntity } from "../services/apiservice";
import "../styles/RepresenVisual.css";
import { useNavigate } from "react-router-dom";

const RepresenVisual = () => {
  const navigate = useNavigate();
  const [represenVisuals, setRepresenVisuals] = useState([]);
  const [newNombre, setNewNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const nombreTabla = "represenvisual";

  const fetchData = async () => {
    try {
      const data = await getAllEntities(nombreTabla);
      console.log("\ud83d\udce2 API Response:", data);

      const parsedData = data && typeof data.message === "string" 
        ? JSON.parse(data.message) 
        : [];

      setRepresenVisuals(Array.isArray(parsedData) ? parsedData : []);
    } catch (error) {
      console.error("\u274c Error al cargar datos:", error);
      setRepresenVisuals([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newNombre.trim()) {
      alert("\u274c Ingresa un nombre válido.");
      return;
    }

    const nuevaRepresenVisual = { nombre: newNombre };

    try {
      await createEntity(nombreTabla, nuevaRepresenVisual);
      setNewNombre("");
      fetchData();
    } catch (error) {
      console.error("\u274c No se pudo crear:", error.message);
    }
  };

  const handleUpdate = async (id) => {
    if (!editNombre.trim()) {
      alert("\u274c Ingresa un nombre válido.");
      return;
    }

    const updatedRepresenVisual = { nombre: editNombre };

    try {
      console.log("\ud83d\udce2 Sending update request:", updatedRepresenVisual);

      await updateEntity(nombreTabla, id, updatedRepresenVisual);

      setEditId(null);
      setEditNombre("");
      fetchData();
    } catch (error) {
      console.error("\u274c Error al actualizar:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("\u2757¿Estás seguro de que deseas eliminar esta entidad?");
    if (!isConfirmed) return;

    try {
      await deleteEntity(nombreTabla, id);
      fetchData();
    } catch (error) {
      console.error("\u274c Error al eliminar:", error);
    }
  };

  return (
    <div className="represen-visual-container">
      <h2 className="represen-visual-title">Representaciones Visuales</h2>

      {/* ✅ Input para nueva representación visual */}
      <div>
        <input
          type="text"
          className="input-field"
          placeholder="Nueva Representación Visual"
          value={newNombre}
          onChange={(e) => setNewNombre(e.target.value)}
        />
        <button className="add-button" onClick={handleCreate}>➕ Agregar</button>
      </div>

      {/* ✅ Lista de Representaciones Visuales */}
      <ul className="list">
        {represenVisuals.map((item) => (
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

      {/* ✅ Botón de Volver a Inicio */}
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅️Volver a Inicio
      </button>
    </div>
  );
};

export default RepresenVisual;
