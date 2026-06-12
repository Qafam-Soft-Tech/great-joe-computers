import Product from '../models/Product.js';
import { cloudinary } from '../config/cloudinary.js';

export const createProduct = async (req, res, next) => {
  try {
    const images = req.files
      ? req.files.map((file) => ({ url: file.path, public_id: file.filename }))
      : [];
    const product = await Product.create({ ...req.body, images });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, search, inStock, page = 1, limit = 12, sort } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (inStock === 'true') filter.stockCount = { $gt: 0 };

    const sortOption =
      sort === 'price_asc' ? { price: 1 } : sort === 'price_desc' ? { price: -1 } : { createdAt: -1 };

    const currentPage = Math.max(1, Number(page));
    const perPage = Math.min(50, Number(limit));

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .lean();

    res.json({
      success: true,
      count: products.length,
      total,
      currentPage,
      totalPages: Math.ceil(total / perPage),
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (req.files && req.files.length > 0) {
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      req.body.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    await product.deleteOne();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};