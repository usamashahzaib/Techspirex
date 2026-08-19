const FIELDS = [
  { id: "name", label: "Full name", type: "text", placeholder: "Jordan Ellis" },
  { id: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { id: "address", label: "Address", type: "text", placeholder: "123 Roastery Lane" },
] as const;

/** Presentational only - the demo takes no payment and stores nothing. */
export function CheckoutForm() {
  return (
    <div className="mb-5 space-y-3">
      <h3 className="text-sm font-medium">Shipping details</h3>
      {FIELDS.map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="mb-1 block text-xs text-[#7a6f66]">
            {field.label}
          </label>
          <input
            id={field.id}
            type={field.type}
            placeholder={field.placeholder}
            className="w-full rounded-lg border border-[#ece3d8] bg-white px-3 py-2 text-sm outline-none focus:border-[#b4532e]"
          />
        </div>
      ))}
      <p className="text-[11px] text-[#a99c90]">
        Demo form - details aren&rsquo;t stored or submitted.
      </p>
    </div>
  );
}
