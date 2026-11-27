import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap">
      <section className="panel">
        <div className="ph"><h2>Page not found</h2></div>
        <Link href="/" className="btn btn-lime">Back to home</Link>
      </section>
    </main>
  );
}
