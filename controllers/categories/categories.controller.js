const categoryModel = require("../../models/CategoryModel");
const Category = require("../../models/CategoryModel");
const Size = require("../../models/sizesModel");
const slugify = require("slugify"); // helps in search engine optimaisation SEO

// list all the categories
exports.displayCategories = async (req, res) => {
  const categories = await categoryModel.find();
  try {
    res.render("admin/categories/list", {
      title: "Add Category",
      categories,
      layout: "admin/layout",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to load categories");
  }
};

// add category to database
exports.addCategory = async (req, res) => {
  try {
    const { name, description, gender, type, image, isActive } = req.body;

    // Basic validation
    if (!name || !type) {
      return res.status(400).render("pages/categories/create", {
        error: "Name and category type are required",
      });
    }

    const category = await Category.create({
      name,
      slug: slugify(name, { lower: true }),
      description,
      gender,
      type,
      image,
      isActive: isActive === "on",
    });

    res.redirect("/admin/categories/addcategory");
  } catch (error) {
    console.error(error);

    // Handle duplicate category (unique fields)
    if (error.code === 11000) {
      return res.status(400).render("pages/categories/create", {
        error: "Category already exists",
      });
    }

    res.status(500).render("pages/categories/create", {
      error: "Something went wrong. Please try again.",
    });
  }
};

//add category form
exports.addCategoryForm = async (req, res) => {
  try {
    res.render("admin/categories/add", {
      title: "Add Category",
      layout: "admin/layout",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
};


//get update category form
exports.updateCategoryForm = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).send("Category not found");
    }

    res.render("admin/categories/edit", {
      title: "Update Category",
      category,
      layout: "admin/layout",
    });
  } catch (error) {
    console.error("Error loading category:", error);
    res.status(500).send("Server error");
  }
};


// Save the updated category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

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
      return res.status(400).send("Name and type are required");
    }

    await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name, { lower: true }),
        description,
        gender,
        type,
        image,
        isActive: isActive === "on"
      },
      { new: true, runValidators: true }
    );

    res.redirect("/admin/categories");

  } catch (error) {
    console.error("Update category error:", error);

    // Handle duplicate slug/name
    if (error.code === 11000) {
      return res.status(400).send("Category with this name already exists");
    }

    res.status(500).send("Failed to update category");
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id; // Get category ID from URL

    await Category.findByIdAndDelete(categoryId); // Delete from MongoDB

    res.redirect("/admin/categories"); // Go back to category list
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting category");
  }
};


