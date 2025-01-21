import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Github, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-12 md:py-16">
      <div className="container flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <p className="font-semibold">Wallet Web App</p>
              <span className="text-muted-foreground">v1.0.0</span>
            </div>
            <p className="text-muted-foreground">
              Built by{" "}
              <a
                href="http://benmukebo.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                Ben Mukebo
              </a>
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://github.com/BenMukebo"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://twitter.com/yourusername"
                target="_blank"
                rel="noreferrer"
              >
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                href="https://www.linkedin.com/in/kasongo-mukebo-ben/"
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 md:items-end">
          <ThemeSwitcher />
          <p className="text-center text-sm text-muted-foreground md:text-right">
            © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
