import type { ButtonHTMLAttributes, ReactNode } from "react";

type CustomButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
};

const CustomButton = ({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: CustomButtonProps) => {
  const baseStyles =
    "rounded-md px-4 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

  const variantStyles =
    variant === "primary"
      ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
      : "border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800";

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      className={[baseStyles, variantStyles, widthStyles, className].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
