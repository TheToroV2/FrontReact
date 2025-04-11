import { useEffect, useState } from "react";
import { 
  getAllEntities, 
  createEntity, 
  updateEntity, 
  deleteEntity,
  getEntityByKey
} from "../services/apiservice";
import { useNavigate } from "react-router-dom";
import "../styles/Indicador.css";

const Indicador = () => {
  const navigate = useNavigate();
  const [indicadores, setIndicadores] = useState([]);
  const [newData, setNewData] = useState({
    codigo: "",
    nombre: "",
    objetivo: "",
    alcance: "",
    formula: "",
    fkidtipoindicador: "",
    fkidunidadmedicion: "",
    meta: "",
    fkidsentido: "",
    fkidfrecuencia: "",
    fkidarticulo: "",
    fkidliteral: "",
    fkidnumeral: "",
    fkidparagrafo: ""
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [relatedData, setRelatedData] = useState({
    tiposIndicador: [],
    unidadesMedicion: [],
    sentidos: [],
    frecuencias: []
  });

  const nombreTabla = "indicador";

  const fetchData = async () => {
    try {
      // Cargar indicadores
      const data = await getAllEntities(nombreTabla);
      const parsedData = data?.message && typeof data.message === "string"
        ? JSON.parse(data.message)
        : [];
      setIndicadores(Array.isArray(parsedData) ? parsedData : []);

      // Cargar datos relacionados
      const [tipos, unidades, sentidos, frecuencias] = await Promise.all([
        getAllEntities("tipoindicador"),
        getAllEntities("unidadmedicion"),
        getAllEntities("sentido"),
        getAllEntities("frecuencia")
      ]);

      setRelatedData({
        tiposIndicador: tipos || [],
        unidadesMedicion: unidades || [],
        sentidos: sentidos || [],
        frecuencias: frecuencias || []
      });
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newData.codigo.trim() || !newData.nombre.trim()) {
      alert("❌ Código y Nombre son campos requeridos.");
      return;
    }

    try {
      await createEntity(nombreTabla, newData);
      setNewData({
        codigo: "",
        nombre: "",
        objetivo: "",
        alcance: "",
        formula: "",
        fkidtipoindicador: "",
        fkidunidadmedicion: "",
        meta: "",
        fkidsentido: "",
        fkidfrecuencia: "",
        fkidarticulo: "",
        fkidliteral: "",
        fkidnumeral: "",
        fkidparagrafo: ""
      });
      fetchData();
    } catch (error) {
      console.error("❌ No se pudo crear:", error.message);
    }
  };

  const handleUpdate = async (id) => {
    if (!editData.codigo.trim() || !editData.nombre.trim()) {
      alert("❌ Código y Nombre son campos requeridos.");
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
    const isConfirmed = window.confirm("❗¿Estás seguro de eliminar este indicador?");
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
    <div className="indicador-container">
      <h2 className="indicador-title">Indicadores</h2>

      {/* Formulario para nuevo indicador */}
      <div className="form-container">
        <h3>Agregar Nuevo Indicador</h3>
        <div className="form-group">
          <label>Código:</label>
          <input
            type="text"
            name="codigo"
            value={newData.codigo}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={newData.nombre}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Tipo de Indicador:</label>
          <select
            name="fkidtipoindicador"
            value={newData.fkidtipoindicador}
            onChange={handleInputChange}
          >
            <option value="">Seleccione...</option>
            {relatedData.tiposIndicador.map(tipo => (
              <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Unidad de Medición:</label>
          <select
            name="fkidunidadmedicion"
            value={newData.fkidunidadmedicion}
            onChange={handleInputChange}
          >
            <option value="">Seleccione...</option>
            {relatedData.unidadesMedicion.map(unidad => (
              <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
            ))}
          </select>
        </div>
        <button className="add-button" onClick={handleCreate}>➕ Agregar</button>
      </div>

      {/* Lista de Indicadores */}
      <ul className="list">
        {indicadores.map((item) => (
          <li key={item.id} className="list-item">
            {editId === item.id ? (
              <div className="edit-container">
                <div className="form-group">
                  <label>Código:</label>
                  <input
                    type="text"
                    name="codigo"
                    value={editData.codigo || item.codigo}
                    onChange={(e) => handleInputChange(e, true)}
                  />
                </div>
                <div className="form-group">
                  <label>Nombre:</label>
                  <input
                    type="text"
                    name="nombre"
                    value={editData.nombre || item.nombre}
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
                  <span className="item-code">{item.codigo}</span>
                  <span className="item-name">{item.nombre}</span>
                  <span className="item-type">
                    Tipo: {relatedData.tiposIndicador.find(t => t.id === item.fkidtipoindicador)?.nombre || 'N/A'}
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
                  <button 
                    className="details-button"
                    onClick={() => navigate(`/indicador/${item.id}`)}
                  >
                    🔍 Detalles
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

export default Indicador;