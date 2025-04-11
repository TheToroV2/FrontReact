import { useEffect, useState } from "react";
import { 
  getAllEntities, 
  createEntity, 
  updateEntity, 
  deleteEntity
} from "../services/apiservice";
import { useNavigate } from "react-router-dom";
import "../styles/RelacionBase.css";

const RepresenVisualPorIndicador = () => {
  const navigate = useNavigate();
  const [relaciones, setRelaciones] = useState([]);
  const [newData, setNewData] = useState({
    fkidindicador: "",
    fkidrepresenvisual: ""
  });
  const [editId, setEditId] = useState(null);
  const [indicadores, setIndicadores] = useState([]);
  const [representaciones, setRepresentaciones] = useState([]);

  const fetchData = async () => {
    try {
      const [rels, inds, reps] = await Promise.all([
        getAllEntities("represenvisualporindicador"),
        getAllEntities("indicador"),
        getAllEntities("represenvisual")
      ]);
      
      setRelaciones(rels || []);
      setIndicadores(inds || []);
      setRepresentaciones(reps || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!newData.fkidindicador || !newData.fkidrepresenvisual) {
      alert("Seleccione ambos campos");
      return;
    }

    try {
      await createEntity("represenvisualporindicador", newData);
      setNewData({ fkidindicador: "", fkidrepresenvisual: "" });
      fetchData();
    } catch (error) {
      console.error("Error creando:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta relación?")) return;
    try {
      await deleteEntity("represenvisualporindicador", "id", id);
      fetchData();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  return (
    <div className="relacion-container">
      <h2>Representaciones Visuales por Indicador</h2>

      <div className="form-container">
        <div className="form-group">
          <label>Indicador:</label>
          <select
            value={newData.fkidindicador}
            onChange={(e) => setNewData({...newData, fkidindicador: e.target.value})}
          >
            <option value="">Seleccione...</option>
            {indicadores.map(i => (
              <option key={i.id} value={i.id}>{i.codigo} - {i.nombre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Representación Visual:</label>
          <select
            value={newData.fkidrepresenvisual}
            onChange={(e) => setNewData({...newData, fkidrepresenvisual: e.target.value})}
          >
            <option value="">Seleccione...</option>
            {representaciones.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
        </div>

        <button onClick={handleCreate}>Agregar Relación</button>
      </div>

      <ul className="list">
        {relaciones.map(rel => {
          const indicador = indicadores.find(i => i.id === rel.fkidindicador);
          const representacion = representaciones.find(r => r.id === rel.fkidrepresenvisual);
          
          return (
            <li key={rel.id}>
              <span>{indicador?.codigo || 'ID:'+rel.fkidindicador}</span>
              <span> ↔ </span>
              <span>{representacion?.nombre || 'ID:'+rel.fkidrepresenvisual}</span>
              
              <div className="button-group">
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(rel.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <button className="back-button" onClick={() => navigate("/")}>
        Volver a Inicio
      </button>
    </div>
  );
};

export default RepresenVisualPorIndicador;