import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { isAuthenticated } from '../actions/auth';
import { Card, Avatar, Button, Tooltip, message } from 'antd';
import { getCategory, editCategory } from '../actions/admin';

const { Meta } = Card;

const EditCategory = ({ match }) => {
  const [name, setName] = useState('');

  const { user, token } = isAuthenticated();

  const loadCategory = async () => {
    let data = await getCategory(match.params.categoryId);
    console.log(data.data);
    //populate state
    setName(data.data.name);
  };

  useEffect(() => {
    loadCategory();
  }, []);

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await editCategory(match.params.categoryId, {
        name,
        token,
      });
      console.log(res);
      message.success('Category edit successfull', 4);
      history.push('/admin/add-category');
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };

  const history = useHistory();

  const logout = () => {
    window.localStorage.removeItem('buynsell');
    history.push('/login');
    window.location.reload();
  };

  return (
    <>
      <div className='row container-fluid mx-auto mt-5 profile-container'>
        <div className='col-md-3 mb-5'>
          <Card
            className='card-shadow'
            style={{ width: 'auto' }}
            cover={
              <Avatar
                src={user.photo}
                className='mx-auto mt-3 avatar-user'
                size={130}
              >
                {user.name[0]}
              </Avatar>
            }
          >
            <div className='text-center'>
              <h5>({user.username})</h5>
            </div>
            <Meta
              title={user.name}
              description={user.phone}
              className='text-center user-details'
            />
          </Card>
          <ul className='list-group rounded-0 profile-list card-shadow'>
            <li className='list-group-item'>
              <Link
                to='/admin/dashboard'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-user-shield'></i> Admin Dashboard
              </Link>
            </li>
            <li className='list-group-item'>
              <Link
                to='/user/dashboard'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-user'></i> User Dashboard
              </Link>
            </li>
            <li className='list-group-item'>
              <Link
                to='/admin/add-category'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-plus-square'></i> Add Category
              </Link>
            </li>
            <li className='list-group-item'>
              <Link
                to='/admin/add-location'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-plus-circle'></i> Add Location
              </Link>
            </li>
            <li className='list-group-item'>
              <Link
                to='/admin/users'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-user-edit'></i> Manage Users
              </Link>
            </li>
            <li
              className='list-group-item text-dark1'
              role='button'
              onClick={logout}
            >
              <i class='fas fa-sign-out-alt'></i> Logout
            </li>
          </ul>
        </div>
        <div className='col-md-9 mb-5'>
          <div className='card rounded-0 mb-5 pb-5 card-shadow'>
            <div className='card-header p-4'>
              <h2 className='text-center'>
                <Link
                  to='/admin/add-category'
                  className='text-decoration-none text-dark1'
                >
                  <Tooltip title='Back to Add Category'>
                    <span className='category-span'>
                      <i class='fas fa-arrow-circle-left'></i>
                    </span>
                  </Tooltip>
                </Link>
                <i class='fas fa-plus-square'></i> Edit Category
              </h2>
            </div>
            <div className='card-body'>
              <form onSubmit={handleSubmit}>
                <div className='form-group mb-4 col-md-8 mx-auto'>
                  <label className='form-label'>Category Name</label>
                  <input
                    type='text'
                    className='form-control shadow-none rounded-0'
                    placeholder='Enter category name'
                    value={name}
                    onChange={handleChange}
                  />
                </div>
                <div className='mx-auto col-md-8'>
                  <Button
                    type='primary'
                    size='large'
                    shape='round'
                    className='rounded-0'
                    htmlType='submit'
                  >
                    Edit Category
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditCategory;
