import { useEffect, useState } from "react";
import { getAllEntities, createEntity, updateEntity, deleteEntity } from "../services/apiService";
import "../styles/Unidadmediciones.css";
import { useNavigate } from "react-router-dom";

const UnidadMediciones = () => {
  const navigate = useNavigate();
  const [unidadMediciones, setUnidadMediciones] = useState([]);
  const [newDescripcion, setNewDescripcion] = useState("");
  const [editId, setEditId] = useState(null);
  const [editDescripcion, setEditDescripcion] = useState("");

  const nombreTabla = "unidadmedicion"; 

  const fetchData = async () => {
    try {
      const data = await getAllEntities(nombreTabla);
      console.log("📢 API Response:", data);
  
      setUnidadMediciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setUnidadMediciones([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newDescripcion.trim()) {  // ✅ CORREGIDO
      alert("❌ Ingresa una descripción válida.");
      return;
    }

    const nuevaUnidad = { descripcion: newDescripcion };

    try {
      await createEntity(nombreTabla, nuevaUnidad);
      setNewDescripcion("");  // ✅ CORREGIDO
      fetchData();
    } catch (error) {
      console.error("❌ No se pudo crear:", error.message);
    }
  };

  const handleUpdate = async (id) => {
    if (!editDescripcion.trim()) {  // ✅ CORREGIDO
      alert("❌ Ingresa una descripción válida.");
      return;
    }

    const updatedUnidad = { descripcion: editDescripcion };

    try {
      console.log("📢 Sending update request:", updatedUnidad);

      await updateEntity(nombreTabla, id, updatedUnidad);

      setEditId(null);
      setEditDescripcion("");
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
    <div className="unidad-mediciones-container">
      <h2 className="unidad-mediciones-title">Unidad Mediciones</h2>

      {/* ✅ Input para nueva unidad */}
      <div>
        <input
          type="text"
          className="input-field"
          placeholder="Nueva Unidad de Medición"
          value={newDescripcion}
          onChange={(e) => setNewDescripcion(e.target.value)}
        />
        <button className="add-button" onClick={handleCreate}>➕ Agregar</button>
      </div>

      {/* ✅ Lista de Unidades */}
      <ul className="list">
        {unidadMediciones.map((item) => (
          <li key={item.id} className="list-item">
            {editId === item.id ? (
              <div className="edit-group">
                <input
                  type="text"
                  value={editDescripcion}
                  onChange={(e) => setEditDescripcion(e.target.value)}
                />
                <button className="save-button" onClick={() => handleUpdate(item.id)}>💾 Guardar</button>
              </div>
            ) : (
              <>
                {item.descripcion} {/* ✅ CORREGIDO */}
                <div className="button-group">
                  <button className="edit-button" onClick={() => { setEditId(item.id); setEditDescripcion(item.descripcion); }}>
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

export default UnidadMediciones;
