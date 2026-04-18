import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import {
  RiArrowRightUpLine,
  RiCameraLine,
  RiCloseLine,
  RiInstagramLine,
  RiMapPin2Line,
  RiMailLine,
  RiMenuLine,
  RiPinterestLine,
} from "react-icons/ri"

import { slugify } from "@/lib/strings"

const ease = [0.25, 0.1, 0.25, 1]

function SiteNav({ categories }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-40 transition-all duration-300"
        style={{
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
          backgroundColor: scrolled ? "rgba(244,242,239,0.92)" : "transparent",
          borderBottom: scrolled
            ? "1px solid rgba(28,25,23,0.08)"
            : "1px solid transparent",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <RiCameraLine size={13} className="text-stone-400" />
            <span className="text-[14px] font-semibold tracking-wide text-stone-800">
              Arman Gaboyan
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="https://www.instagram.com/armangaboyanstudio/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 p-2.5 text-stone-600 transition hover:border-stone-900 hover:text-stone-900"
              aria-label="Instagram"
            >
              <RiInstagramLine size={14} />
            </a>
            <a
              href="https://www.pinterest.com/armangaboyan/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-stone-300 p-2.5 text-stone-600 transition hover:border-stone-900 hover:text-stone-900"
              aria-label="Pinterest"
            >
              <RiPinterestLine size={14} />
            </a>
            <a
              href="mailto:arman@example.com"
              className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-stone-700"
            >
              <RiMailLine size={13} />
              Get in touch
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex items-center rounded-full border border-stone-200 px-3 py-2 text-stone-500 transition hover:border-stone-400 hover:text-stone-900 md:hidden"
          >
            <RiMenuLine size={17} />
          </button>
        </motion.div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.aside
              className="fixed inset-y-0 right-0 z-50 w-[88%] max-w-sm bg-[#f4f2ef] shadow-2xl md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.36, ease }}
            >
              <div className="flex h-full flex-col px-6 py-6">
                <div className="mb-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RiCameraLine size={13} className="text-stone-400" />
                    <span className="text-[13px] font-semibold tracking-wide text-stone-800">
                      Arman Gaboyan
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border border-stone-200 p-2 text-stone-500 transition hover:border-stone-400 hover:text-stone-900"
                  >
                    <RiCloseLine size={16} />
                  </button>
                </div>

                <nav className="flex flex-col gap-5">
                  <Link
                    href="/"
                    onClick={() => setMenuOpen(false)}
                    className="text-[13px] font-medium tracking-wide text-stone-800"
                  >
                    Home
                  </Link>
                  {categories.map((group) => (
                    <Link
                      key={group.id || group.category}
                      href={`/${group.slug || slugify(group.category)}`}
                      onClick={() => setMenuOpen(false)}
                      className="text-[13px] font-medium tracking-wide text-stone-800"
                    >
                      {group.category}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto flex flex-col gap-3 pt-10">
                  <div className="flex items-center gap-2 text-[12px] text-stone-500">
                    <RiMapPin2Line size={12} />
                    Glendale, CA
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://www.instagram.com/armangaboyanstudio/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-[12px] text-stone-600 transition hover:border-stone-900 hover:text-stone-900"
                    >
                      <RiInstagramLine size={12} />
                      Instagram
                    </a>
                    <a
                      href="https://www.pinterest.com/armangaboyan/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-[12px] text-stone-600 transition hover:border-stone-900 hover:text-stone-900"
                    >
                      <RiPinterestLine size={12} />
                      Pinterest
                    </a>
                  </div>
                  <a
                    href="mailto:arman@example.com"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 py-4 text-[14px] font-medium text-white transition hover:bg-stone-700"
                  >
                    <RiMailLine size={14} />
                    Get in touch
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  )
}

function Lightbox({ image, onClose }) {
  useEffect(() => {
    if (!image) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [image, onClose])

  return (
    <AnimatePresence>
      {image ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 px-4 py-8"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <RiCloseLine size={18} />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative flex max-h-full w-full max-w-6xl flex-col gap-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative max-h-[78vh] overflow-hidden rounded-[28px] bg-stone-950">
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-[78vh] w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-2 px-1 text-white sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xl font-semibold tracking-tight">{image.title}</p>
                {image.description ? (
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-white/70">
                    {image.description}
                  </p>
                ) : null}
              </div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">
                {image.category}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function FeaturedCard({ image, index, onOpen }) {
  const isFirst = index === 0
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease, delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(image)}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-[28px] border border-stone-200 bg-stone-100 text-left ${
        isFirst ? "sm:row-span-2" : ""
      }`}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: isFirst ? "3/4" : image.aspectRatio || "4/5" }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.7, ease }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
        <AnimatePresence>
          {hovered ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs font-medium text-white"
            >
              <RiArrowRightUpLine size={14} />
              <span>Open</span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-stone-200 px-4 py-3">
        <p className="text-sm font-medium tracking-tight text-stone-800">
          {image.title}
        </p>
        <span className="text-[10px] uppercase tracking-widest text-stone-400">
          {image.category}
        </span>
      </div>
    </motion.button>
  )
}

function CategoryCard({ group, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease, delay: index * 0.06 }}
    >
      <Link
        href={`/${group.slug || slugify(group.category)}`}
        className="group flex h-full flex-col rounded-[28px] border border-stone-200 bg-white px-5 py-5 shadow-[0_10px_30px_rgba(28,25,23,0.05)] transition hover:-translate-y-1 hover:border-stone-300"
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">
            Category
          </span>
          <RiArrowRightUpLine
            size={16}
            className="text-stone-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-stone-700"
          />
        </div>
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-stone-900">
          {group.category}
        </h3>
        {group.description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-500">
            {group.description}
          </p>
        ) : null}
        <div className="mt-auto pt-6 text-[11px] uppercase tracking-[0.18em] text-stone-400">
          {group.items.length} image{group.items.length === 1 ? "" : "s"}
        </div>
      </Link>
    </motion.div>
  )
}

export default function Home({ portfolio }) {
  const categories = portfolio.images || []
  const featuredImages = categories.flatMap((group) =>
    group.items
      .filter((image) => image.featured)
      .map((image) => ({ ...image, category: group.category })),
  )
  const [selectedImage, setSelectedImage] = useState(null)

  const dividerRef = useRef(null)
  const dividerInView = useInView(dividerRef, { once: true, margin: "-80px" })

  return (
    <>
      <Head>
        <title>Arman Gaboyan | Photography</title>
        <meta
          name="description"
          content="Portrait, wedding, watch and travel photography by Arman Gaboyan. Based in Glendale, available worldwide."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#f4f2ef] text-stone-900 antialiased">
        <SiteNav categories={categories} />

        <main className="mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
          <section className="mb-24">
            <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="mb-6 flex items-center gap-2"
                >
                  <span className="h-px w-10 bg-stone-300" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
                    Photography
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, ease, delay: 0.06 }}
                  className="mb-5 text-[clamp(3.2rem,10vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.06em] text-stone-900"
                >
                  Arman
                  <br />
                  Gaboyan
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.12 }}
                  className="mb-8 max-w-lg text-[clamp(1rem,2.3vw,1.25rem)] font-light leading-snug tracking-tight text-stone-500"
                >
                  Quiet light, bold moments &amp; image-led storytelling.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.18 }}
                  className="max-w-md text-[15px] leading-8 text-stone-500"
                >
                  Based in Glendale, available worldwide. Specialising in
                  portraits, weddings, watch photography and travel. Open for
                  bookings and commissions.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.24 }}
                  className="mt-8 flex flex-wrap gap-2"
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-[11px] text-stone-500">
                    <RiMapPin2Line size={11} />
                    Glendale, CA
                  </span>
                  <a
                    href="https://www.instagram.com/armangaboyanstudio/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-[11px] text-stone-500 transition hover:border-stone-900 hover:text-stone-900"
                  >
                    <RiInstagramLine size={11} />
                    Instagram
                  </a>
                  <a
                    href="https://www.pinterest.com/armangaboyan/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-[11px] text-stone-500 transition hover:border-stone-900 hover:text-stone-900"
                  >
                    <RiPinterestLine size={11} />
                    Pinterest
                  </a>
                </motion.div>
              </div>

              <div>
                {featuredImages.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {featuredImages.map((image, index) => (
                      <FeaturedCard
                        key={image.id || `${image.src}-${index}`}
                        image={image}
                        index={index}
                        onOpen={setSelectedImage}
                      />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/50 px-8 py-16 text-center"
                  >
                    <RiCameraLine size={28} className="mb-3 text-stone-300" />
                    <p className="text-sm font-medium text-stone-600">
                      No featured images yet
                    </p>
                    <p className="mt-1.5 text-xs leading-6 text-stone-400">
                      Mark an uploaded image as featured from the admin panel.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </section>

          <div ref={dividerRef} className="mb-20 overflow-hidden">
            <motion.div
              className="h-px bg-stone-200"
              initial={{ scaleX: 0, originX: 0 }}
              animate={dividerInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, ease }}
            />
          </div>

          {categories.length > 0 ? (
            <section className="mb-24">
              <motion.p
                className="mb-5 text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-400"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                Explore work
              </motion.p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {categories.map((group, index) => (
                  <CategoryCard
                    key={group.id || group.category}
                    group={group}
                    index={index}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-2 border-t border-stone-200 pt-10 text-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
              Arman Gaboyan
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[12px] text-stone-500">
              <a
                href="https://www.instagram.com/armangaboyanstudio/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2 transition hover:border-stone-900 hover:text-stone-900"
              >
                <RiInstagramLine size={12} />
                Instagram
              </a>
              <a
                href="https://www.pinterest.com/armangaboyan/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-4 py-2 transition hover:border-stone-900 hover:text-stone-900"
              >
                <RiPinterestLine size={12} />
                Pinterest
              </a>
              <a
                href="mailto:arman@example.com"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2 text-[12px] text-stone-600 transition hover:border-stone-900 hover:text-stone-900"
              >
                <RiMailLine size={11} />
                Get in touch
              </a>
            </div>
            <p className="mt-3 text-xs text-stone-400">
              Glendale, CA · Available worldwide · Open for commissions
            </p>
          </motion.footer>
        </main>
      </div>

      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  )
}

export async function getServerSideProps() {
  const { getPortfolioData } = await import("@/lib/portfolio")
  const portfolio = await getPortfolioData()
  return { props: { portfolio } }
}
