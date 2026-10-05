"use client";

export default function Error({ error, reset }) {
return (
    <div className="p-6 text-red-600">
        <p>Something went wrong loading the menu!</p>
        <button onClick={() => reset()} className="mt-2 px-3 py-1 bg-red-500 text-white rounded">
        Try again
        </button>
    </div>
);
}