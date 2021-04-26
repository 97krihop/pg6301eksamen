import React, { Dispatch, SetStateAction } from "react";

export interface props {
  value: string | number | undefined;
  onValueChange: Dispatch<SetStateAction<string>>;
  type?: string;
  label: string;
}

export const InputField = ({
  value,
  onValueChange,
  type = "text",
  label,
}: props) => {
  return (
    <div>
      <label>
        {label}:{" "}
        <input
          type={type}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
        />
      </label>
    </div>
  );
};
