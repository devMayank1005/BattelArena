export default function AmbientLighting() {
  return (
    <>
      {/* Ambient light glow orbs */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 240, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 0, 110, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 20%, rgba(180, 0, 255, 0.05) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Additional subtle ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />
    </>
  );
}
