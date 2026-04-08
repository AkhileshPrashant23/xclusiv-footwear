const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getProducts, getProductBySlug, deleteProduct } = require('../controllers/productController');
const Product = require('../models/Product');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'xclusiv-footwear', resource_type: 'image' },
      (err, result) => { if (err) reject(err); else resolve(result.secure_url); }
    );
    stream.end(buffer);
  });

// Public
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Admin - create
router.post('/', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0)
      imageUrls = await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer)));
    const productData = { ...req.body, images: imageUrls, sizes: JSON.parse(req.body.sizes || '[]') };
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// Admin - update
router.put('/:id', protect, adminOnly, upload.array('images', 5), async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.body.sizes) updateData.sizes = JSON.parse(req.body.sizes);
    if (req.files && req.files.length > 0)
      updateData.images = await Promise.all(req.files.map((f) => uploadToCloudinary(f.buffer)));
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: product });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

// Admin - delete
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
