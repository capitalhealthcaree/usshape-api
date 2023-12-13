const express = require("express");
const blogs = require("../controllers/blogs");
const news = require("../controllers/news");
const contactForm = require("../controllers/contactForm");
const applicationForm = require("../controllers/applicationForm");
const rotationForm = require("../controllers/rotation");
const paypalPayment = require("../controllers/paypalPayment");

const router = express.Router();

//Welcome
router.get("/", contactForm.welocome);

// for contactForm Routes
router.post("/create/contact", contactForm.contactForms);
router.get("/getcontacts", contactForm.getContactFormsByPagination);

// for Nagy Loan Application Form Routes
router.post("/create/applicationForm", applicationForm.applicationForms);
router.get(
  "/getApplicationForm",
  applicationForm.getApplicationFormsByPagination
);
router.get("/getApplicationFormByUrl", applicationForm.getApplicationFormByUrl);

// for Payment with Paypal Routes
router.post("/create/paymentWithPaypal", paypalPayment.PaypalPayments);

// for Rotation Reservation Form Routes
router.post("/create/rotationFormWithPaypal", rotationForm.RotationForms);

// for Blogs Routes
router.get("/blog/getAll", blogs.getAllBlogs);
router.get("/blog/getLastFive", blogs.getLastFive);
router.get("/blog/popularBlogs", blogs.popularBlogs);
router.get("/blog/getBlogsByPagination", blogs.blogsGetsByPagination);
router.get("/blog/:slug", blogs.getBlogBySlug);
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
