const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const path = require("path");
const Category = require("../models/Category");
const User = require("../models/User");

// To create new project
router.get("/new", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/users/login");
  }
  Category.find({})
    .lean()
    .then((categories) => {
      res.render("site/addproject", { categories: categories });
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

// To search
router.get("/search", (req, res) => {
    if (req.query.look) {
        const regex = new RegExp(escapeRegex(req.query.look), 'gi');
        Post.find({ "projectName": regex })
            .populate({ path: "author", model: User })
            .sort({ $natural: -1 })
            .lean()
            .then((projects) => {
                const topProjects = projects.slice(0, 4);   
                const otherProjects = projects.slice(4); 
                Category.aggregate([
                    {
                        $lookup: {
                            from: "posts",
                            localField: "_id",
                            foreignField: "category",
                            as: "posts",
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            num_of_posts: { $size: "$posts" },
                        },
                    },
                ]).then((categories) => {
                    res.render("site/projects", { projects:projects, categories:categories , topProjects, otherProjects });
                });
            });
    } else {
        res.redirect("/projects");
    }
});

// To categorize
router.get('/category/:categoryId', (req, res) => { 
  Post.find({ category: req.params.categoryId }).populate({ path: "category", model: Category }).populate({path: 'author', model: User}).lean().then((projects) => {
      const topProjects = projects.slice(0, 4);   
      const otherProjects = projects.slice(4); 
      Category.aggregate([
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "category",
            as: "posts",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            num_of_projects: { $size: "$posts" },
          },
        },
      ]).then((categories) => {
        res.render("site/projects", { projects:projects, categories:categories , topProjects, otherProjects });
      });
    });
});

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .populate({ path: "author", model: User })
    .lean()
    .then((project) => {
      // Number of Category 
      Category.aggregate([
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "category",
            as: "posts",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            num_of_projects: { $size: "$posts" },
          },
        },
      ]).then((categories) => {
          res.render("site/project", {
            project: project,
            categories: categories,
          });
        });
    });
});

// Veritabanına gönderme
router.post("/test", (req, res) => {
  let project_image = req.files.project_image;

  project_image.mv(
    path.resolve(
      __dirname,
      "../public/images/projectImages",
      project_image.name
    )
  );

  Post.create({
    ...req.body,
    project_image: `/images/projectImages/${project_image.name}`,
    author: req.session.userId,
  });

  req.session.sessionFlash = {
    type: "alert alert-success",
    message: "Your project has been added successfully.",
  };

  res.redirect("/projects");
});

module.exports = router;
