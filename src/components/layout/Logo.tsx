export function Logo({ name, suffix }: { name: string; suffix: string }) {
  return (
    <a href="#home" className="logo">
      <b><span>{name}</span><i /></b>
      <span>{suffix}</span>
    </a>
  );
}
