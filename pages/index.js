import Head from "next/head"
import Image from "next/image"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import {
  RiArrowRightUpLine,
  RiCameraLine,
  RiCloseLine,
  RiMapPin2Line,
  RiMailLine,
} from "react-icons/ri"

import { slugify } from "@/lib/strings"

const ease = [0.22, 1, 0.36, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(4px)" },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease, delay: i * 0.09 },
  }),
}

const fadeIn = {
  hidden: { opacity: 0 },
  show: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.55, ease: "easeOut", delay: i * 0.07 },
  }),
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const staggerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

function AnimatedHeading({ text, className }) {
  const words = text.split(" ")

  return (
    <motion.h1 variants={staggerFast} className={className} aria-label={text}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="mr-[0.22em] inline-block overflow-hidden last:mr-0"
        >
          <motion.span
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: {
                y: "0%",
                opacity: 1,
                transition: { duration: 0.75, ease, delay: index * 0.055 },
              },
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  )
}

function NavDot({ label, href }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-400 transition-colors duration-200 hover:text-stone-900"
    >
      <span className="block h-px w-4 bg-stone-300 transition-all duration-300 group-hover:w-7 group-hover:bg-stone-700" />
      {label}
    </a>
  )
}

function InView({ children, className = "" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CategoryPill({ label, href }) {
  return (
    <motion.a
      href={href}
      variants={fadeUp}
      whileHover={{ scale: 1.05, backgroundColor: "#292524" }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="inline-block rounded-full bg-stone-900 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-stone-100"
    >
      {label}
    </motion.a>
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
      variants={fadeUp}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(image)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease }}
      className={`group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 text-left ${
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

function GalleryCard({ image, index, onOpen }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      type="button"
      variants={fadeUp}
      custom={index}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(image)}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease }}
      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white text-left"
      style={{
        boxShadow: hovered
          ? "0 20px 60px rgba(28,25,23,0.12)"
          : "0 1px 4px rgba(28,25,23,0.05)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: image.aspectRatio || "4/5" }}
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
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        </motion.div>
      </div>
      <div className="flex items-start justify-between gap-2 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold leading-snug tracking-tight text-stone-900">
            {image.title}
          </h3>
          {image.description ? (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-500">
              {image.description}
            </p>
          ) : null}
        </div>
        <motion.div
          animate={{
            x: hovered ? 2 : 0,
            y: hovered ? -2 : 0,
            opacity: hovered ? 1 : 0.25,
          }}
          transition={{ duration: 0.25 }}
          className="mt-0.5 shrink-0"
        >
          <RiArrowRightUpLine className="text-stone-500" size={18} />
        </motion.div>
      </div>
    </motion.button>
  )
}

function EmptyState({ category }) {
  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/60 px-8 py-16 text-center"
    >
      <RiCameraLine size={28} className="mb-4 text-stone-300" />
      <p className="text-sm font-medium text-stone-500">No images yet</p>
      <p className="mt-2 text-xs leading-6 text-stone-400">
        Add images to <span className="font-semibold text-stone-600">{category}</span>{" "}
        once the collection is ready.
      </p>
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

  const openLightbox = (image) => {
    setSelectedImage(image)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

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
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-52 flex-col justify-between px-8 py-12 xl:flex">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="mb-2 flex items-center gap-2">
              <RiCameraLine size={13} className="text-stone-400" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-stone-400">
                Arman Gaboyan
              </span>
            </div>
            <div className="mb-10 h-px w-full bg-stone-200" />
            <nav className="flex flex-col gap-5">
              {categories.map((group) => (
                <NavDot
                  key={group.id || group.category}
                  label={group.category}
                  href={`#${slugify(group.category)}`}
                />
              ))}
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex flex-col gap-3"
          >
            <a
              href="mailto:arman@example.com"
              className="flex items-center gap-2 text-[11px] text-stone-400 transition-colors hover:text-stone-700"
            >
              <RiMailLine size={11} />
              <span>Get in touch</span>
            </a>
            <div className="flex items-center gap-2 text-[11px] text-stone-400">
              <RiMapPin2Line size={11} />
              <span>Glendale, CA</span>
            </div>
          </motion.div>
        </aside>

        <main className="xl:pl-52">
          <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <motion.section
              variants={stagger}
              initial="hidden"
              animate="show"
              className="mb-20 lg:mb-28"
            >
              <motion.div
                variants={fadeIn}
                className="mb-8 flex items-center justify-between"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                  Photography
                </span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-stone-400 xl:hidden">
                  Glendale · CA
                </span>
              </motion.div>

              <AnimatedHeading
                text="Arman Gaboyan"
                className="mb-3 text-[clamp(3.2rem,9vw,8rem)] font-bold leading-[0.92] tracking-[-0.04em] text-stone-900"
              />

              <motion.p
                variants={fadeUp}
                custom={3}
                className="mb-10 max-w-lg text-[clamp(0.95rem,2.2vw,1.25rem)] font-light leading-snug tracking-tight text-stone-500"
              >
                Quiet light, bold moments &amp; image-led storytelling.
              </motion.p>

              <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-16">
                <div className="flex flex-col gap-6">
                  <motion.p
                    variants={fadeUp}
                    custom={4}
                    className="max-w-sm text-[15px] leading-8 text-stone-500"
                  >
                    Based in Glendale, available worldwide. Specialising in
                    portraits, weddings, watch photography and travel. Open for
                    bookings and commissions.
                  </motion.p>

                  <motion.div
                    variants={fadeUp}
                    custom={5}
                    className="flex flex-wrap gap-2 xl:hidden"
                  >
                    {[
                      { icon: <RiMapPin2Line size={11} />, text: "Glendale, CA" },
                      { icon: <RiMailLine size={11} />, text: "Bookings open" },
                    ].map(({ icon, text }) => (
                      <span
                        key={text}
                        className="flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3.5 py-1.5 text-[11px] text-stone-500"
                      >
                        {icon}
                        {text}
                      </span>
                    ))}
                  </motion.div>

                  <motion.div variants={staggerFast} className="flex flex-wrap gap-2">
                    {categories.map((group) => (
                      <CategoryPill
                        key={group.id || group.category}
                        label={group.category}
                        href={`#${slugify(group.category)}`}
                      />
                    ))}
                  </motion.div>
                </div>

                {featuredImages.length > 0 ? (
                  <motion.div variants={stagger} className="grid gap-3 sm:grid-cols-2">
                    {featuredImages.map((image, index) => (
                      <FeaturedCard
                        key={image.id || `${image.src}-${index}`}
                        image={image}
                        index={index}
                        onOpen={openLightbox}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    variants={fadeUp}
                    custom={5}
                    className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/50 px-8 py-16 text-center"
                  >
                    <RiCameraLine size={32} className="mb-4 text-stone-300" />
                    <p className="text-sm font-medium text-stone-600">
                      No featured images yet
                    </p>
                    <p className="mt-1.5 text-xs leading-6 text-stone-400">
                      Mark an uploaded image as featured from the admin panel to
                      surface it here.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.section>

            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease }}
              className="mb-20 h-px w-full bg-stone-200"
            />

            <div className="flex flex-col gap-24">
              {categories.map((group) => (
                <section
                  key={group.id || group.category}
                  id={slugify(group.category)}
                  className="scroll-mt-12"
                >
                  <InView>
                    <motion.div
                      variants={fadeUp}
                      className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"
                    >
                      <div>
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-stone-400">
                          Category
                        </p>
                        <h2 className="text-[clamp(2.2rem,5vw,3.75rem)] font-bold leading-none tracking-[-0.03em] text-stone-900">
                          {group.category}
                        </h2>
                      </div>
                      <p className="font-mono text-[11px] text-stone-400">
                        {group.items.length === 0
                          ? "No images"
                          : `${group.items.length} image${group.items.length === 1 ? "" : "s"}`}
                      </p>
                    </motion.div>

                    {group.items.length > 0 ? (
                      <motion.div
                        variants={stagger}
                        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                      >
                        {group.items.map((image, index) => (
                          <GalleryCard
                            key={image.id || `${image.src}-${index}`}
                            image={{ ...image, category: group.category }}
                            index={index}
                            onOpen={openLightbox}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <EmptyState category={group.category} />
                    )}
                  </InView>
                </section>
              ))}
            </div>

            <motion.footer
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-28 flex flex-col items-center gap-1.5 border-t border-stone-200 pb-8 pt-10 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                Arman Gaboyan
              </p>
              <p className="text-xs text-stone-400">
                Glendale, CA · Available worldwide · Open for commissions
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-[11px] text-stone-400">
                <RiCameraLine size={11} />
                <span>Photography portfolio</span>
              </div>
            </motion.footer>
          </div>
        </main>
      </div>

      <Lightbox image={selectedImage} onClose={closeLightbox} />
    </>
  )
}

export async function getServerSideProps() {
  const { getPortfolioData } = await import("@/lib/portfolio")
  const portfolio = await getPortfolioData()

  return {
    props: {
      portfolio,
    },
  }
}
