import { useState } from "react";

const useFormFields = (defaultVals) => {
  const [fields, setFields] = useState(defaultVals);

  const handleChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setFields(prevValue => (
        {...prevValue, [name]: value}
    ));
  };

  return {
    fields,
    handleChange
  };
};

export { useFormFields };
