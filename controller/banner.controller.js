const Banner = require("../models/banner");

function generateAltTag(title) {
  if (!title) return "";
  return title.replace(/<[^>]*>/g, "").trim() + " Banner";
}

exports.createBanner = async (req, res) => {
  try {

const mainImageFile = req.file;

if (!mainImageFile) {
  return res.status(400).json({
    message: "Banner image is required"
  });
}
    const mainImage = {
      url: mainImageFile.path,
      public_id: mainImageFile.filename
    };

    const banner = new Banner({
      title: req.body.title,
      link: req.body.link,
      position: req.body.position,
      altTag: generateAltTag(req.body.title),
      image: mainImage
    });
    const savedBanner = await banner.save();

    res.status(201).json({
      success: true,
      data: savedBanner
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get All Banners
exports.getBanners = async (req, res) => {
  try {

    const banners = await Banner.find().sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: banners
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Single Banner
exports.getBannerById = async (req, res) => {
  try {

    const banner = await Banner.findById(req.params.id);

    res.status(200).json({
      success: true,
      data: banner
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update Banner
exports.updateBanner = async (req, res) => {
  try {

    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: banner
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete Banner
exports.deleteBanner = async (req, res) => {
  try {

    await Banner.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};