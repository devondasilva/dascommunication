export default function Chargement() {
  return (
    <div aria-busy="true" aria-label="Chargement" className="animate-pulse space-y-6">
      <div className="h-7 w-56 rounded-md bg-fond" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-fond" />
        ))}
      </div>
      <div className="h-72 rounded-xl bg-fond" />
    </div>
  );
}
