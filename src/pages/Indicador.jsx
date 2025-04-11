import { useEffect, useState } from "react";
import { getAllEntities, createEntity, updateEntity, deleteEntity } from "../services/apiService";
import { useNavigate } from "react-router-dom";

const Indicador = () => {
  const navigate = useNavigate();
  const [indicadores, setIndicadores] = useState([]);
  const [newData, setNewData] = useState({
    codigo: "",
    nombre: "",
    fkidtipoindicador: "",
    fkidunidadmedicion: "",
    fkidsentido: "",
    fkidfrecuencia: ""
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [relaciones, setRelaciones] = useState({
    tipos: [],
    unidades: [],
    sentidos: [],
    frecuencias: []
  });

  const tabla = "indicador";

  const fetchData = async () => {
    try {
      const [indics, tipos, unidades, sentidos, frecuencias] = await Promise.all([
        getAllEntities(tabla),
        getAllEntities("tipoindicador"),
        getAllEntities("unidadmedicion"),
        getAllEntities("sentido"),
        getAllEntities("frecuencia")
      ]);

      setIndicadores(indics || []);
      setRelaciones({
        tipos: tipos || [],
        unidades: unidades || [],
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

  const handleChange = (e, edit = false) => {
    const { name, value } = e.target;
    if (edit) {
      setEditData(prev => ({ ...prev, [name]: value }));
    } else {
      setNewData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCreate = async () => {
    try {
      await createEntity(tabla, newData);
      setNewData({ codigo: "", nombre: "", fkidtipoindicador: "", fkidunidadmedicion: "", fkidsentido: "", fkidfrecuencia: "" });
      fetchData();
    } catch (error) {
      console.error("❌ No se pudo crear:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateEntity(tabla, id, editData);
      setEditId(null);
      setEditData({});
      fetchData();
    } catch (error) {
      console.error("❌ Error al actualizar:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este indicador?")) return;
    try {
      await deleteEntity(tabla, id);
      fetchData();
    } catch (error) {
      console.error("❌ Error al eliminar:", error);
    }
  };

  return (
    <div>
      <h2>Indicadores</h2>

      {/* ➕ Crear */}
      <div>
        <input name="codigo" placeholder="Código" value={newData.codigo} onChange={handleChange} />
        <input name="nombre" placeholder="Nombre" value={newData.nombre} onChange={handleChange} />

        <select name="fkidtipoindicador" value={newData.fkidtipoindicador} onChange={handleChange}>
          <option value="">Tipo Indicador</option>
          {relaciones.tipos.map(t => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>

        <select name="fkidunidadmedicion" value={newData.fkidunidadmedicion} onChange={handleChange}>
          <option value="">Unidad Medición</option>
          {relaciones.unidades.map(u => (
            <option key={u.id} value={u.id}>{u.descripcion}</option>
          ))}
        </select>

        <select name="fkidsentido" value={newData.fkidsentido} onChange={handleChange}>
          <option value="">Sentido</option>
          {relaciones.sentidos.map(s => (
            <option key={s.id} value={s.id}>{s.descripcion || s.nombre}</option>
          ))}
        </select>

        <select name="fkidfrecuencia" value={newData.fkidfrecuencia} onChange={handleChange}>
          <option value="">Frecuencia</option>
          {relaciones.frecuencias.map(f => (
            <option key={f.id} value={f.id}>{f.descripcion || f.nombre}</option>
          ))}
        </select>

        <button onClick={handleCreate}>Agregar</button>
      </div>

      {/* 📋 Lista */}
      <ul>
        {indicadores.map(i => (
          <li key={i.id}>
            {editId === i.id ? (
              <>
                <input name="codigo" value={editData.codigo || ""} onChange={(e) => handleChange(e, true)} />
                <input name="nombre" value={editData.nombre || ""} onChange={(e) => handleChange(e, true)} />
                <button onClick={() => handleUpdate(i.id)}>Guardar</button>
                <button onClick={() => setEditId(null)}>Cancelar</button>
              </>
            ) : (
              <>
                <strong>{i.codigo}</strong> - {i.nombre}
                <div>
                  Tipo: {relaciones.tipos.find(t => t.id === i.fkidtipoindicador)?.nombre || 'N/A'} | 
                  Unidad: {relaciones.unidades.find(u => u.id === i.fkidunidadmedicion)?.descripcion || 'N/A'} | 
                  Sentido: {relaciones.sentidos.find(s => s.id === i.fkidsentido)?.descripcion || 'N/A'} | 
                  Frecuencia: {relaciones.frecuencias.find(f => f.id === i.fkidfrecuencia)?.descripcion || 'N/A'}
                </div>
                <button onClick={() => { setEditId(i.id); setEditData(i); }}>Editar</button>
                <button onClick={() => handleDelete(i.id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button onClick={() => navigate("/")}>Volver al inicio</button>
    </div>
  );
};

export default Indicador;

