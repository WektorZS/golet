import { cn } from "@/lib/utils"

export function SectionHeading({ eyebrow, title, intro, inverse = false, align = "center" }: { eyebrow?: string; title: string; intro?: string; inverse?: boolean; align?: "center" | "left" }) {
  return (
    <div className={cn("flex max-w-3xl flex-col gap-3", align === "center" && "mx-auto items-center text-center")}>
{eyebrow && (
  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-primary sm:text-[15px] sm:tracking-[0.2em]">
    <span className="inline-block whitespace-nowrap bg-black px-2 py-1">
      {eyebrow}
    </span>
  </p>
)}
      <h2 className={cn("text-balance font-sans text-3xl font-black uppercase leading-tight tracking-tight md:text-5xl", inverse && "text-background")}>{title}</h2>
      {intro && <p className={cn("text-pretty text-[15px] leading-relaxed text-muted-foreground md:text-lg", inverse && "text-background/65")}>{intro}</p>}
      <span className="mt-1 h-1 w-12 bg-primary" aria-hidden="true" />
    </div>
  )
}