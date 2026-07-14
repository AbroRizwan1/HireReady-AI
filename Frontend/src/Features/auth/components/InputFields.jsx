
// Eye open — shown when password is hidden (click to reveal)
export const EyeOpenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943
         9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// Eye off — shown when password is visible (click to hide)
export const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
  >
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7
         a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243
         M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29
         m7.532 7.532l3.29 3.29M3 3l3.59 3.59
         m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7
         a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

// ── InputField Component ─────────────────────────────────────

const InputField = ({
  id,           // unique id for the input (connects label to input)
  label,        // text shown above the input, e.g. "Email address"
  type,         // "email" | "text" | "password"
  value,        // controlled value coming from state
  onChange,     // updates state on every keystroke
  placeholder,  // hint text shown inside the input
  focused,      // which field is currently active (passed from parent)
  onFocus,      // called when the user clicks into the field
  onBlur,       // called when the user clicks away from the field
  children,     // optional right-side icon slot (e.g. eye toggle button)
}) => (
  <div className="flex flex-col gap-1">

    {/* Label — changes color when this field is focused */}
    <label
      htmlFor={id}
      className="text-sm font-medium tracking-wide transition-colors duration-300 "
      style={{ color: focused === id ? "#715A5A" : "#D3DAD9" }}
    >
      {label}
    </label>

    {/* Input wrapper — shows border glow ring when focused */}
    <div
      className="relative flex items-center rounded-xl border transition-all duration-300"
      style={{
        borderColor: focused === id ? "#715A5A" : "#44444E",
        boxShadow: focused === id ? "0 0 0 3px rgba(113,90,90,0.25)" : "none",
        background: "#37353E",
      }}
    >
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete={id === "email" ? "email" : "current-password"}
        className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:opacity-40"
        style={{ color: "#D3DAD9" }}
      />

      {/* Icon slot — used by the password field for the eye toggle */}
      {children}
    </div>

  </div>
);

export default InputField;