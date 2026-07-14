const TextArea = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows,
  focused,
  onFocus,
  onBlur,
  minChars,
}) => (
  <div className="flex flex-col gap-1 h-full">
    {/* Label — color shifts to accent on focus */}
    <label
      htmlFor={id}
      className="text-sm font-medium tracking-wide transition-colors duration-300"
      style={{ color: focused === id ? "#715A5A" : "#D3DAD9" }}
    >
      {label}
    </label>
 
    {/* Wrapper — shows border glow ring on focus */}
    <div
      className="flex-1 rounded-xl border transition-all duration-300"
      style={{
        borderColor: focused === id ? "#715A5A" : "rgba(211,218,217,0.15)",
        boxShadow:   focused === id ? "0 0 0 3px rgba(113,90,90,0.22)" : "none",
        background:  "#37353E",
      }}
    >
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full h-full bg-transparent px-4 py-3 text-sm outline-none
                   resize-none placeholder:opacity-30 leading-relaxed"
        style={{ color: "#D3DAD9" }}
      />
    </div>
 
    {/* Live character counter — turns accent color once minimum is met */}
     {minChars && (
  <p
    className="text-xs text-right transition-colors duration-300"
    style={{
      color: (value?.trim()?.length ?? 0) >= minChars
        ? "#715A5A"
        : "rgba(211,218,217,0.25)",
    }}
  >
    {value?.trim()?.length ?? 0} / {minChars} min
    </p>
  )}
  </div>
);
export default TextArea