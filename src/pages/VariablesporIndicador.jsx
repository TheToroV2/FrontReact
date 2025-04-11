import { useEffect, useState } from "react";
import { 
  getAllEntities, 
  createEntity, 
  updateEntity, 
  deleteEntity
} from "../services/apiservice";
import { useNavigate } from "react-router-dom";
import "../styles/BasicStyles.css";

const VariablesPorIndicador = () => {
  const navigate = useNavigate();
  const [variables, setVariables] = useState([]);
  const [newData, setNewData] = useState({
    fkidvariable: "",
    fkindicador: "",
    dato: "",
    fkemailusuario: "",
    fechadato: new Date().toISOString().split('T')[0]
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [variablesList, setVariablesList] = useState([]);
  const [indicadores, setIndicadores] = useState([]);

  const nombreTabla = "variablesporindicador";

  const fetchData = async () => {
    try {
      // Cargar relaciones variables-por-indicador
      const data = await getAllEntities(nombreTabla);
      const parsedData = data?.message && typeof data.message === "string"
        ? JSON.parse(data.message)
        : [];
      setVariables(Array.isArray(parsedData) ? parsedData : []);

      // Cargar variables e indicadores para los selects
      const [varsData, indData] = await Promise.all([
        getAllEntities("variable"),
        getAllEntities("indicador")
      ]);
      setVariablesList(varsData || []);
      setIndicadores(indData || []);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newData.fkidvariable || !newData.fkindicador || !newData.dato || !newData.fkemailusuario) {
      alert("❌ Todos los campos son requeridos.");
      return;
    }

    try {
      await createEntity(nombreTabla, newData);
      setNewData({
        fkidvariable: "",
        fkindicador: "",
        dato: "",
        fkemailusuario: "",
        fechadato: new Date().toISOString().split('T')[0]
      });
      fetchData();
    } catch (error) {
      console.error("❌ No se pudo crear:", error.message);
    }
  };

  const handleUpdate = async (id) => {
    if (!editData.fkidvariable || !editData.fkindicador || !editData.dato || !editData.fkemailusuario) {
      alert("❌ Todos los campos son requeridos.");
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
    const isConfirmed = window.confirm("❗¿Estás seguro de eliminar esta relación?");
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
    <div className="variables-container">
      <h2 className="variables-title">Variables por Indicador</h2>

      {/* Formulario para nueva relación */}
      <div className="form-container">
        <h3>Agregar Nueva Relación</h3>
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
          <label>Variable:</label>
          <select
            name="fkidvariable"
            value={newData.fkidvariable}
            onChange={handleInputChange}
          >
            <option value="">Seleccione una variable</option>
            {variablesList.map(variable => (
              <option key={variable.id} value={variable.id}>
                {variable.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Dato:</label>
          <input
            type="number"
            step="0.01"
            name="dato"
            value={newData.dato}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Email Usuario:</label>
          <input
            type="email"
            name="fkemailusuario"
            value={newData.fkemailusuario}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Fecha del Dato:</label>
          <input
            type="date"
            name="fechadato"
            value={newData.fechadato}
            onChange={handleInputChange}
          />
        </div>
        <button className="add-button" onClick={handleCreate}>➕ Agregar</button>
      </div>

      {/* Lista de Relaciones */}
      <ul className="list">
        {variables.map((item) => (
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
                  <label>Variable:</label>
                  <select
                    name="fkidvariable"
                    value={editData.fkidvariable || item.fkidvariable}
                    onChange={(e) => handleInputChange(e, true)}
                  >
                    <option value="">Seleccione una variable</option>
                    {variablesList.map(variable => (
                      <option key={variable.id} value={variable.id}>
                        {variable.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Dato:</label>
                  <input
                    type="number"
                    step="0.01"
                    name="dato"
                    value={editData.dato || item.dato}
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
                  <span className="item-variable">
                    {variablesList.find(v => v.id === item.fkidvariable)?.nombre || 'Variable no encontrada'}
                  </span>
                  <span className="item-dato">{item.dato}</span>
                  <span className="item-fecha">
                    {new Date(item.fechadato).toLocaleDateString()}
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

export default VariablesPorIndicador;