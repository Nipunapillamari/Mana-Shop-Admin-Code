import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Category.css';
import config from "../../config"


const Category = () => {
  const [category, setCategory] = useState({
    name: '',
    superCategoryId: '',
    subCategory: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    displayOrder: ''
  });

  const [categories, setCategories] = useState([]);
  const [superCategories, setSuperCategories] = useState([]);

  /* TEMP subCategory data */
  const tempSubCategories = {
    Electronics: ['Smartphones', 'Laptops', 'Accessories'],
    Fashion: ['Men Clothing', 'Women Clothing'],
    Books: ['Fiction', 'Education'],
    Sports: ['Fitness', 'Outdoor']
  };

  /* ================= FETCH SUPER CATEGORIES ================= */
  useEffect(() => {
    fetchSuperCategories();
    fetchAllCategories(); // Fetch all categories on initial load
  }, []);

  const fetchSuperCategories = async () => {
    try {
      const res = await axios.get(`${API}/allsupercategories`);
      setSuperCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= FETCH ALL CATEGORIES ================= */
  const fetchAllCategories = async () => {
    try {
      // First, get all super categories
      const superRes = await axios.get(`${API}/allsupercategories`);
      const superCategoriesData = superRes.data;
      
      // Fetch categories for each super category
      const allCategories = [];
      
      for (const superCat of superCategoriesData) {
        try {
          const res = await axios.get(
            `${API}/categories/${superCat._id}`
          );
          
          const formattedCategories = res.data.map(cat => ({
            id: cat._id,
            name: cat.name,
            superCategory: superCat.name,
            superCategoryId: cat.superCategoryId,
            subCategory: 'Temporary',
            displayOrder: cat.displayOrder || 0,
            status: 'Active',
            metaTitle: cat.metaTitle || '',
            metaDescription: cat.metaDescription || '',
            metaKeywords: cat.metaKeywords || ''
          }));
          
          allCategories.push(...formattedCategories);
        } catch (err) {
          console.error(`Error fetching categories for super category ${superCat._id}:`, err);
        }
      }
      
      setCategories(allCategories);
    } catch (err) {
      console.error('Error fetching all categories:', err);
    }
  };

  /* ================= FETCH CATEGORIES BY SUPER CATEGORY ================= */
  const fetchCategories = async (superCategoryId) => {
    try {
      const res = await axios.get(
        `${API}/categories/${superCategoryId}`
      );

      const superCat = superCategories.find(s => s._id === superCategoryId);
      
      const formattedCategories = res.data.map(cat => ({
        id: cat._id,
        name: cat.name,
        superCategory: superCat ? superCat.name : "—",
        superCategoryId: cat.superCategoryId,
        subCategory: 'Temporary',
        displayOrder: cat.displayOrder || 0,
        status: 'Active',
        metaTitle: cat.metaTitle || '',
        metaDescription: cat.metaDescription || '',
        metaKeywords: cat.metaKeywords || ''
      }));
      
      setCategories(formattedCategories);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= INPUT CHANGE ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCategory(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'superCategoryId' && { subCategory: '' })
    }));

    // If super category changes, fetch its categories
    if (name === 'superCategoryId' && value && value !== 'all') {
      fetchCategories(value);
    } else if (name === 'superCategoryId' && value === 'all') {
      fetchAllCategories();
    }
  };

  /* ================= RESET ================= */
  const handleReset = () => {
    setCategory(prev => ({
      ...prev,
      name: '',
      superCategoryId: '',
      subCategory: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      displayOrder: ''
    }));
    
    // After reset, show all categories again
    fetchAllCategories();
  };

  /* ================= SAVE CATEGORY ================= */
  const handleSaveChanges = async () => {
    if (!category.name || !category.superCategoryId) {
      alert('Please fill required fields');
      return;
    }

    try {
      await axios.post(`${API}/addcategory`, {
        name: category.name,
        superCategoryId: category.superCategoryId,
        subCategory: true,
        displayOrder: category.displayOrder || 0,
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription,
        metaKeywords: category.metaKeywords
      });

      alert('Category added successfully');
      
      // After adding, refresh the category list
      if (category.superCategoryId && category.superCategoryId !== 'all') {
        fetchCategories(category.superCategoryId);
      } else {
        fetchAllCategories();
      }
      
      handleReset();
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id, superCategoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.post(`${API}/deletecategory`, { id });
      
      // Refresh the category list after deletion
      if (superCategoryId) {
        fetchCategories(superCategoryId);
      } else {
        // If we don't have superCategoryId for the deleted item, refetch all
        setCategories(prev => prev.filter(cat => cat.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAvailableSubCategories = () => {
    const sc = superCategories.find(s => s._id === category.superCategoryId);
    return sc ? tempSubCategories[sc.name] || [] : [];
  };

  return (
    <div className="category-container">
      <header className="category-header">
        <h1>Category Management</h1>
        <p>Create and manage your categories here</p>
      </header>

      {/* Upper Section */}
      <div className="upper-section">
        <div className="section-header">
          <div className="section-header-content">
            <h2>Add New Category</h2>
            <p>Fill in the details below to create a new category</p>
          </div>
        </div>

        <div className="form-grid">
          {/* Left */}
          <div className="form-left">
            <div className="form-group">
              <label>Category Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={category.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter category name"
              />
            </div>

            <div className="form-group">
              <label>Super Category <span className="required">*</span></label>
              <div className="select-wrapper">
                <select
                  name="superCategoryId"
                  value={category.superCategoryId}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select super category</option>
                  <option value="all">All Categories</option>
                  {superCategories.map(sc => (
                    <option key={sc._id} value={sc._id}>
                      {sc.name}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>

            <div className="form-group">
              <label>Sub Category <span className="required">*</span></label>
              <div className="select-wrapper">
                <select className="form-select" disabled>
                  <option>Temporary</option>
                  {getAvailableSubCategories().map((s, i) => (
                    <option key={i}>{s}</option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="form-right">
            <div className="form-group">
              <label>Display Order</label>
              <input
                type="number"
                name="displayOrder"
                value={category.displayOrder}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter display order"
              />
              <small className="hint">Lower numbers appear first</small>
            </div>

            <div className="form-group">
              <label>Meta Title <span className="required">*</span></label>
              <input
                type="text"
                name="metaTitle"
                value={category.metaTitle}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter meta title for SEO"
              />
            </div>
          </div>
        </div>

        <div className="form-full-width">
          <div className="form-group">
            <label>Meta Description <span className="required">*</span></label>
            <textarea
              name="metaDescription"
              value={category.metaDescription}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Enter meta description for SEO"
              rows="3"
            />
            <small className="hint">Describe this category for search engines (150-160 characters)</small>
          </div>

          <div className="form-group">
            <label>Meta Keywords</label>
            <input
              type="text"
              name="metaKeywords"
              value={category.metaKeywords}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter keywords separated by commas"
            />
            <small className="hint">Comma separated keywords for SEO</small>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-reset" onClick={handleReset}>
            <span className="icon">↻</span> Reset
          </button>
          <button className="btn-save" onClick={handleSaveChanges}>
            <span className="icon">✓</span> Save
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="table-header">
          <div className="table-header-content">
            <h3>Categories List</h3>
            <p>Manage existing categories</p>
          </div>
          <button 
            className="btn-refresh" 
            onClick={fetchAllCategories}
            title="Refresh categories list"
          >
            ↻ Refresh
          </button>
        </div>
        <div className="table-container">
          <div className="table-responsive-wrapper">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Super Category</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <tr key={cat.id}>
                      <td className="name-cell">
                        <div className="category-name">{cat.name}</div>
                      </td>
                      <td className="super-cat-cell">
                        <div className="super-category-name">{cat.superCategory}</div>
                      </td>
                      <td className="order-cell">
                        <div className="display-order">{cat.displayOrder}</div>
                      </td>
                      <td className="status-cell">
                        <span className="status-badge active">Active</span>
                       </td>
                      <td className="actions-cell">
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(cat.id, cat.superCategoryId)}
                        >
                          <span className="action-icon">🗑️</span> Delete
                        </button>
                       </td>
                     </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No categories found. Add a new category or select a super category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {categories.length > 0 && (
          <div className="table-footer">
            <div className="summary">
              Showing {categories.length} categories
            </div>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-dot active"></span>
                Active
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;