import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { isAuthenticated } from '../actions/auth';
import { Card, Avatar, Button, Tooltip, message } from 'antd';
import { getUser, editUser } from '../actions/admin';

const { Meta } = Card;

const EditUser = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
  });

  const { name, username, email, phone } = values;

  const { user, token } = isAuthenticated();

  const loadUser = async () => {
    let data = await getUser(match.params.userId);
    console.log(data);
    //populate state
    setValues({
      ...values,
      name: data.data.name,
      username: data.data.username,
      email: data.data.email,
      phone: data.data.phone,
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleChange = (name) => (event) => {
    const value = name === 'photo' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let userData = new FormData();
    userData.append('name', name);
    userData.append('username', username);
    userData.append('email', email);
    userData.append('phone', phone);
    userData.append('adminAuth', user.role);

    try {
      const res = await editUser(match.params.userId, userData, token);
      console.log(res);
      window.location.reload();
      message.success('Profile updated successfully', 4);
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

  const editUserForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group mb-4 col-md-8 mx-auto'>
        <label className='form-label'>Your name</label>
        <input
          type='text'
          className='form-control shadow-none rounded-0'
          placeholder='Enter name'
          value={name}
          onChange={handleChange('name')}
        />
      </div>
      <div className='form-group mb-4 col-md-8 mx-auto'>
        <label className='form-label'>Your username</label>
        <input
          type='text'
          className='form-control shadow-none rounded-0'
          placeholder='Enter username'
          value={username}
          onChange={handleChange('username')}
        />
      </div>
      <div className='form-group mb-4 col-md-8 mx-auto'>
        <label className='form-label'>Email address</label>
        <input
          type='email'
          className='form-control shadow-none rounded-0'
          placeholder='Enter email'
          value={email}
          onChange={handleChange('email')}
        />
      </div>
      <div className='form-group mb-4 col-md-8 mx-auto'>
        <label className='form-label'>Phone number</label>
        <input
          type='tel'
          className='form-control shadow-none rounded-0'
          placeholder='Enter phone number'
          value={phone}
          onChange={handleChange('phone')}
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
          Edit User
        </Button>
      </div>
    </form>
  );

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
                  to='/admin/users'
                  className='text-decoration-none text-dark1'
                >
                  <Tooltip title='Back to Manage Users'>
                    <span className='category-span'>
                      <i class='fas fa-arrow-circle-left'></i>
                    </span>
                  </Tooltip>
                </Link>
                <i class='fas fa-user-edit'></i> Edit User
              </h2>
            </div>
            <div className='card-body'>{editUserForm()}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUser;
