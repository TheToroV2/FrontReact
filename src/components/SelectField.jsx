import React from "react";

const SelectField = ({ label, value, options, onChange }) => {
  return (
    <div className="select-group">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">-- Selecciona una opción --</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;

