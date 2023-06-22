const News = require("../model/News");
const mongodb = require("mongodb");

const getAllNews = async (req, res) => {
  let data = await News.find();
  if (data) {
    res.status(200).json({ data });
  } else {
    res.status(500).json({ err: "getting some error" });
  }
};
const getLastFive = async (req, res) => {
  try {
    const data = await News.find().sort({ _id: -1 }).limit(5);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ err: "error getting blogs" });
  }
};
const popularNews = async (req, res) => {
  try {
    const data = await News.find().sort({ _id: -1 }).limit(5);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ err: "error getting blogs" });
  }
};
const getNewsByPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // default to first page if page is not specified
  const limit = parseInt(req.query.limit) || 12; // default to 10 documents per page if limit is not specified
  const startIndex = (page - 1) * limit;

  try {
    const totalDocs = await News.countDocuments();
    const data = await News.find().skip(startIndex).limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalDocs / limit),
      data,
    });
  } catch (err) {
    res.status(500).json({ err: "getting some error" });
  }
};

const getNewsBySlug = async (req, res) => {
  try {
    let slugs = req.params.slug;
    const blog = await News.findOne({
      slug: slugs,
    });
    if (!blog) {
      return res.status(404).json({ error: "News not found" });
    }
    res.status(200).json({ data: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createNews = async (req, res) => {
  try {
    let result = await News.create({
      title: req.body.title,
      metaDes: req.body.metaDes,
      foucKW: req.body.foucKW,
      slug: req.body.slug,
      seoTitle: req.body.seoTitle,
      image: req.body.image,
    });
    res
      .status(200)
      .json({ data: result, mesasge: "News is created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateNews = async (req, res) => {
  try {
    let id = req.params.blogId;

    let blog = await News.updateOne(
      { _id: id },
      {
        $set: {
          title: req.body.title,
          metaDes: req.body.metaDes,
          foucKW: req.body.foucKW,
          slug: req.body.slug,
          seoTitle: req.body.seoTitle,
          image: req.body.image,
        },
      }
    );

    res.status(200).json({ mesasge: "News updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteNews = async (req, res) => {
  try {
    let deleted = await News.deleteOne({
      _id: new mongodb.ObjectId(req.params.blogId),
    });
    res
      .status(200)
      .json({ data: deleted, mesasge: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllNews,
  getLastFive,
  popularNews,
  getNewsByPagination,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
};
