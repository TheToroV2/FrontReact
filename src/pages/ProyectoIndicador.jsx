import { useEffect, useState } from "react";
import { getAllEntities, createEntity, deleteEntity } from "../services/apiService";
import { useNavigate } from "react-router-dom";
import SelectField from "../components/SelectField";
// Opcional, si quieres darle estilo

const ProyectoActor = () => {
  const navigate = useNavigate();
  const [proyectosActores, setProyectosActores] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [actores, setActores] = useState([]);

  const [selectedProyectoId, setSelectedProyectoId] = useState("");
  const [selectedActorId, setSelectedActorId] = useState("");

  const nombreTabla = "fuentesporindicador"; // Esta debe ser el nombre de tu tabla intermedia

  const fetchData = async () => {
    try {
      const pa = await getAllEntities(nombreTabla);
      setProyectosActores(Array.isArray(pa) ? pa : []);

      const indicadorData = await getAllEntities("indicador");
      setProyectos(Array.isArray(indicadorData) ? indicadorData : []);

      const fuentesData = await getAllEntities("fuente");
      setActores(Array.isArray(fuentesData) ? fuentesData : []);
    } catch (error) {
      console.error("❌ Error cargando datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!selectedProyectoId || !selectedActorId) {
      alert("❌ Selecciona un Proyecto y un Actor.");
      return;
    }

    const nuevoRegistro = {
      fkidindicador: parseInt(selectedProyectoId),
      fkidfuente: parseInt(selectedActorId),
    };

    try {
      await createEntity(nombreTabla, nuevoRegistro);
      setSelectedProyectoId("");
      setSelectedActorId("");
      fetchData();
    } catch (error) {
      console.error("❌ Error creando relación:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar esta relación?");
    if (!confirmDelete) return;

    try {
      await deleteEntity(nombreTabla, id);
      fetchData();
    } catch (error) {
      console.error("❌ Error eliminando:", error);
    }
  };

  return (
    <div className="proyectoactor-container">
      <h2>Asignar Actores a Proyectos</h2>
  
      {/* ✅ Select para Proyecto */}
      <SelectField
        label="Indicador"
        value={selectedProyectoId}
        options={proyectos}
        onChange={setSelectedProyectoId}
      />
  
      {/* ✅ Select para Actor */}
      <SelectField
        label="Fuentes"
        value={selectedActorId}
        options={actores}
        onChange={setSelectedActorId}
      />
  
      {/* ✅ Botón para crear la relación */}
      <button onClick={handleCreate}>➕ Asignar</button>
  
      {/* ✅ Lista de relaciones existentes */}
      <ul className="list">
        {proyectosActores.map((item) => {
          const proyecto = proyectos.find((p) => p.id === item.fkidindicador);
          const actor = actores.find((a) => a.id === item.fkidfuente);
  
          return (
            <li key={item.id} className="list-item">
              Proyecto: {proyecto?.nombre || `ID ${item.fkidproyecto}`} | Actor: {actor?.nombre || `ID ${item.fkidactor}`}
              <button className="delete-button" onClick={() => handleDelete(item.id)}>
                🗑 Eliminar
              </button>
            </li>
          );
        })}
      </ul>
  
      {/* ✅ Botón de Volver a Inicio */}
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅️ Volver a Inicio
      </button>
    </div>
  );
}
export default ProyectoActor;