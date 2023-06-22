const express = require("express");
const blogs = require("../controllers/blogs");
const news = require("../controllers/news");
const contactForm = require("../controllers/contactForm");

const router = express.Router();
// for contactForm Routes
router.get("/", contactForm.welocome);
router.post("/contact", contactForm.contactForms);
router.get("/getcontacts", contactForm.getContactFormsByPagination);

// for Blogs Routes
router.get("/blog/getAll", blogs.getAllBlogs);
router.get("/blog/getLastFive", blogs.getLastFive);
router.get("/blog/popularBlogs", blogs.popularBlogs);
router.get("/blog/getBlogsByPagination", blogs.blogsGetsByPagination);
router.get("/blog/:category/:slug", blogs.getBlogBySlug);
router.post("/blog/createBlog", blogs.createBlog);
router.patch("/blog/update/:blogId", blogs.updateBlog);
router.delete("/blog/delete/:blogId", blogs.deleteBlog);

// for News Routes
router.get("/news/getAll", news.getAllNews);
router.get("/news/getLastFive", news.getLastFive);
router.get("/news/popularNews", news.popularNews);
router.get("/news/getNewsByPagination", news.getNewsByPagination);
router.get("/news/:slug", news.getNewsBySlug);
router.post("/news/createNews", news.createNews);
router.patch("/news/update/:blogId", news.updateNews);
router.delete("/news/delete/:blogId", news.deleteNews);

module.exports = router;