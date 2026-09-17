import Image from "next/image"

export const socialProfiles = [
  { name: "Facebook", href: "https://facebook.com/profile.php?id=61573517165441", icon: "/icons/social/facebook.svg" },
  { name: "Instagram", href: "https://instagram.com/letsgol_wyjazdynamecze", icon: "/icons/social/instagram.svg" },
  { name: "TikTok", href: "https://tiktok.com/@letsgol.wyjazdynamecze", icon: "/icons/social/tiktok.svg" },
  { name: "YouTube", href: "https://youtube.com/@LetsGolWyjazdynamecze", icon: "/icons/social/youtube.webp" },
] as const

export function SocialLinks({
  showLabels = false,
  variant = "dark",
}: {
  showLabels?: boolean
  variant?: "dark" | "light"
}) {
  const linkClassName =
    variant === "light"
      ? "border-border bg-background text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
      : "border-zinc-800 bg-background/5 text-background hover:border-primary hover:bg-primary hover:text-primary-foreground"

  return (
    <div
      className="flex flex-wrap items-center gap-3"
      aria-label="Let’s Gol w mediach społecznościowych"
    >
      {socialProfiles.map(({ name, href, icon }) => {
        const currentIcon =
          name === "TikTok" && variant === "light"
            ? "/icons/social/tiktok-white.webp"
            : icon

        return (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${linkClassName}`}
            aria-label={`${name} - profil Let’s Gol (otwiera się w nowej karcie)`}
          >
            <Image
              src={currentIcon}
              alt=""
              width={20}
              height={20}
              className="size-5 object-contain"
              style={{ width: 20, height: 20 }}
              unoptimized
              aria-hidden="true"
            />
            {showLabels ? <span>{name}</span> : null}
          </a>
        )
      })}
    </div>
  )
}
