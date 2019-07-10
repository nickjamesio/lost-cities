import { useState } from "react";

const useFormField = (defaultVal = "") => {
  const [field, setField] = useState(defaultVal);

  const handleChange = event => {
    setField(event.target.value);
  };

  return {
    field,
    handleChange
  };
};

export { useFormField };
