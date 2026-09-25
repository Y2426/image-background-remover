import { BackgroundRemover } from "@/components/background-remover";
import { CheckCircle2, ShieldCheck, Sparkles, Zap } from "lucide-react";

const useCases = [
  "Product photos",
  "Profile pictures",
  "Social media posts",
  "Logos and graphics",
];

const faqs = [
  {
    question: "Is this background remover free?",
    answer:
      "The MVP is designed as a free tool with sensible limits. Paid upgrades can be added later for HD output, batch processing, and higher usage.",
  },
  {
    question: "Are my images stored?",
    answer:
      "No. Images are processed in memory and are not stored by this application.",
  },
  {
    question: "What image formats are supported?",
    answer: "JPG, JPEG, PNG, and WEBP files up to 5MB are supported.",
  },
  {
    question: "Can I remove backgrounds from product photos?",
    answer:
      "Yes. The first version is especially useful for product images, profile photos, social posts, logos, and lightweight design assets.",
  },
  {
    question: "Can I download transparent PNG images?",
    answer:
      "Yes. The core output is a transparent PNG. You can also export the result on white, black, or custom solid backgrounds.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-3" aria-label="Image Background Remover home">
          <span className="grid size-10 place-items-center rounded-md bg-[var(--ink)] text-white shadow-sm">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <span className="text-base font-black tracking-tight sm:text-lg">
            Image Background Remover
          </span>
        </a>
        <div className="hidden items-center gap-2 text-sm font-semibold text-[var(--muted)] sm:flex">
          <a className="rounded-md px-3 py-2 transition hover:bg-white" href="#use-cases">
            Use cases
          </a>
          <a className="rounded-md px-3 py-2 transition hover:bg-white" href="#faq">
            FAQ
          </a>
        </div>
      </nav>

      <section id="top" className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pb-16 lg:pt-8">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-md border border-[var(--line)] bg-white/75 px-3 py-2 text-sm font-bold text-[var(--green-dark)] shadow-sm">
            <Zap className="size-4" aria-hidden="true" />
            No signup. No image storage.
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-[var(--ink)] sm:text-6xl lg:text-7xl">
            Image Background Remover
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
            Remove image backgrounds instantly. Upload a JPG, PNG, or WEBP image and download a transparent PNG for product photos, profile pictures, and social posts.
          </p>

          <div className="mt-8 grid gap-3 text-sm font-semibold text-[var(--ink)] sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-md border border-[var(--line)] bg-white/80 px-3 py-3">
              <CheckCircle2 className="size-5 text-[var(--green)]" aria-hidden="true" />
              5MB max
            </div>
            <div className="flex items-center gap-2 rounded-md border border-[var(--line)] bg-white/80 px-3 py-3">
              <CheckCircle2 className="size-5 text-[var(--green)]" aria-hidden="true" />
              PNG export
            </div>
            <div className="flex items-center gap-2 rounded-md border border-[var(--line)] bg-white/80 px-3 py-3">
              <ShieldCheck className="size-5 text-[var(--green)]" aria-hidden="true" />
              In-memory
            </div>
          </div>
        </div>

        <BackgroundRemover />
      </section>

      <section id="use-cases" className="border-y border-[var(--line)] bg-[var(--ink)] text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--coral)]">
              Built for fast visual work
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-normal sm:text-4xl">
              One clean workflow for the everyday images that need a better edge.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {useCases.map((item) => (
              <div key={item} className="rounded-md border border-white/15 bg-white/8 p-5">
                <p className="text-lg font-black">{item}</p>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Upload once, preview the cutout, choose a transparent or solid background, then download.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-2">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--green)]">
            FAQ
          </p>
          <h2 className="text-3xl font-black tracking-normal sm:text-4xl">
            Background removal basics
          </h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="rounded-md border border-[var(--line)] bg-white/80 p-5 shadow-sm open:bg-white"
            >
              <summary className="cursor-pointer text-base font-black">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
