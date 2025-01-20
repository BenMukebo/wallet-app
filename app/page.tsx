import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';
import { BadgeCheck, PiggyBank, Wallet, LineChart, Shield, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-6 md:py-12 xl:py-16 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <Badge variant="outline" className="px-4 py-2 text-lg">
                Your Financial Freedom Starts Here
              </Badge>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Smart Money Management <br />Made Simple
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed">
                  Take control of your finances with our comprehensive wallet management solution. 
                  Track, budget, and grow your money smarter.
                </p>
              </div>
              {user ? (
                <div className="space-x-4">
                  <Button size="lg" asChild>
                    <Link href="/protected/accounts">
                      <Wallet className="mr-2 h-5 w-5" />
                      Go to My Accounts
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-x-4">
                  <Button size="lg">
                    <Link href="/sign-up">Get Started Free</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Everything You Need to Manage Your Money
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Powerful features to help you track, save, and grow your finances
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, i) => (
                  <Card key={i} className="relative overflow-hidden">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {feature.icon}
                        </div>
                        <CardTitle>{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Why Choose Our Platform?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                  Discover the advantages of managing your money with us
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

const features = [
  {
    title: "Smart Transaction Tracking",
    description: "Automatically categorize and monitor all your income and expenses in real-time. Get detailed insights into your spending patterns.",
    icon: <PiggyBank className="h-6 w-6" />,
  },
  {
    title: "Intelligent Budgeting",
    description: "Create custom budgets for different categories and receive alerts when you're approaching your limits.",
    icon: <LineChart className="h-6 w-6" />,
  },
  {
    title: "Multi-Currency Support",
    description: "Manage accounts in different currencies with real-time conversion and tracking.",
    icon: <Globe className="h-6 w-6" />,
  },
]

const benefits = [
  {
    title: "Bank-Grade Security",
    description: "Your financial data is protected with the highest level of encryption and security measures.",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Easy to Use",
    description: "Intuitive interface designed for both beginners and advanced users.",
    icon: <BadgeCheck className="h-5 w-5" />,
  },
  {
    title: "Always Available",
    description: "Access your financial information anytime, anywhere, on any device.",
    icon: <Wallet className="h-5 w-5" />,
  },
]
