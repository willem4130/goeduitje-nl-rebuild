"use client";

import { api } from "@/trpc/client";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Clock, Users, ChefHat, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ReceptenPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all recipes
  const { data: recipes, isLoading } = api.recipes.getAll.useQuery({
    category: selectedCategory ?? undefined,
    search: searchQuery || undefined,
  });

  // Fetch categories for filter
  const { data: categories } = api.recipes.getCategories.useQuery();

  // Filter recipes by search query (client-side for instant feedback)
  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    return recipes;
  }, [recipes]);

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="section-sm bg-muted/30">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="fade" amount={0.1}>
            <div className="text-center">
              <h1 className="text-primary mb-4 tracking-tight">
                Onze Recepten
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed tracking-wide sm:text-xl">
                Ontdek heerlijke recepten uit onze kookworkshops. Van
                voorgerecht tot dessert, allemaal stap-voor-stap uitgelegd.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filters Section */}
      <section className="section-sm">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <ScrollReveal animation="slideUp" amount={0.2}>
            <div className="mb-12 space-y-6">
              {/* Search Bar */}
              <div className="relative mx-auto max-w-2xl">
                <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Zoek recepten..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="py-6 pl-12 text-lg"
                />
              </div>

              {/* Category Navigation Tabs */}
              <div className="overflow-x-auto">
                <div className="inline-flex min-w-full gap-0 rounded-lg bg-[#B85C7C] p-0">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-8 py-4 text-lg font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === null
                        ? "bg-white text-[#B85C7C]"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Alle recepten
                  </button>
                  {categories?.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-8 py-4 text-lg font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === category
                          ? "bg-white text-[#B85C7C]"
                          : "text-white hover:bg-white/10"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Results Count */}
          {!isLoading && filteredRecipes && (
            <ScrollReveal animation="fade" amount={0.1}>
              <p className="text-muted-foreground mb-8 text-center">
                {filteredRecipes.length}{" "}
                {filteredRecipes.length === 1 ? "recept" : "recepten"} gevonden
              </p>
            </ScrollReveal>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">Recepten laden...</p>
            </div>
          )}

          {/* Recipes Grid */}
          {!isLoading && filteredRecipes && filteredRecipes.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRecipes.map((recipe, index) => (
                <ScrollReveal
                  key={recipe.id}
                  animation="slideUp"
                  amount={0.2}
                  delay={index * 0.1}
                >
                  <Link href={`/recepten/${recipe.slug}`}>
                    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                      {/* Recipe Image */}
                      <div className="bg-muted relative aspect-[4/3] overflow-hidden">
                        {recipe.imageUrl ? (
                          <Image
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ChefHat className="text-muted-foreground h-16 w-16" />
                          </div>
                        )}

                        {/* Category Badge */}
                        {recipe.category && (
                          <Badge className="text-foreground absolute top-4 left-4 bg-white/90 backdrop-blur-sm">
                            {recipe.category}
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-6">
                        {/* Title */}
                        <h3 className="mb-2 text-xl font-semibold tracking-tight">
                          {recipe.title}
                        </h3>

                        {/* Description */}
                        {recipe.description && (
                          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm leading-relaxed">
                            {recipe.description}
                          </p>
                        )}

                        {/* Recipe Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          {recipe.prepTime !== null &&
                            recipe.cookTime !== null && (
                              <div className="text-muted-foreground flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                <span>
                                  {recipe.prepTime + recipe.cookTime} min
                                </span>
                              </div>
                            )}
                          {recipe.servings && (
                            <div className="text-muted-foreground flex items-center gap-1.5">
                              <Users className="h-4 w-4" />
                              <span>{recipe.servings} pers</span>
                            </div>
                          )}
                          {recipe.difficulty && (
                            <Badge variant="outline">{recipe.difficulty}</Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredRecipes && filteredRecipes.length === 0 && (
            <div className="py-20 text-center">
              <ChefHat className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
              <h3 className="mb-2 text-xl font-semibold">
                Geen recepten gevonden
              </h3>
              <p className="text-muted-foreground">
                Probeer andere filters of zoektermen
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
