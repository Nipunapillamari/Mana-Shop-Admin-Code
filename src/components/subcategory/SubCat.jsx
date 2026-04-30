import React, { useState, useEffect } from 'react';
import axios from "axios";
import './SubCat.css';
import config from "../../config"


const SubCat = () => {
  const [subCategory, setSubCategory] = useState({
    name: '',
    superCategoryId: '',
    categoryId: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });

  const [subCategories, setSubCategories] = useState([]);
  const [superCategories, setSuperCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH SUPER CATEGORIES ================= */
  useEffect(() => {
    fetchSuperCategories();
    fetchAllSubCategories();
  }, []);

  const fetchSuperCategories = async () => {
    try {
      const res = await axios.get(`${API}/allsupercategories`);
      setSuperCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH ALL SUB CATEGORIES ================= */
  const fetchAllSubCategories = async () => {
    setLoading(true);
    try {
      // Since we don't have an endpoint to get all subcategories at once,
      // we need to get them via super categories and categories
      let allSubCategories = [];
      
      // Get all super categories first
      const superRes = await axios.get(`${API}/allsupercategories`);
      const superCats = superRes.data;
      
      // For each super category, get its categories
      for (const superCat of superCats) {
        try {
          const categoriesRes = await axios.get(`${API}/categories/${superCat._id}`);
          const cats = categoriesRes.data;
          
          // For each category, get its subcategories
          for (const cat of cats) {
            try {
              const subRes = await axios.get(`${API}/subcategories/${cat._id}`);
              const subs = subRes.data.map(sub => ({
                id: sub._id,
                name: sub.name,
                superCategory: superCat.name,
                categoryId: sub.categoryId,
                status: sub.status ? 'Active' : 'Inactive',
                metaTitle: sub.metaTitle,
                metaDescription: sub.metaDescription,
                metaKeywords: sub.metaKeywords
              }));
              allSubCategories.push(...subs);
            } catch (err) {
              console.error(`Error fetching subcategories for category ${cat._id}:`, err);
            }
          }
        } catch (err) {
          console.error(`Error fetching categories for super category ${superCat._id}:`, err);
        }
      }
      
      setSubCategories(allSubCategories);
    } catch (err) {
      console.error("Error fetching all subcategories:", err);
      // Fallback to showing categories as subcategories
      fetchCategoriesAsSubCategories();
    } finally {
      setLoading(false);
    }
  };

  /* ================= FALLBACK: FETCH CATEGORIES AS SUB CATEGORIES ================= */
  const fetchCategoriesAsSubCategories = async () => {
    try {
      // Get all super categories
      const superRes = await axios.get(`${API}/allsupercategories`);
      const superCats = superRes.data;
      
      let allCategories = [];
      
      // Get categories for each super category
      for (const superCat of superCats) {
        try {
          const categoriesRes = await axios.get(`${API}/categories/${superCat._id}`);
          const cats = categoriesRes.data.map(cat => ({
            id: cat._id,
            name: cat.name,
            superCategory: superCat.name,
            categoryId: cat._id,
            status: 'Active',
            metaTitle: cat.metaTitle,
            metaDescription: cat.metaDescription,
            metaKeywords: cat.metaKeywords
          }));
          allCategories.push(...cats);
        } catch (err) {
          console.error(`Error fetching categories for super category ${superCat._id}:`, err);
        }
      }
      
      setSubCategories(allCategories);
    } catch (err) {
      console.error("Error fetching categories as fallback:", err);
    }
  };

  /* ================= FETCH CATEGORIES BASED ON SUPER CATEGORY ================= */
  useEffect(() => {
    if (subCategory.superCategoryId) {
      fetchCategoriesBySuperCategory();
    } else {
      setCategories([]);
      setSubCategory(prev => ({ ...prev, categoryId: '' }));
    }
  }, [subCategory.superCategoryId]);

  const fetchCategoriesBySuperCategory = async () => {
    try {
      const res = await axios.get(`${API}/categories/${subCategory.superCategoryId}`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= INPUT CHANGE HANDLER ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* ================= RESET FORM ================= */
  const handleReset = () => {
    setSubCategory({
      name: '',
      superCategoryId: '',
      categoryId: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: ''
    });
  };

  /* ================= SAVE SUB CATEGORY ================= */
  const handleSaveChanges = async () => {
    if (!subCategory.name.trim()) {
      alert('Please enter Sub Category Name');
      return;
    }
    if (!subCategory.superCategoryId) {
      alert('Please select a Super Category');
      return;
    }
    if (!subCategory.categoryId) {
      alert('Please select a Category');
      return;
    }

    try {
      const subCategoryData = {
        name: subCategory.name,
        superCategoryId: subCategory.superCategoryId,
        categoryId: subCategory.categoryId,
        metaTitle: subCategory.metaTitle || subCategory.name,
        metaDescription: subCategory.metaDescription || `Shop best ${subCategory.name} products`,
        metaKeywords: subCategory.metaKeywords || `${subCategory.name}, products, shopping`
      };

      await axios.post(`${API}/addsubcategory`, subCategoryData);
      
      alert('Sub Category added successfully!');
      
      // Refresh the subcategories list
      fetchAllSubCategories();
      
      // Reset form
      handleReset();
    } catch (error) {
      console.error('Error adding sub category:', error);
      alert(error.response?.data?.message || 'Error adding sub category');
    }
  };

  /* ================= DELETE SUB CATEGORY ================= */
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sub category?')) {
      try {
        await axios.post(`${API}/deletesubcategory`, { id });
        setSubCategories(prev => prev.filter(cat => cat.id !== id));
        alert('Sub Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting sub category:', error);
        alert(error.response?.data?.message || 'Error deleting sub category');
      }
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id) => {
    // Note: You need to add an endpoint for updating subcategory status
    // For now, we'll just toggle locally
    setSubCategories(prev => prev.map(cat => 
      cat.id === id 
        ? { 
            ...cat, 
            status: cat.status === 'Active' ? 'Inactive' : 'Active',
            statusBoolean: !(cat.status === 'Active')
          }
        : cat
    ));
  };

  return (
    <div className="sub-cat-container">
      <header className="sub-cat-header">
        <h1>Sub Category Management</h1>
        <p>Create and manage your sub categories here</p>
      </header>

      {/* Upper Section - Add Sub Category */}
      <div className="upper-section">
        <div className="section-header">
          <h2>Add New Sub Category</h2>
          <p>Fill in the details below to create a new sub category</p>
        </div>

        <div className="form-grid">
          {/* Left Column */}
          <div className="form-left">
            <div className="form-group">
              <label htmlFor="name">
                Sub Category Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={subCategory.name}
                onChange={handleInputChange}
                placeholder="Enter sub category name"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="superCategoryId">
                Super Category <span className="required">*</span>
              </label>
              <select
                id="superCategoryId"
                name="superCategoryId"
                value={subCategory.superCategoryId}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select super category</option>
                {superCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="categoryId">
                Category <span className="required">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={subCategory.categoryId}
                onChange={handleInputChange}
                className="form-select"
                disabled={!subCategory.superCategoryId}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="form-right">
            <div className="form-group">
              <label htmlFor="metaTitle">
                Meta Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={subCategory.metaTitle}
                onChange={handleInputChange}
                placeholder="Enter meta title for SEO"
                className="form-input"
              />
              <small className="hint">This appears in browser tabs and search results</small>
            </div>

            <div className="form-group">
              <label htmlFor="metaDescription">
                Meta Description <span className="required">*</span>
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                value={subCategory.metaDescription}
                onChange={handleInputChange}
                placeholder="Enter meta description for SEO"
                rows="4"
                className="form-textarea"
              />
              <small className="hint">Describe this category for search engines (150-160 characters)</small>
            </div>

            <div className="form-group">
              <label htmlFor="metaKeywords">
                Meta Keywords
              </label>
              <input
                type="text"
                id="metaKeywords"
                name="metaKeywords"
                value={subCategory.metaKeywords}
                onChange={handleInputChange}
                placeholder="Enter keywords separated by commas"
                className="form-input"
              />
              <small className="hint">Comma separated keywords for SEO</small>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            type="button" 
            className="btn-reset"
            onClick={handleReset}
          >
            <span className="icon">↻</span> Reset Form
          </button>
          <button 
            type="button" 
            className="btn-save"
            onClick={handleSaveChanges}
          >
            <span className="icon">✓</span> Save Changes
          </button>
        </div>
      </div>

      {/* Bottom Section - List Sub Categories */}
      <div className="bottom-section">
        <div className="section-header">
          <div className="section-header-content">
            <h2>Sub Categories List</h2>
            <p>Manage existing sub categories</p>
          </div>
          <button 
            className="btn-refresh" 
            onClick={fetchAllSubCategories}
            title="Refresh sub categories list"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="table-container">
          {loading ? (
            <div className="loading-indicator">
              Loading sub categories...
            </div>
          ) : (
            <div className="table-responsive-wrapper">
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sub Category Name</th>
                    <th>Super Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subCategories.length > 0 ? (
                    subCategories.map((category, index) => (
                      <tr key={category.id}>
                        <td className="id-cell">#{index + 1}</td>
                        <td className="name-cell">
                          <div className="category-name">{category.name}</div>
                        </td>
                        <td className="super-cat-cell">
                          <div className="super-category-name">{category.superCategory}</div>
                        </td>
                        <td className="status-cell">
                          <span 
                            className={`status-badge ${category.status.toLowerCase()}`}
                            onClick={() => toggleStatus(category.id)}
                          >
                            {category.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button 
                            className="btn-action btn-delete"
                            onClick={() => handleDelete(category.id)}
                          >
                            <span className="action-icon">🗑️</span> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No sub categories found. Add a new sub category to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="table-footer">
          <div className="summary">
            Showing {subCategories.length} sub categories
          </div>
          <div className="legend">
            <div className="legend-item">
              <span className="legend-dot active"></span>
              Active
            </div>
            <div className="legend-item">
              <span className="legend-dot inactive"></span>
              Inactive
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCat;