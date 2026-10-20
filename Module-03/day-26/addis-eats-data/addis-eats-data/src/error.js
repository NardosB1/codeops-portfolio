"use client";

export default function Error({ error, reset }) {
return (
    <main className="wrap">
        <div className="error" role="alert">
        <h2>Something went wrong</h2>
        <p>We couldn't load the data. Please try again.</p>
        <button onClick={() => reset()}>Try again</button>
        </div>
    </main>
);
}