import { Reveal } from "./motion";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "text-center items-center mx-auto" : "text-left items-start";
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignCls}`}>
      <Reveal>
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="heading-lg text-cream-50">{title}</h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.16}>
          <p className="body-lg">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
