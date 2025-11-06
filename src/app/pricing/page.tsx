import { PricingCard } from "@/components/pricing-card";
import { STRIPE_PRODUCTS } from "@/lib/stripe";

export default function PricingPage() {
  return (
    <div className="container py-20">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Select the perfect plan for your needs. All plans include a 14-day
            money-back guarantee.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          <PricingCard
            name={STRIPE_PRODUCTS.STARTER.name}
            price={STRIPE_PRODUCTS.STARTER.price}
            priceId={STRIPE_PRODUCTS.STARTER.priceId}
            features={STRIPE_PRODUCTS.STARTER.features}
          />

          <PricingCard
            name={STRIPE_PRODUCTS.PRO.name}
            price={STRIPE_PRODUCTS.PRO.price}
            priceId={STRIPE_PRODUCTS.PRO.priceId}
            features={STRIPE_PRODUCTS.PRO.features}
            popular
          />

          <PricingCard
            name={STRIPE_PRODUCTS.ENTERPRISE.name}
            price={STRIPE_PRODUCTS.ENTERPRISE.price}
            priceId={STRIPE_PRODUCTS.ENTERPRISE.priceId}
            features={STRIPE_PRODUCTS.ENTERPRISE.features}
          />
        </div>

        {/* FAQ Section */}
        <div className="border-t pt-12">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards (Visa, Mastercard, American
                Express) through our secure Stripe payment processing.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Can I cancel anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! You can cancel your subscription at any time. You&apos;ll
                continue to have access until the end of your billing period.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm">
                All plans come with a 14-day money-back guarantee. If
                you&apos;re not satisfied, we&apos;ll refund you in full.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Can I upgrade or downgrade?</h3>
              <p className="text-muted-foreground text-sm">
                Yes, you can change your plan at any time. We&apos;ll prorate
                the charges accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
