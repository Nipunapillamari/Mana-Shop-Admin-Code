import React, { useState, useEffect } from 'react';
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import axios from 'axios';
import API from "../../config"

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  // Dynamic data states
  const [superCategories, setSuperCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState({
    super: false,
    category: false,
    sub: false
  });

  const [productdetails, setProductdetails] = useState({
    name: "",
    image: "",
    supercategory: "",
    category: "",
    subcategory: "",
    new_price: "",
    old_price: ""
  });

  // Fetch super categories on component mount
  useEffect(() => {
    fetchSuperCategories();
  }, []);

  // Fetch categories when supercategory changes
  useEffect(() => {
    if (productdetails.supercategory) {
      fetchCategories(productdetails.supercategory);
    } else {
      setCategories([]);
      setProductdetails(prev => ({ ...prev, category: "", subcategory: "" }));
      setSubCategories([]);
    }
  }, [productdetails.supercategory]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (productdetails.category) {
      fetchSubCategories(productdetails.category);
    } else {
      setSubCategories([]);
      setProductdetails(prev => ({ ...prev, subcategory: "" }));
    }
  }, [productdetails.category]);

  // Update subcategory when subCategories list changes
  useEffect(() => {
    if (subCategories.length > 0 && !productdetails.subcategory) {
      setProductdetails(prev => ({
        ...prev,
        subcategory: subCategories[0]._id
      }));
    }
  }, [subCategories]);

  const fetchSuperCategories = async () => {
    setLoading(prev => ({ ...prev, super: true }));
    try {
      const res = await axios.get(`${API}/allsupercategories`);
      const superCats = res.data;
      setSuperCategories(superCats);

      // Set default supercategory if available
      if (superCats.length > 0) {
        const firstSuperCat = superCats[0];
        setProductdetails(prev => ({
          ...prev,
          supercategory: firstSuperCat._id
        }));
      }
    } catch (error) {
      console.error("Error fetching super categories:", error);
      alert("Failed to load super categories");
    } finally {
      setLoading(prev => ({ ...prev, super: false }));
    }
  };

  const fetchCategories = async (superCategoryId) => {
    if (!superCategoryId) return;

    setLoading(prev => ({ ...prev, category: true }));
    try {
      const res = await axios.get(`${API}/categories/${superCategoryId}`);
      const cats = res.data;
      setCategories(cats);

      // Set default category if available
      if (cats.length > 0) {
        const firstCat = cats[0];
        setProductdetails(prev => ({
          ...prev,
          category: firstCat._id,
          subcategory: "" // Reset subcategory when category changes
        }));
      } else {
        setProductdetails(prev => ({ ...prev, category: "", subcategory: "" }));
        setSubCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
      setProductdetails(prev => ({ ...prev, category: "", subcategory: "" }));
    } finally {
      setLoading(prev => ({ ...prev, category: false }));
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) return;

    setLoading(prev => ({ ...prev, sub: true }));
    try {
      const res = await axios.get(`${API}/subcategories/${categoryId}`);
      const subs = res.data;
      setSubCategories(subs);

      // Set default subcategory if available
      if (subs.length > 0) {
        setProductdetails(prev => ({
          ...prev,
          subcategory: subs[0]._id
        }));
      } else {
        setProductdetails(prev => ({ ...prev, subcategory: "" }));
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
      setProductdetails(prev => ({ ...prev, subcategory: "" }));
    } finally {
      setLoading(prev => ({ ...prev, sub: false }));
    }
  };

  const imageHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file); // preview kosam

    const formData = new FormData();
    formData.append("product", file);

    try {
      const res = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        console.log("Cloudinary URL:", data.image_url);
        setUploadedImageUrl(data.image_url); // store URL
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;

    if (name === 'supercategory') {
      setProductdetails(prev => ({
        ...prev,
        [name]: value,
        category: "",
        subcategory: ""
      }));
    } else if (name === 'category') {
      setProductdetails(prev => ({
        ...prev,
        [name]: value,
        subcategory: ""
      }));
    } else {
      setProductdetails(prev => ({
        ...prev,
        [name]: value
      }));
    }
  }

  // Helper function to get name by ID
  const getNameById = (list, id) => {
    const item = list.find(item => item._id === id);
    return item ? item.name : "";
  };

  const addproduct = async () => {
    // Validate required fields
    if (!productdetails.name.trim()) {
      alert("Please enter product title");
      return;
    }
    if (!productdetails.old_price || !productdetails.new_price) {
      alert("Please enter both prices");
      return;
    }
    if (!image) {
      alert("Please upload product image");
      return;
    }
    if (!productdetails.supercategory) {
      alert("Please select a super category");
      return;
    }
    if (!productdetails.category) {
      alert("Please select a category");
      return;
    }
    if (!productdetails.subcategory) {
      alert("Please select a subcategory");
      return;
    }

    // Get actual names from IDs
    const superCategoryName = getNameById(superCategories, productdetails.supercategory);
    const categoryName = getNameById(categories, productdetails.category);
    const subCategoryName = getNameById(subCategories, productdetails.subcategory);

    if (!superCategoryName || !categoryName || !subCategoryName) {
      alert("Please select valid categories");
      return;
    }

    setIsUploading(true);

    try {
      if (!uploadedImageUrl) {
        alert("Please wait, image uploading...");
        setIsUploading(false);
        return;
      }

      // Prepare product data
      const productData = {
        name: productdetails.name,
        image: uploadedImageUrl,
        supercategory: superCategoryName,
        category: categoryName,
        subcategory: subCategoryName,
        new_price: Number(productdetails.new_price),
        old_price: Number(productdetails.old_price)
      };

      // Add product
      const addResponse = await fetch(`${API}/addproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await addResponse.json();

      if (result.success) {
        alert("Product Added Successfully!");

        setProductdetails({
          name: "",
          image: "",
          supercategory: superCategories.length > 0 ? superCategories[0]._id : "",
          category: "",
          subcategory: "",
          new_price: "",
          old_price: ""
        });

        setImage(false);
        setUploadedImageUrl("");

        if (productdetails.supercategory) {
          fetchCategories(productdetails.supercategory);
        }

      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='addproduct-container'>
      <div className='addproduct-header'>
        <h1>Add New Product</h1>
        <p>Fill in the details below to add a new product to your store</p>
      </div>

      <div className='addproduct-card'>
        {/* Product Title */}
        <div className='addproduct-section'>
          <h3 className='section-title'>Product Information</h3>
          <div className='form-group'>
            <label className='form-label'>Product Title *</label>
            <input
              type="text"
              name="name"
              placeholder='Enter product title'
              value={productdetails.name}
              onChange={changeHandler}
              className='form-input'
            />
            <p className='form-hint'>Enter the complete product title as it should appear</p>
          </div>
        </div>

        {/* Price Section */}
        <div className='addproduct-section'>
          <h3 className='section-title'>Pricing</h3>
          <div className='price-grid'>
            <div className='form-group'>
              <label className='form-label'>Original Price (₹) *</label>
              <div className='price-input-wrapper'>
                <span className='price-prefix'>₹</span>
                <input
                  type="number"
                  name='old_price'
                  placeholder='999'
                  value={productdetails.old_price}
                  onChange={changeHandler}
                  className='form-input price-input'
                  min="0"
                />
              </div>
              <p className='form-hint'>The actual price of the product</p>
            </div>

            <div className='form-group'>
              <label className='form-label'>Discounted Price (₹) *</label>
              <div className='price-input-wrapper'>
                <span className='price-prefix'>₹</span>
                <input
                  type="number"
                  name='new_price'
                  placeholder='799'
                  value={productdetails.new_price}
                  onChange={changeHandler}
                  className='form-input price-input'
                  min="0"
                />
              </div>
              <p className='form-hint'>The price after discount</p>
            </div>
          </div>
        </div>

        {/* Category Section */}
        <div className='addproduct-section'>
          <h3 className='section-title'>Categorization</h3>
          <div className='category-grid'>
            {/* Super Category */}
            <div className='form-group'>
              <label className='form-label'>Super Category *</label>
              <div className='select-wrapper'>
                <select
                  name="supercategory"
                  value={productdetails.supercategory}
                  onChange={changeHandler}
                  className='form-select'
                  disabled={loading.super}
                >
                  <option value="">Select super category</option>
                  {superCategories.map((sc) => (
                    <option key={sc._id} value={sc._id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
                <span className='select-arrow'>▼</span>
                {loading.super && <div className="loading-spinner-small"></div>}
              </div>
              {!productdetails.supercategory && superCategories.length === 0 && (
                <p className='form-error'>No super categories available. Please add super categories first.</p>
              )}
            </div>

            {/* Category */}
            <div className='form-group'>
              <label className='form-label'>Category *</label>
              <div className='select-wrapper'>
                <select
                  name="category"
                  value={productdetails.category}
                  onChange={changeHandler}
                  className='form-select'
                  disabled={!productdetails.supercategory || loading.category}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <span className='select-arrow'>▼</span>
                {loading.category && <div className="loading-spinner-small"></div>}
              </div>
              {productdetails.supercategory && categories.length === 0 && !loading.category && (
                <p className='form-error'>No categories available for this super category.</p>
              )}
            </div>

            {/* Sub Category */}
            <div className='form-group'>
              <label className='form-label'>Sub Category *</label>
              <div className='select-wrapper'>
                <select
                  name="subcategory"
                  value={productdetails.subcategory}
                  onChange={changeHandler}
                  className='form-select'
                  disabled={!productdetails.category || loading.sub}
                >
                  <option value="">Select sub category</option>
                  {subCategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <span className='select-arrow'>▼</span>
                {loading.sub && <div className="loading-spinner-small"></div>}
              </div>
              {productdetails.category && subCategories.length === 0 && !loading.sub && (
                <p className='form-error'>No sub categories available for this category.</p>
              )}
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className='addproduct-section'>
          <h3 className='section-title'>Product Image *</h3>
          <div className='image-upload-container'>
            <label htmlFor="file-input" className='image-upload-label'>
              <div className='upload-area'>
                <div className='upload-icon'>
                  <img
                    src={
                      uploadedImageUrl
                        ? uploadedImageUrl
                        : image
                          ? URL.createObjectURL(image)
                          : upload_area
                    }
                    alt={image ? "Product preview" : "Upload icon"}
                    className={image ? 'upload-preview' : 'upload-default'}
                  />
                </div>
                <div className='upload-text'>
                  <p className='upload-title'>
                    {image ? image.name : 'Click to upload product image'}
                  </p>
                  <p className='upload-subtitle'>
                    {image ? 'Click to change image' : 'Supports JPG, PNG up to 5MB'}
                  </p>
                </div>
              </div>
              <input
                type="file"
                onChange={imageHandler}
                id="file-input"
                hidden
                accept="image/*"
              />
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className='form-actions'>
          <button
            className={`addproduct-btn ${isUploading ? 'loading' : ''}`}
            onClick={addproduct}
            disabled={isUploading || !productdetails.supercategory}
          >
            {isUploading ? (
              <>
                <span className='spinner'></span>
                Adding Product...
              </>
            ) : (
              'Add Product'
            )}
          </button>
          <p className='form-note'>* Required fields must be filled</p>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;