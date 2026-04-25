/** Subtle horizontal divider used between page sections. */

export function EditorialDivider({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="path-divider" aria-hidden />
    </div>
  );
}
