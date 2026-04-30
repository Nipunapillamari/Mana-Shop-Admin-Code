import React, { useEffect, useState } from 'react';
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";
import config from "../../config"


const ListProduct = () => {
  const [allproduct, setallproduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    image: '',
    keywords: [],
    supercategory: '',
    category: '',
    subcategory: '',
    new_price: '',
    old_price: '',
    filters: {}
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchinfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/allproducts`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setallproduct(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchinfo();
  }, []);

  const removeproduct = async (id) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      try {
        await fetch(`${API}/removeproduct`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id })
        });
        await fetchinfo();
      } catch (error) {
        console.error("Error removing product:", error);
        alert('Failed to remove product');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      image: product.image,
      keywords: product.keywords || [],
      supercategory: product.supercategory,
      category: product.category,
      subcategory: product.subcategory,
      new_price: product.new_price,
      old_price: product.old_price,
      filters: product.filters || {}
    });
    setShowEditModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('product', file);

    setUploadingImage(true);
    try {
      const response = await fetch(`${API}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setEditFormData({ ...editFormData, image: data.image_url });
        alert('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API}/updateproduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingProduct.id,
          ...editFormData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Product updated successfully!');
        setShowEditModal(false);
        fetchinfo();
      } else {
        alert('Failed to update product: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleKeywordsChange = (e) => {
    const keywordsArray = e.target.value.split(',').map(kw => kw.trim());
    setEditFormData({ ...editFormData, keywords: keywordsArray });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className='list-product-container'>
      <header className='list-product-header'>
        <div className='header-content'>
          <h1>Product Management</h1>
          <p>Manage your products inventory and details</p>
        </div>
        <div className='header-stats'>
          <div className='stat-item'>
            <span className='stat-number'>{allproduct.length}</span>
            <span className='stat-label'>Total Products</span>
          </div>
        </div>
      </header>

      <div className='products-section'>
        <div className='section-header'>
          <h2>All Products</h2>
          <div className='header-actions'>
            <button className='btn-refresh' onClick={fetchinfo}>
              <span className='refresh-icon'>⟳</span> Refresh
            </button>
          </div>
        </div>

        <div className='table-container'>
          {loading ? (
            <div className='loading-state'>
              <div className='loading-spinner'></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className='error-state'>
              <div className='error-icon'>⚠️</div>
              <p>{error}</p>
              <button className='btn-retry' onClick={fetchinfo}>Retry</button>
            </div>
          ) : allproduct.length === 0 ? (
            <div className='empty-state'>
              <div className='empty-icon'>📦</div>
              <p>No products found</p>
              <p className='empty-hint'>Add new products to see them listed here</p>
            </div>
          ) : (
            <div className='table-responsive-wrapper'>
              <table className='products-table'>
                <thead>
                  <tr>
                    <th className='product-cell'>Product</th>
                    <th className='title-cell'>Title</th>
                    <th className='price-cell'>Old Price</th>
                    <th className='price-cell'>New Price</th>
                    <th className='category-cell'>Category</th>
                    <th className='actions-cell'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allproduct.map((product, index) => (
                    <tr key={index} className='product-row'>
                      <td className='product-cell'>
                        <div className='product-image-container'>
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className='product-image'
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x80/FFFFFF/E6E6E6?text=Product';
                            }}
                          />
                        </div>
                      </td>
                      <td className='title-cell'>
                        <div className='product-title'>
                          <span className='title-text'>{product.name}</span>
                          {product.id && (
                            <span className='product-id'>ID: {product.id}</span>
                          )}
                        </div>
                      </td>
                      <td className='price-cell'>
                        <span className='old-price'>{formatPrice(product.old_price)}</span>
                      </td>
                      <td className='price-cell'>
                        <span className='new-price'>{formatPrice(product.new_price)}</span>
                        {product.old_price > product.new_price && (
                          <span className='discount-badge'>
                            -{Math.round(((product.old_price - product.new_price) / product.old_price) * 100)}%
                          </span>
                        )}
                      </td>
                      <td className='category-cell'>
                        <span className='category-badge'>{product.category}</span>
                      </td>
                      <td className='actions-cell'>
                        <div className='action-buttons'>
                          <button 
                            className='btn-edit'
                            onClick={() => handleEditClick(product)}
                            title="Edit product"
                          >
                            ✏️
                            <span className='edit-text'>Edit</span>
                          </button>
                          <button 
                            className='btn-remove'
                            onClick={() => removeproduct(product.id)}
                            title="Remove product"
                          >
                            <img src={cross_icon} alt="Remove" className='remove-icon' />
                            <span className='remove-text'>Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!loading && !error && allproduct.length > 0 && (
          <div className='table-footer'>
            <div className='footer-summary'>
              Showing <span className='highlight'>{allproduct.length}</span> products
            </div>
            <div className='price-summary'>
              <div className='summary-item'>
                <span className='summary-label'>Avg. Price:</span>
                <span className='summary-value'>
                  {formatPrice(allproduct.reduce((sum, p) => sum + p.new_price, 0) / allproduct.length)}
                </span>
              </div>
              <div className='summary-item'>
                <span className='summary-label'>Total Value:</span>
                <span className='summary-value'>
                  {formatPrice(allproduct.reduce((sum, p) => sum + p.new_price, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className='modal-overlay' onClick={() => setShowEditModal(false)}>
          <div className='edit-modal' onClick={(e) => e.stopPropagation()}>
            <div className='modal-header'>
              <h2>Edit Product</h2>
              <button className='modal-close' onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className='edit-form'>
              <div className='form-group'>
                <label>Product Image</label>
                <div className='image-upload-section'>
                  <img 
                    src={editFormData.image || 'https://via.placeholder.com/100x100/FFFFFF/E6E6E6?text=Product'} 
                    alt="Product preview"
                    className='edit-product-image'
                  />
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <span>Uploading...</span>}
                </div>
              </div>

              <div className='form-group'>
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label>Old Price *</label>
                  <input
                    type="number"
                    name="old_price"
                    value={editFormData.old_price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>New Price *</label>
                  <input
                    type="number"
                    name="new_price"
                    value={editFormData.new_price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className='form-group'>
                <label>Keywords (comma-separated)</label>
                <input
                  type="text"
                  name="keywords"
                  value={editFormData.keywords.join(', ')}
                  onChange={handleKeywordsChange}
                  placeholder="e.g., cotton, summer, casual"
                />
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label>Super Category *</label>
                  <input
                    type="text"
                    name="supercategory"
                    value={editFormData.supercategory}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={editFormData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Sub Category *</label>
                  <input
                    type="text"
                    name="subcategory"
                    value={editFormData.subcategory}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className='form-group'>
                <label>Filters (JSON format)</label>
                <textarea
                  name="filters"
                  value={JSON.stringify(editFormData.filters, null, 2)}
                  onChange={(e) => {
                    try {
                      const filtersObj = JSON.parse(e.target.value);
                      setEditFormData({ ...editFormData, filters: filtersObj });
                    } catch (err) {
                      // Invalid JSON, don't update
                    }
                  }}
                  rows="4"
                  placeholder='{"color": "red", "size": "M"}'
                />
              </div>

              <div className='modal-actions'>
                <button type="button" className='btn-cancel' onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className='btn-save'>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListProduct;