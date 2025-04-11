import { useEffect, useState } from "react";
import { 
  getAllEntities, 
  createEntity, 
  deleteEntity
} from "../services/apiservice";
import { useNavigate } from "react-router-dom";
import "../styles/RelacionBase.css";

const FuentesPorIndicador = () => {
  const navigate = useNavigate();
  const [relaciones, setRelaciones] = useState([]);
  const [newData, setNewData] = useState({
    fkidindicador: "",
    fkidfuente: ""
  });
  const [indicadores, setIndicadores] = useState([]);
  const [fuentes, setFuentes] = useState([]);

  const fetchData = async () => {
    try {
      const [rels, inds, fts] = await Promise.all([
        getAllEntities("fuentesporindicador"),
        getAllEntities("indicador"),
        getAllEntities("fuente")
      ]);
      
      setRelaciones(rels || []);
      setIndicadores(inds || []);
      setFuentes(fts || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    if (!newData.fkidindicador || !newData.fkidfuente) {
      alert("Seleccione ambos campos");
      return;
    }

    try {
      await createEntity("fuentesporindicador", newData);
      setNewData({ fkidindicador: "", fkidfuente: "" });
      fetchData();
    } catch (error) {
      console.error("Error creando:", error);
    }
  };

  const handleDelete = async (idFuente, idIndicador) => {
    if (!window.confirm("¿Eliminar esta relación?")) return;
    try {
      await deleteEntity(
        "fuentesporindicador", 
        `fkidfuente/${idFuente}/fkidindicador/${idIndicador}`
      );
      fetchData();
    } catch (error) {
      console.error("Error eliminando:", error);
    }
  };

  return (
    <div className="relacion-container">
      <h2>Fuentes por Indicador</h2>

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
          <label>Fuente:</label>
          <select
            value={newData.fkidfuente}
            onChange={(e) => setNewData({...newData, fkidfuente: e.target.value})}
          >
            <option value="">Seleccione...</option>
            {fuentes.map(f => (
              <option key={f.id} value={f.id}>{f.nombre}</option>
            ))}
          </select>
        </div>

        <button onClick={handleCreate}>Agregar Relación</button>
      </div>

      <ul className="list">
        {relaciones.map(rel => {
          const indicador = indicadores.find(i => i.id === rel.fkidindicador);
          const fuente = fuentes.find(f => f.id === rel.fkidfuente);
          
          return (
            <li key={`${rel.fkidfuente}-${rel.fkidindicador}`}>
              <span>{indicador?.codigo || 'ID:'+rel.fkidindicador}</span>
              <span> ↔ </span>
              <span>{fuente?.nombre || 'ID:'+rel.fkidfuente}</span>
              
              <div className="button-group">
                <button 
                  className="delete-button"
                  onClick={() => handleDelete(rel.fkidfuente, rel.fkidindicador)}
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

export default FuentesPorIndicador;