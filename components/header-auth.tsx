import { signOutAction } from "@/actions/auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Wallet } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function AuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <Badge variant="destructive" className="font-normal">
          Please update .env.local file
        </Badge>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" disabled>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" disabled>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (user) {
    const userInitial = user.email?.[0].toUpperCase() || "U";

    return (
      <DropdownMenu>
        <p className="">welcome {user?.email}</p>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar>
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Account</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/protected/accounts" className="cursor-pointer">
              <Wallet className="mr-2 h-4 w-4" />
              My Accounts
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/protected/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild disabled>
            <Link href="/protected/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="text-red-600 focus:text-red-600">
            <form action={signOutAction} className="w-full">
              <button type="submit" className="flex w-full items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
