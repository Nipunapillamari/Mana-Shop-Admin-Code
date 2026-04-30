import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SuperCat.css";
import API from "../../config"


const SuperCat = () => {
  // ---------------- FORM STATE ----------------
  const [superCategory, setSuperCategory] = useState({
    name: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  // ---------------- LIST STATE ----------------
  const [superCategories, setSuperCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH ON LOAD ----------------
  useEffect(() => {
    fetchSuperCategories();
  }, []);

  const fetchSuperCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API}/allsupercategories`
      );
      setSuperCategories(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch super categories");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FORM HANDLERS ----------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSuperCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setSuperCategory({
      name: "",
      metaTitle: "",
      metaDescription: "",
      metaKeywords: "",
    });
  };

  // ---------------- ADD SUPER CATEGORY ----------------
  const handleSaveChanges = async () => {
    if (
      !superCategory.name ||
      !superCategory.metaTitle ||
      !superCategory.metaDescription
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post(`${API}/addsupercategory`, {
        name: superCategory.name.trim(),
        metaTitle: superCategory.metaTitle.trim(),
        metaDescription: superCategory.metaDescription.trim(),
        metaKeywords: superCategory.metaKeywords.trim(),
      });

      alert("Super Category added successfully");
      handleReset();
      fetchSuperCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add super category");
    }
  };

  // ---------------- DELETE SUPER CATEGORY ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await axios.post(`${API}/deletesupercategory`, { id });
      fetchSuperCategories();
    } catch (error) {
      alert("Failed to delete super category");
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="super-cat-container">
      <header className="super-cat-header">
        <h1>Super Category Management</h1>
        <p>Create and manage your super categories here</p>
      </header>

      {/* ---------------- ADD FORM ---------------- */}
      <div className="upper-section">
        <div className="section-header">
          <div className="section-header-content">
            <h2>Add New Super Category</h2>
            <p>Fill in the details below to create a new super category</p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-left">
            <div className="form-group">
              <label>
                Super Category Name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={superCategory.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter super category name"
              />
            </div>

            <div className="form-group">
              <label>
                Meta Title <span className="required">*</span>
              </label>
              <input
                type="text"
                name="metaTitle"
                value={superCategory.metaTitle}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter meta title for SEO"
              />
              <small className="hint">This appears in browser tabs and search results</small>
            </div>
          </div>

          <div className="form-right">
            <div className="form-group">
              <label>
                Meta Description <span className="required">*</span>
              </label>
              <textarea
                name="metaDescription"
                rows="4"
                value={superCategory.metaDescription}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Enter meta description for SEO"
              />
              <small className="hint">Describe this category for search engines (150-160 characters)</small>
            </div>

            <div className="form-group">
              <label>Meta Keywords</label>
              <input
                type="text"
                name="metaKeywords"
                value={superCategory.metaKeywords}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter keywords separated by commas"
              />
              <small className="hint">Comma separated keywords for SEO</small>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-reset" onClick={handleReset}>
            <span className="icon">↻</span> Reset
          </button>
          <button className="btn-save" onClick={handleSaveChanges}>
            <span className="icon">✓</span> Save Changes
          </button>
        </div>
      </div>

      {/* ---------------- LIST TABLE ---------------- */}
      <div className="bottom-section">
        <div className="table-header">
          <div className="table-header-content">
            <h2>Super Categories List</h2>
            <p>Manage existing super categories</p>
          </div>
          <button 
            className="btn-refresh" 
            onClick={fetchSuperCategories}
            title="Refresh super categories list"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="table-container">
          <div className="table-responsive-wrapper">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Super Category Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="loading-cell">
                      <div className="loading-spinner"></div>
                      <span>Loading super categories...</span>
                    </td>
                  </tr>
                ) : superCategories.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="no-data">
                      <div className="no-data-icon">📂</div>
                      <div>No Super Categories Found</div>
                      <small>Add a new super category to get started</small>
                    </td>
                  </tr>
                ) : (
                  superCategories.map((category, index) => (
                    <tr key={category._id}>
                      <td className="id-cell">#{index + 1}</td>
                      <td className="name-cell">
                        <div className="category-name">{category.name}</div>
                        {category.metaTitle && (
                          <div className="category-meta">{category.metaTitle.substring(0, 50)}...</div>
                        )}
                      </td>
                      <td className="status-cell">
                        <span className="status-badge active">Active</span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(category._id)}
                        >
                          <span className="action-icon">🗑️</span> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {superCategories.length > 0 && (
          <div className="table-footer">
            <div className="summary">
              Showing {superCategories.length} super categories
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

export default SuperCat;