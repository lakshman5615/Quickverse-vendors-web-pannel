import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label?: string;
  options: SelectOption[];
};

const SelectInput = ({
  id,
  label,
  options,
  className = "",
  ...props
}: SelectInputProps) => {
  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      ) : null}
      <select
        id={id}
        className={[
          "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-zinc-500",
          className,
        ].join(" ")}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
