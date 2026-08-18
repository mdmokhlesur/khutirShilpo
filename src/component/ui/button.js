const Button = ({ className, children, variant }) => {
  return (
    <button
      className={`py-2 px-4 rounded font-semibold transition ${
        variant === "outline"
          ? "text-[var(--ks-clay-dark)] bg-transparent border border-[var(--ks-clay)] hover:bg-[var(--ks-paper)]"
          : "text-white bg-[var(--ks-clay)] hover:bg-[var(--ks-clay-dark)]"
      } ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
