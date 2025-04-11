const BASE_URL = "http://localhost:5266/api/proyecto";

// ✅ GET: Get all entities from a specific table dynamically
export const getAllEntities = async (nombreTabla) => {
  try {
    const response = await fetch(`http://localhost:5266/api/proyecto/${nombreTabla}`);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`❌ Error al obtener entidades (${response.status}): ${text}`);
    }

    const responseText = await response.text();

    try {
      const parsed = JSON.parse(responseText);
      return Array.isArray(parsed)
        ? parsed
        : parsed?.message?.startsWith("[")
        ? JSON.parse(parsed.message)
        : [];
    } catch {
      console.warn("⚠️ No se pudo parsear JSON:", responseText);
      return [];
    }
  } catch (error) {
    console.error("❌ Error en la solicitud GET:", error.message);
    return [];
  }
};



// ✅ POST: Create a new entity in a table
export const createEntity = async (nombreTabla, datosEntidad) => {
  try {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(nombreTabla)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosEntidad),
    });

    if (!response.ok) {
      throw new Error(`❌ Error al crear entidad: ${response.status}`);
    }

     // Read response as text first
    const responseText = await response.text();
    console.log("📥 API Response:", responseText); 

    // 🔄 Check if response is JSON or plain text
    return responseText.startsWith("{") ? JSON.parse(responseText) : { message: responseText };

  } catch (error) {
    console.error("❌ Error en la solicitud POST:", error);
    throw error;
  }
};

// ✅ PUT: Update an entity by ID (safer version with correct URL)
export const updateEntity = async (nombreTabla, id, updatedData) => {
  try {
    const response = await fetch(
      `http://localhost:5266/api/proyecto/${nombreTabla}/id/${id}`, // ✅ Ahora incluye 
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      }
    );

    const responseText = await response.text();

console.log("📢 Raw response text:", responseText); // Debugging

if (!response.ok) {
  throw new Error(`❌ Error al actualizar entidad: ${response.status} - ${responseText}`);
}

// ✅ Manejar respuesta que no es JSON
return responseText.startsWith("{") ? JSON.parse(responseText) : { message: responseText };

  } catch (error) {
    console.error("❌ Error en la solicitud PUT:", error);
    return { message: "Unexpected response format or network error" };
  }
};

// ✅ DELETE: Delete an entity by ID
export const deleteEntity = async (nombreTabla, id) => {
  try {
    const response = await fetch(
      `http://localhost:5266/api/proyecto/${nombreTabla}/id/${id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`❌ Error al eliminar entidad: ${response.status}`);
    }

    const responseText = await response.text();
    return responseText.startsWith("{") ? JSON.parse(responseText) : { message: responseText };

  } catch (error) {
    console.error("❌ Error en la solicitud DELETE:", error);
    throw error;
  }
};
