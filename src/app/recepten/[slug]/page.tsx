import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, ArrowLeft, ChefHat, Lightbulb } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/scroll-reveal";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getRecipe(slug: string) {
  return prisma.recipe.findUnique({
    where: { slug, isPublished: true },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    return {
      title: "Recept niet gevonden | Goeduitje.nl",
    };
  }

  return {
    title: `${recipe.title} | Recepten | Goeduitje.nl`,
    description: recipe.description || `Ontdek het recept voor ${recipe.title}`,
  };
}

export async function generateStaticParams() {
  const recipes = await prisma.recipe.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });

  return recipes.map((recipe) => ({
    slug: recipe.slug,
  }));
}

export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    notFound();
  }

  const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="bg-muted flex h-full items-center justify-center">
            <ChefHat className="text-muted-foreground h-32 w-32" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Back button */}
        <div className="absolute top-24 left-4 z-10 sm:top-28 sm:left-8">
          <Link href="/recepten">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Alle recepten
            </Button>
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute right-0 bottom-0 left-0 p-6 sm:p-8 lg:p-12">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-4 flex flex-wrap gap-2">
              {recipe.category && (
                <Badge className="bg-primary text-primary-foreground">
                  {recipe.category}
                </Badge>
              )}
              {recipe.difficulty && (
                <Badge
                  variant="outline"
                  className="text-foreground bg-white/90"
                >
                  {recipe.difficulty}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {recipe.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Recipe Info */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-5xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp" amount={0.2}>
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              {totalTime > 0 && (
                <div className="flex flex-col items-center">
                  <Clock className="text-primary mb-2 h-6 w-6" />
                  <span className="text-muted-foreground text-sm">
                    Totale tijd
                  </span>
                  <span className="text-lg font-semibold">{totalTime} min</span>
                </div>
              )}
              {recipe.prepTime && (
                <div className="flex flex-col items-center">
                  <Clock className="text-muted-foreground mb-2 h-6 w-6" />
                  <span className="text-muted-foreground text-sm">
                    Voorbereiden
                  </span>
                  <span className="text-lg font-semibold">
                    {recipe.prepTime} min
                  </span>
                </div>
              )}
              {recipe.cookTime && (
                <div className="flex flex-col items-center">
                  <Clock className="text-muted-foreground mb-2 h-6 w-6" />
                  <span className="text-muted-foreground text-sm">
                    Bereiden
                  </span>
                  <span className="text-lg font-semibold">
                    {recipe.cookTime} min
                  </span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex flex-col items-center">
                  <Users className="text-primary mb-2 h-6 w-6" />
                  <span className="text-muted-foreground text-sm">Porties</span>
                  <span className="text-lg font-semibold">
                    {recipe.servings} pers
                  </span>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Description & Recipe Content */}
      <section className="section-md">
        <div className="container mx-auto max-w-5xl px-6 lg:px-8">
          {recipe.description && (
            <ScrollReveal animation="fade" amount={0.2}>
              <p className="text-muted-foreground mb-12 text-center text-lg leading-relaxed lg:text-xl">
                {recipe.description}
              </p>
            </ScrollReveal>
          )}

          <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
            {/* Ingredients */}
            <ScrollReveal animation="slideUp" amount={0.2}>
              <Card className="sticky top-24 h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="text-primary h-5 w-5" />
                    Ingrediënten
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li
                        key={index}
                        className="text-muted-foreground flex items-start gap-2"
                      >
                        <span className="bg-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Steps */}
            <ScrollReveal animation="slideUp" amount={0.2} delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle>Bereidingswijze</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-6">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                          {index + 1}
                        </span>
                        <p className="text-muted-foreground pt-1 leading-relaxed">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>

          {/* Tips */}
          {recipe.tips && (
            <ScrollReveal animation="slideUp" amount={0.2} delay={0.2}>
              <Card className="border-primary/20 bg-primary/5 mt-8">
                <CardContent className="flex gap-4 pt-6">
                  <Lightbulb className="text-primary h-6 w-6 shrink-0" />
                  <div>
                    <h3 className="mb-2 font-semibold">Tips</h3>
                    <p className="text-muted-foreground">{recipe.tips}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-md bg-muted/30">
        <div className="container mx-auto max-w-5xl px-6 text-center lg:px-8">
          <ScrollReveal animation="fade" amount={0.2}>
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Wil je dit recept samen maken?
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl">
              Boek een kookworkshop bij Goeduitje en maak dit gerecht samen met
              je team. Onze professionele chef begeleidt jullie stap voor stap!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/onze-uitjes/kookworkshop">
                <Button size="lg">Bekijk kookworkshops</Button>
              </Link>
              <Link href="/recepten">
                <Button variant="outline" size="lg">
                  Meer recepten
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
