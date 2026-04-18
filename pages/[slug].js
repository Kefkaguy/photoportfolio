import Head from "next/head"
import Image from "next/image"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import {
  RiArrowLeftLine,
  RiArrowRightUpLine,
  RiCameraLine,
  RiCloseLine,
} from "react-icons/ri"

const ease = [0.22, 1, 0.36, 1]

function Lightbox({ image, category, onClose }) {
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
                {category}
              </p>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function ImageCard({ image, index, onOpen }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay: index * 0.06 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onOpen(image)}
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-[28px] border border-stone-200 bg-white text-left shadow-[0_10px_30px_rgba(28,25,23,0.06)]"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: image.aspectRatio || "4/5" }}>
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.06 : 1 }}
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
      <div className="flex items-start justify-between gap-3 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-stone-900">
            {image.title}
          </h2>
          {image.description ? (
            <p className="mt-1 text-sm leading-6 text-stone-500">{image.description}</p>
          ) : null}
        </div>
        <RiArrowRightUpLine
          className={`mt-0.5 shrink-0 text-stone-500 transition ${hovered ? "translate-x-0.5 -translate-y-0.5 opacity-100" : "opacity-30"}`}
          size={18}
        />
      </div>
    </motion.button>
  )
}

export default function CategoryPage({ category }) {
  const [selectedImage, setSelectedImage] = useState(null)

  return (
    <>
      <Head>
        <title>{category.category} | Arman Gaboyan</title>
        <meta
          name="description"
          content={category.description || `${category.category} photography by Arman Gaboyan.`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#f4f2ef] px-5 py-8 text-stone-900 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-8 flex flex-col gap-6 rounded-[32px] border border-stone-200 bg-white/85 p-6 shadow-[0_30px_120px_rgba(28,25,23,0.08)] backdrop-blur"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-400">
                  Category page
                </p>
                <h1 className="mt-3 text-[clamp(2.6rem,6vw,5.5rem)] font-bold leading-[0.95] tracking-[-0.05em] text-stone-900">
                  {category.category}
                </h1>
                {category.description ? (
                  <p className="mt-4 max-w-3xl text-[15px] leading-8 text-stone-500">
                    {category.description}
                  </p>
                ) : (
                  <p className="mt-4 max-w-2xl text-[15px] leading-8 text-stone-500">
                    A dedicated gallery page for {category.category.toLowerCase()} work.
                  </p>
                )}
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-900"
              >
                <RiArrowLeftLine size={16} />
                Back home
              </Link>
            </div>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-stone-400">
              <RiCameraLine size={14} />
              <span>
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
            <div className="flex min-h-[280px] items-center justify-center rounded-[28px] border border-dashed border-stone-300 bg-white/70 p-8 text-center text-stone-500">
              No images in this category yet.
            </div>
          )}
        </div>
      </div>

      <Lightbox image={selectedImage} category={category.category} onClose={() => setSelectedImage(null)} />
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { getCategoryBySlug } = await import("@/lib/portfolio")
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      category,
    },
  }
}
