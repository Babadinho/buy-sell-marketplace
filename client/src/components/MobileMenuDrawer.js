import { Button, Drawer } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MobileMenuDrawer = ({ categories }) => {
  const [categoryVisible, setCategoryVisible] = useState(false);

  const handleCategory = () => {
    setCategoryVisible(true);
  };

  const handleCategoryClose = () => {
    setCategoryVisible(false);
  };

  return (
    <>
      <Button
        className='rounded-0'
        size='large'
        type='primary'
        onClick={handleCategory}
        style={{
          marginBottom: '16px',
          width: '90%',
          backgroundColor: '#33b27b',
          borderColor: '#33b27b',
        }}
      >
        <i class='fas fa-list-alt me-1'></i> View Categories
      </Button>
      <Drawer
        title='Categories'
        placement={'left'}
        // closable={false}
        onClose={handleCategoryClose}
        visible={categoryVisible}
      >
        {categories.map((c, i) => {
          return (
            <Link
              key={i}
              to={`/category/${c._id}`}
              className='text-decoration-none'
            >
              <li className='list-group-item side-menu rounded-0 list-group-item-action d-flex justify-content-between align-items-center'>
                <div className='flex-column text-dark1'>
                  {c.name}
                  <p className='mb-1 text-small text-muted'>
                    <small>Products: {c.productCount}</small>
                  </p>
                </div>
                <div className='side-arrow text-muted'>
                  <i className='fas fa-chevron-right fa-sm'></i>
                </div>
              </li>
            </Link>
          );
        })}
      </Drawer>
    </>
  );
};

export default MobileMenuDrawer;
