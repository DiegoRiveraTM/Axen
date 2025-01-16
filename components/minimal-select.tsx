import React from 'react';

interface MinimalSelectProps {
  label: string;
  value: any;
  onChange: (selectedOption: any) => void;
  options: { category: string; color: string; programs: string[] }[];
  styles?: any; // Añadir esta línea para aceptar la propiedad styles
}

export const MinimalSelect: React.FC<MinimalSelectProps> = ({ label, value, onChange, options, styles }) => {
  return (
    <div>
      <label>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles && styles.menu ? styles.menu({}) : {}}
      >
        {options.map((option, index) => (
          <optgroup key={index} label={option.category}>
            {option.programs.map((program, idx) => (
              <option key={idx} value={program} className={option.color}>
                {program}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};
