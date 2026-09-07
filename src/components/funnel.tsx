/** The two-number funnel used in the CurbNTurf case study. */
export default function Funnel({
  caption,
  steps,
}: {
  caption: string;
  steps: { label: string; value: number; note: string }[];
}) {
  const max = Math.max(...steps.map((s) => s.value));
  return (
    <div className="my-14 rounded-sm border border-rule bg-raised p-8 md:p-10">
      <p className="label text-mute">{caption}</p>
      <div className="mt-8 space-y-6">
        {steps.map((step) => (
          <div key={step.label}>
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-display text-base font-bold tracking-tight text-type">
                {step.label}
              </span>
              <span className="font-display text-3xl font-extrabold tracking-tight text-accent">
                {step.value}
              </span>
            </div>
            <div className="mt-2 h-2 w-full bg-rule/60">
              <div
                className="h-2 bg-solid"
                style={{ width: `${(step.value / max) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-mute">{step.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
