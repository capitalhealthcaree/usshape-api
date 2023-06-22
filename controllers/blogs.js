const Blog = require("../model/Blogs");
const mongodb = require("mongodb");

const getAllBlogs = async (req, res) => {
  let data = await Blog.find();
  if (data) {
    res.status(200).json({ data });
  } else {
    res.status(500).json({ err: "getting some error" });
  }
};
const getLastFive = async (req, res) => {
  try {
    const data = await Blog.find().sort({ _id: -1 }).limit(5);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ err: "error getting blogs" });
  }
};
const popularBlogs = async (req, res) => {
  try {
    const data = await Blog.find().sort({ _id: -1 }).limit(5);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ err: "error getting blogs" });
  }
};
const blogsGetsByPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // default to first page if page is not specified
  const limit = parseInt(req.query.limit) || 12; // default to 10 documents per page if limit is not specified
  const startIndex = (page - 1) * limit;

  try {
    const totalDocs = await Blog.countDocuments();
    const data = await Blog.find().skip(startIndex).limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalDocs / limit),
      data,
    });
  } catch (err) {
    res.status(500).json({ err: "getting some error" });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    let slugs = "/" + req.params.category + "/" + req.params.slug;
    const blog = await Blog.findOne({
      slug: slugs,
    });
    if (!blog) {
      return res.status(404).json({ error: "Blogs not found" });
    }
    res.status(200).json({ data: blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    let result = await Blog.create({
      title: req.body.title,
      metaDes: req.body.metaDes,
      foucKW: req.body.foucKW,
      slug: req.body.slug,
      category: req.body.category,
      seoTitle: req.body.seoTitle,
      image: req.body.image,
    });
    res
      .status(200)
      .json({ data: result, mesasge: "blogs is created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    let id = req.params.blogId;

    let blog = await Blog.updateOne(
      { _id: id },
      {
        $set: {
          title: req.body.title,
          metaDes: req.body.metaDes,
          foucKW: req.body.foucKW,
          category: req.body.category,
          slug: req.body.slug,
          seoTitle: req.body.seoTitle,
          image: req.body.image,
        },
      }
    );

    res.status(200).json({ mesasge: "Blog updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    let deleted = await Blog.deleteOne({
      _id: new mongodb.ObjectId(req.params.blogId),
    });
    res
      .status(200)
      .json({ data: deleted, mesasge: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllBlogs,
  getLastFive,
  popularBlogs,
  blogsGetsByPagination,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
