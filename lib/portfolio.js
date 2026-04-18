import fallbackPortfolio from "@/data/portfolio.json"
import { ObjectId } from "mongodb"

import { getDb, isMongoConfigured } from "@/lib/mongodb"
import { slugify } from "@/lib/strings"

const DEFAULT_CATEGORIES = [
  { category: "Portraits", folder: "portraits" },
  { category: "Weddings", folder: "weddings" },
  { category: "Watches", folder: "watches" },
  { category: "Travel", folder: "travel" },
]

function ensureDefaultCategories(images = []) {
  const existingFolders = new Set(images.map((item) => item.folder))
  const nextImages = [...images]

  for (const category of DEFAULT_CATEGORIES) {
    if (!existingFolders.has(category.folder)) {
      nextImages.push({
        ...category,
        items: [],
      })
    }
  }

  return nextImages
}

function normalizeAspectRatio(value) {
  return value ? String(value) : "4/5"
}

function normalizeItem(item, categoryId) {
  return {
    id: item.id || null,
    categoryId: categoryId || item.categoryId || null,
    title: item.title || "Untitled",
    alt: item.alt || item.title || "Portfolio image",
    description: item.description || "",
    src: item.src || "",
    s3Key: item.s3Key || "",
    aspectRatio: normalizeAspectRatio(item.aspectRatio),
    featured: Boolean(item.featured),
  }
}

function getFallbackImages() {
  return ensureDefaultCategories(fallbackPortfolio.images || []).map(
    (group, index) => ({
      id: null,
      category: group.category,
      folder: group.folder || slugify(group.category),
      order: index,
      items: (group.items || []).map((item) => normalizeItem(item)),
    }),
  )
}

export function getFallbackPortfolio() {
  return {
    images: getFallbackImages(),
  }
}

async function ensureSeedData(db) {
  const count = await db.collection("categories").countDocuments()
  if (count > 0) {
    return
  }

  const seed = getFallbackImages()
  if (seed.length === 0) {
    return
  }

  const timestamp = new Date()
  const categories = seed.map((group) => ({
    category: group.category,
    slug: slugify(group.category),
    folder: group.folder || slugify(group.category),
    order: group.order,
    createdAt: timestamp,
    updatedAt: timestamp,
  }))

  const categoryInsert = await db.collection("categories").insertMany(categories)
  const images = seed.flatMap((group, index) => {
    const categoryId = categoryInsert.insertedIds[index]
    return group.items.map((item) => ({
      categoryId,
      title: item.title,
      alt: item.alt,
      description: item.description,
      src: item.src,
      s3Key: item.s3Key,
      aspectRatio: item.aspectRatio,
      featured: item.featured,
      createdAt: timestamp,
      updatedAt: timestamp,
    }))
  })

  if (images.length > 0) {
    await db.collection("images").insertMany(images)
  }
}

function serializeCategory(category, imagesByCategoryId) {
  const categoryId = category._id.toString()
  return {
    id: categoryId,
    category: category.category,
    folder: category.folder || category.slug,
    order: category.order || 0,
    items: (imagesByCategoryId.get(categoryId) || []).map((image) => ({
      id: image._id.toString(),
      categoryId,
      title: image.title,
      alt: image.alt,
      description: image.description || "",
      src: image.src,
      s3Key: image.s3Key || "",
      aspectRatio: normalizeAspectRatio(image.aspectRatio),
      featured: Boolean(image.featured),
    })),
  }
}

async function readMongoPortfolio(db) {
  const [categories, images] = await Promise.all([
    db.collection("categories").find({}).sort({ order: 1, createdAt: 1 }).toArray(),
    db.collection("images").find({}).sort({ createdAt: -1 }).toArray(),
  ])

  const imagesByCategoryId = new Map()
  for (const image of images) {
    const key = image.categoryId.toString()
    if (!imagesByCategoryId.has(key)) {
      imagesByCategoryId.set(key, [])
    }
    imagesByCategoryId.get(key).push(image)
  }

  return {
    images: categories.map((category) =>
      serializeCategory(category, imagesByCategoryId),
    ),
  }
}

async function getMongoPortfolio() {
  const db = await getDb()
  await ensureSeedData(db)
  return readMongoPortfolio(db)
}

