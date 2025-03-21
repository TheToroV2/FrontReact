import { useEffect, useState } from "react";
import { getAllEntities, createEntity, updateEntity, deleteEntity } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import "../styles/Fuente.css";

const Frecuencia = () => {
  const navigate = useNavigate();
  const [frecuencias, setFrecuencias] = useState([]);
  const [nuevaFrecuencia, setNuevaFrecuencia] = useState("");
  const [idEditando, setIdEditando] = useState(null);
  const [nombreEditando, setNombreEditando] = useState("");

  const nombreTabla = "frecuencia";

  const cargarFrecuencias = async () => {
    try {
      const data = await getAllEntities(nombreTabla);
      console.log("📢 API Response:", data);

      const parsedData = data?.message && typeof data.message === "string"
        ? JSON.parse(data.message)
        : [];

      setFrecuencias(Array.isArray(parsedData) ? parsedData : []);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setFrecuencias([]);
    }
  };

  useEffect(() => {
    cargarFrecuencias();
  }, []);

  const crearFrecuencia = async () => {
    if (!nuevaFrecuencia.trim()) {
      alert("❌ Ingresa un nombre válido.");
      return;
    }

    const nuevaEntrada = { nombre: nuevaFrecuencia };

    try {
      await createEntity(nombreTabla, nuevaEntrada);
      setNuevaFrecuencia("");
      cargarFrecuencias();
    } catch (error) {
      console.error("❌ No se pudo crear:", error.message);
    }
  };

  const actualizarFrecuencia = async (id) => {
    if (!nombreEditando.trim()) {
      alert("❌ Ingresa un nombre válido.");
      return;
    }

    const frecuenciaActualizada = { nombre: nombreEditando };

    try {
      console.log("📢 Sending update request:", frecuenciaActualizada);

      await updateEntity(nombreTabla, id, frecuenciaActualizada);

      setIdEditando(null);
      setNombreEditando("");
      cargarFrecuencias();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
    }
  };

  const eliminarFrecuencia = async (id) => {
    const isConfirmed = window.confirm("❗¿Estás seguro de que deseas eliminar esta frecuencia?");
    if (!isConfirmed) return;

    try {
      await deleteEntity(nombreTabla, id);
      cargarFrecuencias();
    } catch (error) {
      console.error("❌ Error al eliminar el registro:", error);
    }
  };

  return (
    <div className="frecuencia-container">
      <h2 className="frecuencia-title">Frecuencia</h2>

      {/* ✅ Input para nueva frecuencia */}
      <div>
        <input
          type="text"
          className="input-field"
          placeholder="Nueva frecuencia"
          value={nuevaFrecuencia}
          onChange={(e) => setNuevaFrecuencia(e.target.value)}
        />
        <button className="add-button" onClick={crearFrecuencia}>➕ Agregar</button>
      </div>

      {/* ✅ Lista de Frecuencias */}
      <ul className="list">
        {frecuencias.map((item) => (
          <li key={item.id} className="list-item">
            {idEditando === item.id ? (
              <div className="edit-group">
                <input
                  type="text"
                  value={nombreEditando}
                  onChange={(e) => setNombreEditando(e.target.value)}
                />
                <button className="save-button" onClick={() => actualizarFrecuencia(item.id)}>💾 Guardar</button>
              </div>
            ) : (
              <>
                {item.nombre} {/* ✅ Mostrar nombre correctamente */}
                <div className="button-group">
                  <button className="edit-button" onClick={() => { setIdEditando(item.id); setNombreEditando(item.nombre); }}>
                    ✏ Editar
                  </button>
                  <button className="delete-button" onClick={() => eliminarFrecuencia(item.id)}>
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

export default Frecuencia;

