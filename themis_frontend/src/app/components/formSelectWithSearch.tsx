import AsyncSelect from "react-select/async";
import { SingleValue } from "react-select";
import { useState, useMemo } from "react";
import debounce from "lodash/debounce";

interface FormSelectWithSearchProps {
  title?: string;
  value?: { id: string | number; name: string; value?: string | number; label?: string };
  onChange: (selected: { id: string | number; name: string } | null) => void;
  fetchFn: (params: { name: string; page: number; size: number }) => Promise<{ id: string | number; name: string }[]>;
  error?: string;
  placeholder?: string;
  loading?: boolean;
}

const FormSelectWithSearch: React.FC<FormSelectWithSearchProps> = ({
  title,
  value,
  onChange,
  fetchFn,
  error,
  placeholder = "Buscar...",
}) => {
  const [inputValue, setInputValue] = useState("");

 
  const loadOptions = useMemo(() => {
    const debounced = debounce((inputValue: any, callback: (arg0: { value: string | number; label: string; }[]) => void) => {
      fetchFn({ name: inputValue, page: 0, size: 10 })
        .then((data) => {
          const options = data.map((item) => ({
            value: item.id,
            label: item.name,
          }));
          callback(options);
        })
        .catch((err) => {
          console.error("Error loading options:", err);
          callback([]);
        });
    }, 500);

    return (inputValue: any, callback: any) => {
      debounced(inputValue, callback);
    };
  }, [fetchFn]);
  
  const handleInputChange = (newValue: any, { action }: { action: string }) => {
    setInputValue(newValue);
    if (action === "input-change" && !newValue) {
      onChange(null);
    }
    return newValue;
  };

  const handleChange = (selected: SingleValue<{ value: string | number; label: string }>) => {
    if (selected) {
      onChange({ id: selected.value, name: selected.label });
    } else {
      onChange(null);
    }
  };

  const formattedValue = value
    ? {
        value: value.value || value.id,
        label: value.label || value.name,
      }
    : null;

  return (
    <div className="mb-4">
      {title && (
        <label className="block text-gray-700 font-semibold dark:text-white mb-1">
          {title}
          <span className="text-red-500"> *</span>
        </label>
      )}
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        placeholder={placeholder}
        value={formattedValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: "#E3EDF6",
            borderColor: error ? "#f87171" : "#a3bffa",
            boxShadow: state.isFocused ? "0 0 0 1px #10b981" : base.boxShadow,
            "&:hover": {
              borderColor: error ? "#f87171" : "#10b981",
            },
          }),
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary25: "#dbeafe",
            primary: "#10b981",
          },
        })}
        classNamePrefix="react-select"
        isClearable
      />
      {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
    </div>
  );
};

export default FormSelectWithSearch;
