export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  readTime: string;
  contentHtml: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    slug: "manage-design-team",
    title: "How to manage a talented and successful design team",
    category: "UI Design",
    date: "December 20, 2023",
    image: "/blog_team.png",
    excerpt: "Discover the key strategies for leading creative teams, fostering collaboration, and maintaining high productivity in design projects.",
    author: {
      name: "Kamil Shahzad",
      avatar: "/team_1.png",
      role: "Creative Director"
    },
    readTime: "5 min read",
    contentHtml: `
      <p class="lead text-xl text-neutral-600 mb-6 font-light leading-relaxed">
        Managing a creative team is unlike managing any other department. It requires a delicate balance of structure and creative freedom, of metrics and gut feelings, of guiding and stepping back.
      </p>

      <h2 class="text-2xl font-bold text-black mt-10 mb-4">1. Fostering Creative Autonomy</h2>
      <p class="text-neutral-700 mb-6 leading-relaxed">
        The best designers don't want to be micromanaged. They need to understand the constraints and goals of a project, but should be given full autonomy on how to reach the finish line. When you define the "what" and the "why," and let your designers define the "how," you unlock true innovation.
      </p>

      <blockquote class="border-l-4 border-[#206cbb] pl-6 my-8 italic text-lg text-neutral-800 bg-neutral-50 py-4 pr-4">
        "True creative leadership is not about having all the ideas; it's about creating an environment where the best ideas can live, grow, and win."
      </blockquote>

      <h2 class="text-2xl font-bold text-black mt-10 mb-4">2. Building a Culture of Constructive Feedback</h2>
      <p class="text-neutral-700 mb-6 leading-relaxed">
        Feedback is the lifeblood of design. However, unstructured feedback can hurt morale. Establish clear critique guidelines: focus on the user goals, not personal preferences. Ask "How does this layout support the user journey?" rather than saying "I don't like this color."
      </p>

      <h2 class="text-2xl font-bold text-black mt-10 mb-4">3. Striking the Balance with Processes</h2>
      <p class="text-neutral-700 mb-6 leading-relaxed">
        Creativity needs boundaries to thrive. Clear briefs, standardized design systems, and transparent sprint planning don't restrict creativity; they eliminate administrative noise so designers can focus entirely on solving problems.
      </p>
    `
  },
  {
    id: "2",
    slug: "startup-company-axtra",
    title: "How to bring fold to your startup company with Axtra",
    category: "UI Design",
    date: "December 20, 2023",
    image: "/blog_laptop.png",
    excerpt: "Learn how incorporating modern design frameworks and motion experiences can elevate your startup brand identity.",
    author: {
      name: "Sajjad Ali",
      avatar: "/team_2.png",
      role: "Lead Front-end Architect"
    },
    readTime: "6 min read",
    contentHtml: `
      <p class="lead text-xl text-neutral-600 mb-6 font-light leading-relaxed">
        In today's hyper-competitive startup market, making a strong first impression is everything. Startups need to look premium, modern, and trustworthy from day one.
      </p>

      <h2 class="text-2xl font-bold text-black mt-10 mb-4">1. The Role of Premium Motion Design</h2>
      <p class="text-neutral-700 mb-6 leading-relaxed">
        Static pages are a relic of the past. Using interactive 3D elements, parallax scroll effects, and immersive animations tells your users that you care about detail, quality, and user experience. It creates an emotional connection that converts visitors into customers.
      </p>

      <h2 class="text-2xl font-bold text-black mt-10 mb-4">2. Building Consistency Across the Funnel</h2>
      <p class="text-neutral-700 mb-6 leading-relaxed">
        Your brand is not just your logo; it is the sum of all interactions. A cohesive design system, shared interactive patterns, and unified typography create a reliable funnel. When a user transitions from your social media ads to your landing page, they should feel like they never left your brand universe.
      </p>

      <blockquote class="border-l-4 border-[#3c9e90] pl-6 my-8 italic text-lg text-neutral-800 bg-neutral-50 py-4 pr-4">
        "A premium design tells the world you are serious. In the startup world, premium design is the ultimate shortcut to building trust."
      </blockquote>

      <h2 class="text-2xl font-bold text-black mt-10 mb-4">3. Leverage Modern Frameworks</h2>
      <p class="text-neutral-700 mb-6 leading-relaxed">
        Building on Next.js and implementing GSAP animations ensures that your premium interactions don't sacrifice performance. Fast loading times coupled with high-end animations is the winning combination for modern startup websites.
      </p>
    `
  }
];
