import { useEffect, useState } from "react";
import { getAllEntities, createEntity, updateEntity} from "../services/apiService";
import { useNavigate } from "react-router-dom";
import SelectField from "../components/SelectField";
import "../Styles/Indicador.css"

const Indicador = () => {
  const navigate = useNavigate();
  const [indicador, setIndicador] = useState([]);
  const [tipoindicador, setTipoindicador] = useState([]);
  const [unidadMediciones, setUnidadMediciones] = useState([]);
  const [sentido, setSentido] = useState([]);
  const [frecuencias, setFrecuencias] = useState([]);
  const [articulo, setArticulo] = useState([]);
  const [literal, setLiteral] = useState([]);
  const [numeral, setNumeral] = useState([]);
  const [paragrafo, setParagrafo] = useState([]);


  const [newNombre, setNewNombre] = useState("");
  const [newCodigo, setNewCodigo] = useState("");
  const [newObjetivo, setNewObjetivo] = useState("");
  const [newAlcance, setNewAlcance] = useState("");
  const [newFormula, setNewFormula] = useState("");
  const [newMeta, setNewMeta] = useState("");


  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const nombreTabla = "indicador";

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEntities(nombreTabla);
      setIndicadores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("❌ Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSentido = async () => {
      const data = await getAllEntities("sentido");
      setSentido(data);
    };
    fetchSentido();
  }, []);

  useEffect(() => {
    const fetchUnidadMediciones = async () => {
      const data = await getAllEntities("unidadmedicion");
      setUnidadMediciones(data);
    };
    fetchUnidadMediciones();
  }, []);

  const handleCreate = async () => {
    if (!newNombre.trim() || !newUnidadMedicionId) {
      alert("❌ Faltan campos obligatorios.");
      return;
    }

    const nuevoIndicador = {
      nombre: newNombre,
      descripcion: newDescripcion,
      fkidunidadmedicion: parseInt(newUnidadMedicionId),
    };

    await createEntity(nombreTabla, nuevoIndicador);
    setNewNombre("");
    setNewDescripcion("");
    setNewUnidadMedicionId("");
    fetchData();
  };

  return (
    <div className="indicador-container">
      <h2>Indicador</h2>

      <input
        type="text"
        placeholder="Nombre del indicador"
        value={newNombre}
        onChange={(e) => setNewNombre(e.target.value)}
      />
      <input
        type="text"
        placeholder="Descripción"
        value={newDescripcion}
        onChange={(e) => setNewDescripcion(e.target.value)}
      />
      <select
  value={indicador.fkidsentido}
  onChange={(e) => setIndicador({ ...indicador, fkidsentido: parseInt(e.target.value) })}
>
  <option value="">-- Selecciona un sentido --</option>
  {sentidos.map(s => (
    <option key={s.id} value={s.id}>{s.nombre}</option>
  ))}
</select>
      <SelectField
        label="Unidad de Medición"
        value={newUnidadMedicionId}
        options={unidadMediciones}
        onChange={setNewUnidadMedicionId}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleCreate}>➕ Agregar</button>

      <ul>
        {indicadores.map((item) => (
          <li key={item.id}>{item.nombre} - {item.descripcion}</li>
        ))}
      </ul>
      

      <button onClick={() => navigate("/")}>⬅️ Volver a Inicio</button>
    </div>
  );
};

export default Indicador;