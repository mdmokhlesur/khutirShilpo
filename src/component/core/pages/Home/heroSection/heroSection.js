import banner from "@/assets/banner/banner-7.png";
import banner1 from "@/assets/banner/banner-6.png";
import banner2 from "@/assets/banner/banner-5.png";
import Image from "next/image";
import Button from "@/component/ui/button";
import Link from "next/link";
const HeroSection = () => {
  return (
    <>
      <div className="mt-8 grid overflow-hidden rounded bg-[var(--ks-paper)] shadow-sm ring-1 ring-[var(--ks-border)] md:grid-cols-[1.05fr_0.95fr]">
        <div className="p-8 md:p-10 xl:p-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[var(--ks-bamboo)]">
            Handmade heritage collection
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-[var(--ks-ink)] lg:text-5xl xl:text-6xl">
            Clay, Bamboo & Glass Crafted For Quiet Homes
          </h1>
          <p className="my-5 max-w-xl text-base leading-7 text-[var(--ks-muted)]">
            Discover antique-inspired pieces shaped by local artisans, natural
            textures, and the warm imperfections that make every item feel alive.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products">
              <Button>Shop collection</Button>
            </Link>
            <Link href="/products?search=bamboo">
              <Button variant="outline">Explore bamboo</Button>
            </Link>
          </div>
        </div>

        <div className="relative hidden min-h-[360px] items-end justify-end bg-[#efe0c8] md:flex">
          <div className="absolute left-8 top-8 rounded-full border border-white/70 bg-white/50 px-4 py-2 text-sm font-semibold text-[var(--ks-clay-dark)]">
            New artisan arrivals
          </div>
          <Image
            height={200}
            width={250}
            className="relative top-16 h-[32vh] w-auto rotate-180 drop-shadow-xl"
            src={banner}
            alt="banner image"
          />
          <Image
            height={200}
            width={300}
            className="relative right-8 top-24 hidden h-[23vh] w-auto drop-shadow-xl xl:block"
            src={banner1}
            alt="banner image"
          />
          <Image
            height={200}
            width={250}
            className="hidden h-[30vh] w-auto drop-shadow-xl lg:block"
            src={banner2}
            alt="banner image"
          />
        </div>
      </div>
    </>
  );
};

export default HeroSection;
