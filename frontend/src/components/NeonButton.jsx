export default function NeonButton({ children, className = '', ...props }) {
  return (
    <button
      className={`
        relative px-8 py-4 rounded-full font-medium
        bg-gradient-to-r from-blue-400 to-purple-500
        text-white border-2 border-cyan-400/50
        shadow-lg hover:shadow-2xl
        transition-all hover:scale-105 active:scale-95
        group overflow-hidden ${className}
      `}
      style={{
        boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity" />
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
}
