"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="wrap">
      <section className="panel" role="alert">
        <div className="ph"><h2>Something went wrong</h2></div>
        <p className="lede">The page could not be loaded.</p>
        <button type="button" className="btn btn-lime" onClick={reset}>Try again</button>
      </section>
    </main>
  );
}
