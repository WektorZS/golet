import { cn } from "@/lib/utils"

export function SectionHeading({ eyebrow, title, intro, inverse = false, align = "center" }: { eyebrow?: string; title: string; intro?: string; inverse?: boolean; align?: "center" | "left" }) {
  return (
    <div className={cn("flex max-w-3xl flex-col gap-4", align === "center" && "mx-auto items-center text-center")}>
{eyebrow && (
  <p className={cn("eyebrow", inverse && "eyebrow-on-dark")}>{eyebrow}</p>
)}
      <h2 className={cn("text-balance font-sans text-4xl font-black uppercase leading-[0.98] tracking-[-0.035em] md:text-5xl lg:text-6xl", inverse && "text-background")}>{title}</h2>
      {intro && <p className={cn("max-w-2xl text-pretty text-base leading-7 text-muted-foreground md:text-lg", inverse && "text-background/65")}>{intro}</p>}
      <span className="mt-1 h-1 w-14 bg-primary" aria-hidden="true" />
    </div>
  )
}
