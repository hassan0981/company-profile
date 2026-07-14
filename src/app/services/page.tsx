import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      title: "SEO",
      href: "/services/seo",
      description: "Search Engine Optimization to boost your organic visibility.",
    },
    {
      title: "Social Media Management",
      href: "/services/social-media",
      description: "Engaging and growing your target audience across platforms.",
    },
    {
      title: "Meta Ads",
      href: "/services/meta-ads",
      description: "Targeted advertising campaigns on Facebook and Instagram.",
    },
    {
      title: "Web Development",
      href: "/services/web-development",
      description: "High-performance, modern web applications built to scale.",
    },
  ];

  return (
    <main className="flex-grow px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
          Services
        </h1>
        <p className="mt-4 text-base text-neutral-500 max-w-xl">
          Explore our range of digital agency services designed to scale your business.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group block rounded-lg border border-neutral-100 p-6 transition-all hover:border-black hover:shadow-sm"
            >
              <h2 className="text-lg font-bold tracking-tight text-black transition-colors group-hover:text-neutral-700">
                {service.title} &rarr;
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
