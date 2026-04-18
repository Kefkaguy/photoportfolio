import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import {
  RiArrowRightUpLine,
  RiCameraLine,
  RiCloseLine,
  RiMapPin2Line,
  RiMailLine,
  RiMenuLine,
} from "react-icons/ri"

import { slugify } from "@/lib/strings"

const ease = [0.25, 0.1, 0.25, 1]

// ─── Top Navigation ───────────────────────────────────────────────────────────

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
          borderBottom: scrolled ? "1px solid rgba(28,25,23,0.08)" : "1px solid transparent",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.1 }}
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <RiCameraLine size={13} className="text-stone-400" />
            <span className="text-[14px] font-semibold tracking-wide text-stone-800">
              Arman Gaboyan
            </span>
          </Link>


          {/* Desktop: CTA */}
          <a
            href="mailto:arman@example.com"
            className="hidden items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-stone-700 md:flex"
          >
            <RiMailLine size={13} />
            Get in touch
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex items-center rounded-full border border-stone-200 px-3 py-2 text-stone-500 transition hover:border-stone-400 hover:text-stone-900 md:hidden"
          >
            <RiMenuLine size={17} />
          </button>
        </motion.div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-2xl"
            >
              <div className="flex h-16 items-center justify-between border-b border-stone-100 px-6">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-stone-400">Menu</span>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-900"
                >
                  <RiCloseLine size={20} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col px-6 pt-6">
                {categories.map((group) => (
                  <Link
                    key={group.id || group.category}
                    href={`/${group.slug || slugify(group.category)}`}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center justify-between border-b border-stone-100 py-5 text-stone-900 transition-opacity hover:opacity-50"
                  >
                    <span className="font-display text-[1.75rem] font-semibold leading-none tracking-tight">
                      {group.category}
                    </span>
                    <RiArrowRightUpLine size={16} className="text-stone-300 transition group-hover:text-stone-700" />
                  </Link>
                ))}
              </nav>

              <div className="p-6 pb-10">
                <a
                  href="mailto:arman@example.com"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-stone-900 py-4 text-[14px] font-medium text-white transition hover:bg-stone-700"
                >
                  <RiMailLine size={14} />
                  Get in touch
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ image, onClose }) {
  useEffect(() => {
    if (!image) return undefined
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [image, onClose])

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
          style={{ backgroundColor: "rgba(10,9,8,0.88)" }}
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
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease }}
            className="relative flex max-h-full w-full max-w-5xl flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[78vh] overflow-hidden rounded-2xl bg-stone-950">
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-[78vh] w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-1 px-1 sm:flex-row sm:items-end sm:justify-between">
              <p className="font-display text-xl font-semibold text-white">{image.title}</p>
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">{image.category}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Featured Card ─────────────────────────────────────────────────────────────

