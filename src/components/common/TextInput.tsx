import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label?: string;
  error?: string;
};

const TextInput = ({
  id,
  label,
  error,
  className = "",
  ...props
}: TextInputProps) => {
  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={id} className="block text-sm font-medium text-zinc-300">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={[
          "w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-400",
          error ? "border-red-500 focus:border-red-400" : "",
          className,
        ].join(" ")}
        {...props}
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
};

export default TextInput;
