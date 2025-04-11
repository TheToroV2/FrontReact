import { useEffect, useState } from "react";
import { 
  getAllEntities, 
  createEntity, 
  updateEntity, 
  deleteEntity,
  getEntityByKey
} from "../services/apiservice";
import { useNavigate } from "react-router-dom";
import "../styles/ResultadoIndicador.css";

const ResultadoIndicador = () => {
  const navigate = useNavigate();
  const [resultados, setResultados] = useState([]);
  const [newData, setNewData] = useState({
    resultado: "",
    fechacalculo: new Date().toISOString().split('T')[0],
    fkindicador: ""
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [indicadores, setIndicadores] = useState([]);

  const nombreTabla = "resultadoindicador";

  const fetchData = async () => {
    try {
      // Cargar resultados
      const data = await getAllEntities(nombreTabla);
      const parsedData = data?.message && typeof data.message === "string"
        ? JSON.parse(data.message)
        : [];
      setResultados(Array.isArray(parsedData) ? parsedData : []);

      // Cargar indicadores para el select
      const indicadoresData = await getAllEntities("indicador");
      setIndicadores(indicadoresData || []);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newData.resultado || !newData.fkindicador) {
      alert("❌ Resultado e Indicador son campos requeridos.");
      return;
    }

    try {
      await createEntity(nombreTabla, newData);
      setNewData({
        resultado: "",
        fechacalculo: new Date().toISOString().split('T')[0],
        fkindicador: ""
      });
      fetchData();
    } catch (error) {
      console.error("❌ No se pudo crear:", error.message);
    }
  };

  const handleUpdate = async (id) => {
    if (!editData.resultado || !editData.fkindicador) {
      alert("❌ Resultado e Indicador son campos requeridos.");
      return;
    }

    try {
      await updateEntity(nombreTabla, id, editData);
      setEditId(null);
      setEditData({});
      fetchData();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("❗¿Estás seguro de eliminar este resultado?");
    if (!isConfirmed) return;

    try {
      await deleteEntity(nombreTabla, id);
      fetchData();
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditData(prev => ({ ...prev, [name]: value }));
    } else {
      setNewData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="resultado-container">
      <h2 className="resultado-title">Resultados de Indicadores</h2>

      {/* Formulario para nuevo resultado */}
      <div className="form-container">
        <h3>Agregar Nuevo Resultado</h3>
        <div className="form-group">
          <label>Indicador:</label>
          <select
            name="fkindicador"
            value={newData.fkindicador}
            onChange={handleInputChange}
          >
            <option value="">Seleccione un indicador</option>
            {indicadores.map(indicador => (
              <option key={indicador.id} value={indicador.id}>
                {indicador.codigo} - {indicador.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Resultado:</label>
          <input
            type="number"
            step="0.01"
            name="resultado"
            value={newData.resultado}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Fecha de Cálculo:</label>
          <input
            type="date"
            name="fechacalculo"
            value={newData.fechacalculo}
            onChange={handleInputChange}
          />
        </div>
        <button className="add-button" onClick={handleCreate}>➕ Agregar</button>
      </div>

      {/* Lista de Resultados */}
      <ul className="list">
        {resultados.map((item) => (
          <li key={item.id} className="list-item">
            {editId === item.id ? (
              <div className="edit-container">
                <div className="form-group">
                  <label>Indicador:</label>
                  <select
                    name="fkindicador"
                    value={editData.fkindicador || item.fkindicador}
                    onChange={(e) => handleInputChange(e, true)}
                  >
                    <option value="">Seleccione un indicador</option>
                    {indicadores.map(indicador => (
                      <option key={indicador.id} value={indicador.id}>
                        {indicador.codigo} - {indicador.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Resultado:</label>
                  <input
                    type="number"
                    step="0.01"
                    name="resultado"
                    value={editData.resultado || item.resultado}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div className="button-group">
                  <button className="save-button" onClick={() => handleUpdate(item.id)}>💾 Guardar</button>
                  <button className="cancel-button" onClick={() => setEditId(null)}>❌ Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="item-info">
                  <span className="item-indicador">
                    {indicadores.find(i => i.id === item.fkindicador)?.codigo || 'Indicador no encontrado'}
                  </span>
                  <span className="item-resultado">{item.resultado}</span>
                  <span className="item-fecha">
                    {new Date(item.fechacalculo).toLocaleDateString()}
                  </span>
                </div>
                <div className="button-group">
                  <button 
                    className="edit-button" 
                    onClick={() => {
                      setEditId(item.id);
                      setEditData({ ...item });
                    }}
                  >
                    ✏ Editar
                  </button>
                  <button 
                    className="delete-button" 
                    onClick={() => handleDelete(item.id)}
                  >
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

export default ResultadoIndicador;