function ensureObjectId(value, label) {
  if (!ObjectId.isValid(value)) {
    throw new Error(`Invalid ${label}`)
  }

  return new ObjectId(value)
}

async function requireDb() {
  if (!isMongoConfigured()) {
    throw new Error("MongoDB is not configured")
  }

  const db = await getDb()
  await ensureSeedData(db)
  return db
}

export async function getPortfolioData() {
  if (!isMongoConfigured()) {
    return getFallbackPortfolio()
  }

  try {
    return await getMongoPortfolio()
  } catch (error) {
    console.error("Failed to load portfolio from MongoDB", error)
    throw error
  }
}

export async function createCategory({ category }) {
  const name = String(category || "").trim()
  if (!name) {
    throw new Error("Category name is required")
  }

  const db = await requireDb()
  const slug = slugify(name)
  const existing = await db.collection("categories").findOne({ slug })
  if (existing) {
    throw new Error("Category already exists")
  }

  const [lastCategory] = await db
    .collection("categories")
    .find({})
    .sort({ order: -1 })
    .limit(1)
    .toArray()

  const timestamp = new Date()
  const document = {
    category: name,
    slug,
    folder: slug,
    order: typeof lastCategory?.order === "number" ? lastCategory.order + 1 : 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  const result = await db.collection("categories").insertOne(document)

  return {
    id: result.insertedId.toString(),
    category: name,
    folder: slug,
    items: [],
  }
}

export async function updateCategory(id, { category }) {
  const name = String(category || "").trim()
  if (!name) {
    throw new Error("Category name is required")
  }

  const db = await requireDb()
  const objectId = ensureObjectId(id, "category id")
  const existing = await db.collection("categories").findOne({
    slug: slugify(name),
    _id: { $ne: objectId },
  })

  if (existing) {
    throw new Error("Category already exists")
  }

  const current = await db.collection("categories").findOne({ _id: objectId })
  if (!current) {
    throw new Error("Category not found")
  }

  await db.collection("categories").updateOne(
    { _id: objectId },
    {
      $set: {
        category: name,
        slug: slugify(name),
        updatedAt: new Date(),
      },
    },
  )

  return {
    id,
    category: name,
    folder: current.folder,
  }
}

export async function deleteCategory(id) {
  const db = await requireDb()
  const objectId = ensureObjectId(id, "category id")
  const images = await db
    .collection("images")
    .find({ categoryId: objectId })
    .project({ s3Key: 1 })
    .toArray()

  const categoryResult = await db.collection("categories").deleteOne({ _id: objectId })
  if (!categoryResult.deletedCount) {
    throw new Error("Category not found")
  }

  await db.collection("images").deleteMany({ categoryId: objectId })

  return {
    deleted: true,
    imageKeys: images.map((image) => image.s3Key).filter(Boolean),
  }
}

export async function addImage(input) {
  const db = await requireDb()
  const categoryId = ensureObjectId(input.categoryId, "category id")
  const category = await db.collection("categories").findOne({ _id: categoryId })

  if (!category) {
    throw new Error("Category not found")
  }

  const title = String(input.title || "").trim()
  const src = String(input.src || "").trim()
  if (!title || !src) {
    throw new Error("Title and image URL are required")
  }

  const timestamp = new Date()
  const document = {
    categoryId,
    title,
    alt: String(input.alt || title).trim(),
    description: String(input.description || "").trim(),
    src,
    s3Key: String(input.s3Key || "").trim(),
    aspectRatio: normalizeAspectRatio(input.aspectRatio),
    featured: Boolean(input.featured),
    createdAt: timestamp,
    updatedAt: timestamp,
  }

  const result = await db.collection("images").insertOne(document)

  return {
    id: result.insertedId.toString(),
    ...document,
    categoryId: categoryId.toString(),
  }
}

export async function deleteImage(id) {
  const db = await requireDb()
  const objectId = ensureObjectId(id, "image id")
  const image = await db.collection("images").findOne({ _id: objectId })

  if (!image) {
    throw new Error("Image not found")
  }

  await db.collection("images").deleteOne({ _id: objectId })

  return {
    deleted: true,
    s3Key: image.s3Key || "",
  }
}
