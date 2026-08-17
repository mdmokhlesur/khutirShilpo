"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-semibold text-red-500">
              {error?.message || "Something went wrong."}
            </h1>
            <button
              className="btn btn-primary mt-4 bg-blue-500"
              onClick={() => reset()}
              type="button"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
