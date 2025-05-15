import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ejecutarConsultaParametrizada, createEntity, updateEntity } from "../services/apiService";

const Articulo = () => {
  const navigate = useNavigate();
  const nombreTabla = "articulo";

  const [articulos, setArticulos] = useState([]);
  const [secciones, setSecciones] = useState([]);
  const [subsecciones, setSubsecciones] = useState([]);

  const [newArticulo, setNewArticulo] = useState({ nombre: "", descripcion: "", fkidseccion: "", fkidsubseccion: "" });
  const [editId, setEditId] = useState(null);
  const [editArticulo, setEditArticulo] = useState({ nombre: "", descripcion: "", fkidseccion: "", fkidsubseccion: "" });

  const fetchData = async () => {
    try {
      const [artData, secData, subsecData] = await Promise.all([
        ejecutarConsultaParametrizada("articulo", "SELECT id, nombre, descripcion, fkidseccion, fkidsubseccion FROM articulo"),
        ejecutarConsultaParametrizada("seccion", "SELECT id, nombre FROM seccion"),
        ejecutarConsultaParametrizada("subseccion", "SELECT id, nombre FROM subseccion")
      ]);
      setArticulos(artData || []);
      setSecciones(secData || []);
      setSubsecciones(subsecData || []);
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    try {
      await createEntity(nombreTabla, newArticulo);
      setNewArticulo({ nombre: "", descripcion: "", fkidseccion: "", fkidsubseccion: "" });
      fetchData();
    } catch (error) {
      console.error("❌ Error al crear artículo:", error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateEntity(nombreTabla, id, editArticulo);
      setEditId(null);
      setEditArticulo({ nombre: "", descripcion: "", fkidseccion: "", fkidsubseccion: "" });
      fetchData();
    } catch (error) {
      console.error("❌ Error al actualizar artículo:", error);
    }
  };

  return (
    <div className="articulo-container">
      <h2>📄 Artículos</h2>

      {/* 🔹 Crear artículo */}
      <div>
        <input
          type="text"
          placeholder="Nombre"
          value={newArticulo.nombre}
          onChange={(e) => setNewArticulo({ ...newArticulo, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newArticulo.descripcion}
          onChange={(e) => setNewArticulo({ ...newArticulo, descripcion: e.target.value })}
        />
        
        <select
          value={newArticulo.fkidseccion}
          onChange={(e) => setNewArticulo({ ...newArticulo, fkidseccion: e.target.value })}
        >
          <option value="">Selecciona Sección</option>
          {secciones.map(sec => <option key={sec.id} value={sec.id}>{sec.nombre}</option>)}
        </select>

        <select
          value={newArticulo.fkidsubseccion}
          onChange={(e) => setNewArticulo({ ...newArticulo, fkidsubseccion: e.target.value })}
        >
          <option value="">Selecciona Subsección</option>
          {subsecciones.map(sub => <option key={sub.id} value={sub.id}>{sub.nombre}</option>)}
        </select>

        <button onClick={handleCreate}>➕ Agregar</button>
      </div>

      {/* 🔹 Lista de artículos */}
      <ul>
        {articulos.map((item) => (
          <li key={item.id}>
            {editId === item.id ? (
              <>
                <input
                  type="text"
                  value={editArticulo.nombre}
                  onChange={(e) => setEditArticulo({ ...editArticulo, nombre: e.target.value })}
                />
                <input
                  type="text"
                  value={editArticulo.descripcion}
                  onChange={(e) => setEditArticulo({ ...editArticulo, descripcion: e.target.value })}
                />
                
                <select
                  value={editArticulo.fkidseccion}
                  onChange={(e) => setEditArticulo({ ...editArticulo, fkidseccion: e.target.value })}
                >
                  {secciones.map(sec => <option key={sec.id} value={sec.id}>{sec.nombre}</option>)}
                </select>

                <select
                  value={editArticulo.fkidsubseccion}
                  onChange={(e) => setEditArticulo({ ...editArticulo, fkidsubseccion: e.target.value })}
                >
                  {subsecciones.map(sub => <option key={sub.id} value={sub.id}>{sub.nombre}</option>)}
                </select>

                <button onClick={() => handleUpdate(item.id)}>💾 Guardar</button>
              </>
            ) : (
              <>
                <strong>{item.nombre}</strong> - {item.descripcion} <br />
                🏷 Sección: {secciones.find(s => s.id === item.fkidseccion)?.nombre || "N/A"} | 
                🔸 Subsección: {subsecciones.find(s => s.id === item.fkidsubseccion)?.nombre || "N/A"}
                <br />
                <button onClick={() => {
                  setEditId(item.id);
                  setEditArticulo({
                    nombre: item.nombre,
                    descripcion: item.descripcion,
                    fkidseccion: item.fkidseccion,
                    fkidsubseccion: item.fkidsubseccion
                  });
                }}>✏ Editar</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button onClick={() => navigate("/")}>⬅ Volver</button>
    </div>
  );
};

export default Articulo;
