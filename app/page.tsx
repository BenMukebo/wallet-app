import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import {
  BadgeCheck,
  PiggyBank,
  Wallet,
  LineChart,
  Shield,
  Globe,
} from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-zinc-100 to-white dark:from-black dark:to-zinc-900">
      <main className="flex-1">
        <section className="w-full py-24 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-10 text-center">
              <div className="max-w-3xl space-y-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                  Smart Money Management
                  <span className="text-green-500">.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
                  Take control of your finances with our intuitive wallet
                  solution. Track, save, and grow your money effortlessly.
                </p>
              </div>
              {user ? (
                <Button size="lg" className="h-11 px-8 text-lg">
                  <Link
                    href="/protected/accounts"
                    className="flex items-center"
                  >
                    <Wallet className="mr-2 h-5 w-5" />
                    Open Dashboard
                  </Link>
                </Button>
              ) : (
                <div className="flex gap-4">
                  <Button size="lg" className="h-11 px-8 text-lg">
                    <Link href="/sign-up">Get Started</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-11 px-8 text-lg"
                  >
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-16">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Everything You Need
                </h2>
                <p className="mx-auto max-w-[600px] text-zinc-500 dark:text-zinc-400">
                  Powerful features to help you master your finances
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-blue-500/10 p-3 text-green-500">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold">{feature.title}</h3>
                    </div>
                    <p className="mt-4 text-zinc-500 dark:text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-20 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-16">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Why Choose Us
                </h2>
                <p className="mx-auto max-w-[600px] text-zinc-500 dark:text-zinc-400">
                  Join thousands who trust us with their finances
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 rounded-lg p-4"
                  >
                    <div className="rounded-lg bg-blue-500/10 p-2 text-green-500">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-zinc-500 dark:text-zinc-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const features = [
  {
    title: "Smart Transaction Tracking",
    description:
      "Automatically categorize and monitor all your income and expenses in real-time. Get detailed insights into your spending patterns.",
    icon: <PiggyBank className="h-6 w-6" />,
  },
  {
    title: "Intelligent Budgeting",
    description:
      "Create custom budgets for different categories and receive alerts when you're approaching your limits.",
    icon: <LineChart className="h-6 w-6" />,
  },
  {
    title: "Multi-Currency Support",
    description:
      "Manage accounts in different currencies with real-time conversion and tracking.",
    icon: <Globe className="h-6 w-6" />,
  },
];

const benefits = [
  {
    title: "Bank-Grade Security",
    description:
      "Your financial data is protected with the highest level of encryption and security measures.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Easy to Use",
    description:
      "Intuitive interface designed for both beginners and advanced users.",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    title: "Always Available",
    description:
      "Access your financial information anytime, anywhere, on any device.",
    icon: <Wallet className="h-5 w-5" />,
  },
];
