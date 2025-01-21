import React from "react";
import Link from "next/link";
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { HandCoins } from "lucide-react";

export function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 md:h-[72px]">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"} className="flex gap-2 text-base font-semibold">
            <HandCoins className="text-green-500" /> Wallet App
          </Link>
        </div>
        <ThemeSwitcher />
        <div className="flex gap-5 items-center">
          {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}
        </div>
      </div>
    </nav>
  );
}
