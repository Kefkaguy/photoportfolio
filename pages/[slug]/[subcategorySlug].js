import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion, useInView } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import {
  RiArrowLeftLine,
  RiArrowRightUpLine,
  RiCameraLine,
  RiCloseLine,
  RiMailLine,
} from "react-icons/ri"

const ease = [0.25, 0.1, 0.25, 1]

function Lightbox({ image, category, subcategory, onClose }) {
  useEffect(() => {
    if (!image) {
      return undefined
    }

    const onKey = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [image, onClose])

  return (
    <AnimatePresence>
      {image ? (
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
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative max-h-[78vh] overflow-hidden rounded-2xl bg-stone-950">
              <img
                src={image.src}
                alt={image.alt}
                className="max-h-[78vh] w-full object-contain"
              />
            </div>
            <div className="flex flex-col gap-3 px-1">
              <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/45">
                <span>{category}</span>
                <span>{subcategory}</span>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">{image.title}</p>
                {image.description ? (
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-white/60">
                    {image.description}
                  </p>
                ) : null}
              </div>
              {Array.isArray(image.tags) && image.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {image.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/75"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function ImageCard({ image, index, onOpen }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      ref={ref}
      type="button"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(image)}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease, delay: (index % 6) * 0.07 }}
      whileHover={{ y: -4 }}
      className="group w-full overflow-hidden rounded-[22px] border border-stone-200 bg-white text-left transition-shadow duration-300 hover:shadow-[0_16px_48px_rgba(28,25,23,0.1)]"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: image.aspectRatio || "4/5" }}>
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.6, ease }}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <AnimatePresence>
          {hovered ? (
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
          ) : null}
        </AnimatePresence>
      </div>

      <div className="space-y-3 border-t border-stone-100 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-stone-900">
              {image.title}
            </h2>
            {image.description ? (
              <p className="mt-1 text-sm leading-6 text-stone-400">{image.description}</p>
            ) : null}
          </div>
          <RiArrowRightUpLine
            size={15}
            className="mt-0.5 shrink-0 text-stone-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-stone-600"
          />
        </div>

        {Array.isArray(image.tags) && image.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {image.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-stone-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </motion.button>
  )
}

export default function SubcategoryPage({ category }) {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <>
      <Head>
        <title>{`${category.subcategory.name} | ${category.category} | Arman Gaboyan`}</title>
        <meta
          name="description"
          content={
            category.description ||
            `${category.subcategory.name} from ${category.category} photography by Arman Gaboyan.`
          }
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#f4f2ef] text-stone-900 antialiased">
        <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-[#f4f2ef]/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
            <Link
              href={`/${category.slug}`}
              className="flex items-center gap-2 text-[13px] font-medium text-stone-500 transition hover:text-stone-900"
            >
              <RiArrowLeftLine size={15} />
              Back
            </Link>

            <div className="flex items-center gap-2 text-stone-400">
              <RiCameraLine size={12} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">
                Arman Gaboyan
              </span>
            </div>

            <a
              href="mailto:arman@example.com"
              className="flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-stone-700"
            >
              <RiMailLine size={12} />
              Contact
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 pb-24 pt-14 sm:px-8 lg:px-12">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-6 bg-stone-400" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-400">
                Subcategory
              </p>
            </div>
            <div className="mb-4 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-stone-400">
              <Link href={`/${category.slug}`} className="hover:text-stone-900">
                {category.category}
              </Link>
              <span>/</span>
              <span className="text-stone-700">{category.subcategory.name}</span>
            </div>
            <h1
              className="mb-4 font-bold leading-[0.92] tracking-[-0.03em] text-stone-900"
              style={{ fontSize: "clamp(3rem,8vw,7rem)" }}
            >
              {category.subcategory.name}
            </h1>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              {category.description ? (
                <p className="max-w-3xl text-[15px] leading-8 text-stone-500">
                  {category.description}
                </p>
              ) : (
                <p className="max-w-3xl text-[15px] leading-8 text-stone-500">
                  Part of {category.category}.
                </p>
              )}
              <span className="lg:ml-auto whitespace-nowrap rounded-full border border-stone-200 bg-white px-4 py-1.5 text-[12px] text-stone-400">
                {category.items.length} image{category.items.length === 1 ? "" : "s"}
              </span>
            </div>
          </motion.div>

          {category.items.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {category.items.map((image, index) => (
                <ImageCard
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
              transition={{ duration: 0.5 }}
              className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/70 p-8 text-center text-stone-500"
            >
              No images in this subcategory yet.
            </motion.div>
          )}
        </main>
      </div>

      <Lightbox
        image={selectedImage}
        category={category.category}
        subcategory={category.subcategory.name}
        onClose={() => setSelectedImage(null)}
      />
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { getSubcategoryBySlugs } = await import("@/lib/portfolio")
  const category = await getSubcategoryBySlugs(params.slug, params.subcategorySlug)

  if (!category) {
    return { notFound: true }
  }

  return { props: { category } }
}
