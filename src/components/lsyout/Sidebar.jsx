import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Ana Sayfa', icon: '🏠' },
    { path: '/stok-yonetimi', label: 'Stok Yönetimi', icon: '📦' },
    { path: '/uretim', label: 'Üretim', icon: '��' },
    { path: '/uretim-agaci', label: 'Ürün Ağacı', icon: '🌳' },
    { path: '/test-api', label: 'Test API', icon: '🧪' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Stok Takip</h3>
      </div>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Item key={item.path}>
            <Nav.Link 
              as={Link} 
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
