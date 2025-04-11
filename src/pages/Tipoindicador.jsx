import { useEffect, useState } from "react";
import { getAllEntities, createEntity, updateEntity, deleteEntity } from "../services/apiService";
import "../styles/TipoIndicador.css";
import { useNavigate } from "react-router-dom";

const TipoIndicador = () => {
  const navigate = useNavigate();
  const [tipoIndicadores, setTipoIndicadores] = useState([]);
  const [newNombre, setNewNombre] = useState("");
  const [editId, setEditId] = useState(null);
  const [editNombre, setEditNombre] = useState("");

  const nombreTabla = "tipoindicador"; 

  const fetchData = async () => {
    try {
      const data = await getAllEntities(nombreTabla);
      console.log("📢 API Response:", data);

      const parsedData = data && typeof data.message === "string" 
        ? JSON.parse(data.message) 
        : [];

      setTipoIndicadores(Array.isArray(parsedData) ? parsedData : []);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setTipoIndicadores([]);
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

    const nuevoTipo = { nombre: newNombre };

    try {
      await createEntity(nombreTabla, nuevoTipo);
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

    const updatedTipo = { nombre: editNombre };

    try {
      console.log("📢 Sending update request:", updatedTipo);

      await updateEntity("tipoindicador", id, updatedTipo);

      setEditId(null);
      setEditNombre("");
      fetchData();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("❗¿Estás seguro de que deseas eliminar esta entidad?");
    if (!isConfirmed) return;

    try {
      await deleteEntity(nombreTabla, id);
      fetchData();
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Tipo Indicador</h2>

      {/* Input para nuevo tipo */}
      <div>
      <input
  type="text"
  className="input-field"
  placeholder="Nuevo Tipo Indicador"
  value={newNombre}
  onChange={(e) => setNewNombre(e.target.value)}
/>
        <button className="add-button" onClick={handleCreate}>➕ Agregar</button>
      </div>

      {/* ✅ Lista de Tipos */}
      <ul className="list">
  {tipoIndicadores.map((item) => (
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
        ⬅️ Volver a Inicio
      </button>
    </div>
  );
};

export default TipoIndicador;
