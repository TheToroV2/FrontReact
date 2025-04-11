import { useEffect, useState } from "react";
import { getAllEntities, createEntity, updateEntity, deleteEntity } from "../services/apiservice";
import { useNavigate } from "react-router-dom";
import "../styles/TipoActor.css";

const TipoActor = () => {
  const navigate = useNavigate();
  const [tipoActores, setTipoActores] = useState([]);
  const [newNombre, setNewNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const nombreTabla = "tipoactor";

  const fetchData = async () => {
    try {
      const data = await getAllEntities(nombreTabla);
      console.log("📢 API Response:", data);

      const parsedData = data?.message && typeof data.message === "string"
        ? JSON.parse(data.message)
        : [];

      setTipoActores(Array.isArray(parsedData) ? parsedData : []);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setTipoActores([]);
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

    const nuevoTipoActor = { nombre: newNombre };

    try {
      await createEntity(nombreTabla, nuevoTipoActor);
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

    const updatedTipoActor = { nombre: editNombre };

    try {
      console.log("📢 Sending update request:", updatedTipoActor);

      await updateEntity(nombreTabla, id, updatedTipoActor);

      setEditId(null);
      setEditNombre("");
      fetchData();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("❗¿Estás seguro de que deseas eliminar este tipo de actor?");
    if (!isConfirmed) return;

    try {
      await deleteEntity(nombreTabla, id);
      fetchData();
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  };

  return (
    <div className="tipo-actor-container">
      <h2 className="tipo-actor-title">Tipos de Actores</h2>

      {/* ✅ Input para nuevo tipo de actor */}
      <div>
        <input
          type="text"
          className="input-field"
          placeholder="Nuevo tipo de actor"
          value={newNombre}
          onChange={(e) => setNewNombre(e.target.value)}
        />
        <button className="add-button" onClick={handleCreate}>➕ Agregar</button>
      </div>

      {/* ✅ Lista de Tipos de Actores */}
      <ul className="list">
        {tipoActores.map((item) => (
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

export default TipoActor;