function FeaturedCard({ image, index, onOpen }) {
  const isFirst = index === 0
  const [hovered, setHovered] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.button
      ref={ref}
      type="button"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(image)}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 text-left transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(28,25,23,0.12)] ${
        isFirst ? "sm:row-span-2" : ""
      }`}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: isFirst ? "3/4" : image.aspectRatio || "4/5" }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover"
          />
        </motion.div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[11px] font-medium text-white"
            >
              <RiArrowRightUpLine size={12} />
              Open
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-stone-200 px-4 py-3">
        <p className="text-sm font-medium tracking-tight text-stone-800">{image.title}</p>
        <span className="text-[10px] uppercase tracking-widest text-stone-400">{image.category}</span>
      </div>
    </motion.button>
  )
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({ group, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease, delay: index * 0.07 }}
    >
      <Link
        href={`/${group.slug || slugify(group.category)}`}
        className="group flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-5 py-4 transition-all duration-200 hover:border-stone-400 hover:shadow-[0_8px_32px_rgba(28,25,23,0.08)]"
      >
        <div>
          <p className="font-display text-lg font-semibold text-stone-900">{group.category}</p>
          <p className="mt-0.5 text-[12px] text-stone-400">{group.items?.length || 0} images</p>
        </div>
        <RiArrowRightUpLine
          size={16}
          className="text-stone-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-stone-700"
        />
      </Link>
    </motion.div>
  )
}

// ─── Home ─────────────────────────────────────────────────────────────────────

export default function Home({ portfolio }) {
  const categories = portfolio.images || []
  const featuredImages = categories.flatMap((group) =>
    group.items
      .filter((img) => img.featured)
      .map((img) => ({ ...img, category: group.category })),
  )
  const [selectedImage, setSelectedImage] = useState(null)

  const dividerRef = useRef(null)
  const dividerInView = useInView(dividerRef, { once: true })

  return (
    <>
      <Head>
        <title>Arman Gaboyan | Photography</title>
        <meta
          name="description"
          content="Portrait, wedding, watch and travel photography by Arman Gaboyan. Based in Glendale."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#f4f2ef] text-stone-900 antialiased">
        <SiteNav categories={categories} />

        <main className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:px-12 lg:pt-36">

          {/* ── Hero ── */}
          <section className="mb-24">

            <motion.div
              className="mb-8 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <span className="h-px w-7 bg-stone-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                Photography
              </span>
              <span className="ml-auto hidden text-[11px] uppercase tracking-[0.18em] text-stone-400 md:block">
                Glendale · CA
              </span>
            </motion.div>

            <motion.h1
              className="font-display mb-5 font-bold leading-[0.92] tracking-[-0.03em] text-stone-900"
              style={{ fontSize: "clamp(3.5rem,10vw,9.5rem)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease, delay: 0.2 }}
            >
              Arman Gaboyan
            </motion.h1>

            <motion.p
              className="mb-12 max-w-md text-[clamp(1rem,2.2vw,1.2rem)] font-light leading-relaxed text-stone-500"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.35 }}
            >
              Quiet light, bold moments &amp; image-led storytelling.
            </motion.p>

            <div className="grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:items-start lg:gap-20">

              <div className="flex flex-col gap-8">
                <motion.p
                  className="max-w-sm text-[15px] leading-8 text-stone-500"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.45 }}
                >
                  Based in Glendale. Specialising in
                  portraits, weddings, watch photography and travel. Open for
                  bookings and commissions.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, ease, delay: 0.55 }}
                >
                  <a
                    href="mailto:arman@example.com"
                    className="flex items-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-[13px] font-medium text-white transition-colors hover:bg-stone-700"
                  >
                    <RiMailLine size={13} />
                    Book a session
                  </a>
                  <span className="flex items-center gap-2 rounded-full border border-stone-300 px-5 py-3 text-[13px] text-stone-500">
                    <RiMapPin2Line size={13} />
                    Glendale, CA
                  </span>
                </motion.div>
              </div>

              {featuredImages.length > 0 ? (
                <motion.div
                  className="grid gap-3 sm:grid-cols-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.3 }}
                >
                  {featuredImages.map((image, index) => (
                    <FeaturedCard
                      key={image.id || `${image.src}-${index}`}
                      image={image}
                      index={index}
                      onOpen={setSelectedImage}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/50 px-8 py-16 text-center"
                >
                  <RiCameraLine size={28} className="mb-3 text-stone-300" />
                  <p className="text-sm font-medium text-stone-600">No featured images yet</p>
                  <p className="mt-1.5 text-xs leading-6 text-stone-400">
                    Mark an uploaded image as featured from the admin panel.
                  </p>
                </motion.div>
              )}
            </div>
          </section>

          {/* ── Divider ── */}
          <div ref={dividerRef} className="mb-20 overflow-hidden">
            <motion.div
              className="h-px bg-stone-200"
              initial={{ scaleX: 0, originX: 0 }}
              animate={dividerInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, ease }}
            />
          </div>

          {/* ── Categories ── */}
          {categories.length > 0 && (
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
                {categories.map((group, i) => (
                  <CategoryCard key={group.id || group.category} group={group} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* ── Footer ── */}
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
            <p className="text-xs text-stone-400">
              Glendale, CA · Available worldwide · Open for commissions
            </p>
            <a
              href="mailto:arman@example.com"
              className="mt-4 flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2 text-[12px] text-stone-600 transition hover:border-stone-900 hover:text-stone-900"
            >
              <RiMailLine size={11} />
              Get in touch
            </a>
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
