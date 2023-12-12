export const CampoEntrada = ({
  icono,
  placeholder,
  tipo = "text",
  valor,
  onChange,
  readOnly = false,
  onClick,
}) => {
  return (
    <div className="flex w-full h-[40px] border border-gray-400 rounded-md">
      <div className="h-full w-[40px] bg-gray-200 flex items-center justify-center rounded-l-md border-r border-gray-400">
        {icono}
      </div>
      <input
        type={tipo}
        className="flex-1 rounded-r-md w-full px-2 focus:border-transparent focus:outline-none"
        placeholder={placeholder}
        value={valor}
        onChange={onChange}
        readOnly={readOnly}
        onClick={onClick}
      />
    </div>
  );
};
