import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import hairOil from "@/assets/products/hair-oil.jpg";
import herbalShampoo from "@/assets/products/herbal-shampoo.jpg";
import faceWash from "@/assets/products/face-wash.jpg";
import herbalSoap from "@/assets/products/herbal-soap.jpg";
import moisturiser from "@/assets/products/moisturiser.jpg";
import faceMist from "@/assets/products/face-mist.jpg";

interface Slide {
  image: string;
  title: string;
  caption: string;
}

const slides: Slide[] = [
  {
    image: hairOil,
    title: "Herbal Hair Oil",
    caption: "Bhringraj & coconut for strong, nourished hair",
  },
  {
    image: herbalShampoo,
    title: "Herbal Shampoo",
    caption: "Amla & shikakai, free from harsh sulphates",
  },
  {
    image: faceWash,
    title: "Herbal Face Wash",
    caption: "Turmeric & sandalwood for a clean, natural glow",
  },
  {
    image: herbalSoap,
    title: "Handmade Body Soap",
    caption: "Neem & tulsi, gentle on your skin every day",
  },
  {
    image: moisturiser,
    title: "Body Butter",
    caption: "Cocoa, shea & coconut for deep moisture",
  },
  {
    image: faceMist,
    title: "Rose Face Mist",
    caption: "A fresh, hydrating rose mist for daily care",
  },
];

const AUTOPLAY_MS = 4500;

export default function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => api.scrollNext(), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [api, paused, current]);

  const prev = useCallback(() => api?.scrollPrev(), [api]);
  const next = useCallback(() => api?.scrollNext(), [api]);

  return (
    <div
      className="relative mx-auto w-full max-w-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured herbal products"
    >
      <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
        <CarouselContent className="-ml-0">
          {slides.map((slide, index) => (
            <CarouselItem
              key={slide.title}
              className="pl-0"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
            >
              <figure className="relative overflow-hidden rounded-3xl shadow-xl ring-1 ring-border/40">
                <img
                  src={slide.image}
                  alt={slide.title}
                  width={800}
                  height={800}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="aspect-square h-full w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-5 pb-5 pt-16 text-left text-white">
                  <p className="font-serif text-xl font-semibold">
                    {slide.title}
                  </p>
                  <p className="mt-0.5 text-sm text-white/85">
                    {slide.caption}
                  </p>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm transition hover:bg-background"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm transition hover:bg-background"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="mt-4 flex justify-center gap-1.5">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current ? "w-6 bg-primary" : "w-1.5 bg-primary/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
