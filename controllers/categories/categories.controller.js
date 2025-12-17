const categoryModel = require('../../models/CategoryModel');
const Category = require('../../models/CategoryModel');
const Size = require('../../models/sizesModel');




exports.addCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      gender,
      type,
      image,
      isActive
    } = req.body;

    // Basic validation
    if (!name || !type) {
      return res.status(400).render("pages/categories/create", {
        error: "Name and category type are required"
      });
    }

    const category = await Category.create({
      name,
      slug: slugify(name, { lower: true }),
      description,
      gender,
      type,
      image,
      isActive: isActive === "on"
    });

    res.redirect("/admin/categories");

  } catch (error) {
    console.error(error);

    // Handle duplicate category (unique fields)
    if (error.code === 11000) {
      return res.status(400).render("pages/categories/create", {
        error: "Category already exists"
      });
    }

    res.status(500).render("pages/categories/create", {
      error: "Something went wrong. Please try again."
    });
  }
};

//add category form
exports.addCategoryForm = async (req, res) => {
    try {
      
   
      res.render('admin/categories/add', { 
        title: "Add Category", 
        layout: 'admin/layout'
  
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error loading edit form");
    }
  }
