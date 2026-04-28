import React from 'react';
import './Dashboard.css';
import { 
  FaBox, FaTags, FaList, FaLayerGroup, 
  FaChartBar, FaPlusCircle, FaThList, 
  FaArrowRight, FaShoppingCart, FaDatabase,
  FaChevronRight, FaRegClock, FaUsers
} from 'react-icons/fa';

const Dashboard = () => {
  // Stats data
  const statsData = [
    { 
      id: 1, 
      title: "Products", 
      value: "2,847", 
      icon: <FaBox />, 
      color: "#3b82f6", 
      change: "+12.5%", 
      period: "from last month",
      bgColor: "rgba(59, 130, 246, 0.1)"
    },
    { 
      id: 2, 
      title: "Categories", 
      value: "24", 
      icon: <FaTags />, 
      color: "#10b981", 
      change: "+5.2%", 
      period: "from last month",
      bgColor: "rgba(16, 185, 129, 0.1)"
    },
    { 
      id: 3, 
      title: "Subcategories", 
      value: "156", 
      icon: <FaList />, 
      color: "#8b5cf6", 
      change: "+8.7%", 
      period: "from last month",
      bgColor: "rgba(139, 92, 246, 0.1)"
    },
    { 
      id: 4, 
      title: "Super Categories", 
      value: "8", 
      icon: <FaLayerGroup />, 
      color: "#f59e0b", 
      change: "+3.1%", 
      period: "from last quarter",
      bgColor: "rgba(245, 158, 11, 0.1)"
    }
  ];
  
  // Quick actions
  const actionCards = [
    { 
      id: 1, 
      title: "Super Categories", 
      description: "Manage all super categories",
      icon: <FaLayerGroup />, 
      color: "#3b82f6",
      count: 8,
      link: "/supercategory"
    },
    { 
      id: 2, 
      title: "Categories", 
      description: "View and edit categories",
      icon: <FaTags />, 
      color: "#10b981",
      count: 24,
      link: "/categories"
    },
    { 
      id: 3, 
      title: "Subcategories", 
      description: "Organize subcategories",
      icon: <FaList />, 
      color: "#8b5cf6",
      count: 156,
      link: "/subcategories"
    },
    { 
      id: 4, 
      title: "Add Product", 
      description: "Create new product entry",
      icon: <FaPlusCircle />, 
      color: "#f59e0b",
      link: "/products/add"
    },
    { 
      id: 5, 
      title: "Product List", 
      description: "Browse all products",
      icon: <FaThList />, 
      color: "#ef4444",
      count: "2,847",
      link: "/products"
    },
    { 
      id: 6, 
      title: "Analytics", 
      description: "View performance metrics",
      icon: <FaChartBar />, 
      color: "#06b6d4",
      link: "/analytics"
    }
  ];

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, here's what's happening with your inventory.</p>
        </div>
        <div className="header-actions">
          <span className="last-updated">
            <FaRegClock /> Updated just now
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statsData.map(stat => (
          <div className="stat-card" key={stat.id}>
            <div className="stat-header">
              <div 
                className="stat-icon-wrapper"
                style={{ backgroundColor: stat.bgColor, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div className="stat-change positive">
                {stat.change}
              </div>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-title">{stat.title}</p>
              <span className="stat-period">{stat.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <div className="section-header">
          <div className="section-header-content">
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-subtitle">Frequently used operations</p>
          </div>
        </div>
        <div className="actions-grid">
          {actionCards.map(card => (
            <div 
              className="action-card" 
              key={card.id}
              onClick={() => console.log(`Navigating to ${card.link}`)}
            >
              <div className="action-card-header">
                <div 
                  className="action-icon"
                  style={{ backgroundColor: card.color }}
                >
                  {card.icon}
                </div>
                {card.count && (
                  <span className="action-count">{card.count}</span>
                )}
              </div>
              <div className="action-card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <div className="action-card-footer">
                <span className="action-link">
                  Go to <FaChevronRight className="link-arrow" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="section-header">
          <div className="section-header-content">
            <h2 className="section-title">Recent Activity</h2>
            <p className="section-subtitle">Latest inventory updates</p>
          </div>
        </div>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">
              <FaPlusCircle />
            </div>
            <div className="activity-content">
              <p><strong>New product added</strong> - Wireless Headphones</p>
              <span className="activity-time">10 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon warning">
              <FaTags />
            </div>
            <div className="activity-content">
              <p><strong>Category updated</strong> - Electronics</p>
              <span className="activity-time">45 minutes ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon info">
              <FaUsers />
            </div>
            <div className="activity-content">
              <p><strong>Team member access</strong> - Sarah joined inventory team</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;