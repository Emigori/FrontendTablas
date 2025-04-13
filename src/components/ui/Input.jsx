export function Input({ value, onChange, placeholder }) {
    return (
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border p-2 rounded-lg w-full"
      />
    );
  }