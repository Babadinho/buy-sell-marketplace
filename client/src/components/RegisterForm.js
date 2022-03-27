import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const RegisterForm = ({
  handleSubmit,
  handleChange,
  name,
  username,
  email,
  phone,
  password,
}) => {
  const [toggle, setToggle] = useState(false);
  const handleToggle = (e) => {
    if (toggle === false) {
      setToggle(true);
    } else if (toggle === true) {
      setToggle(false);
    }
  };
  return (
    <div className='card rounded-0 mb-5 pb-5 card-shadow'>
      <div className='card-header p-4'>
        <h2 className='text-center'>
          <i class='fas fa-user-plus'></i> Register an account
        </h2>
      </div>
      <div className='card-body'>
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
          <div className='form-group mb-4 col-md-8 mx-auto'>
            <label className='form-label'>Password</label>
            <input
              type={toggle ? 'text' : 'password'}
              className='form-control shadow-none rounded-0'
              placeholder='Enter passoword'
              value={password}
              onChange={handleChange('password')}
            />
            {toggle ? (
              <i class='fas fa-eye togglePassword' onClick={handleToggle}></i>
            ) : (
              <i
                class='fas fa-eye-slash togglePassword'
                onClick={handleToggle}
              ></i>
            )}
          </div>
          <div className='mx-auto col-md-8'>
            <Button
              type='primary'
              size='large'
              shape='round'
              className='rounded-0'
              htmlType='submit'
            >
              Register
            </Button>
            <span className='float-end'>
              {' '}
              Already have an account?{' '}
              <Link to='/login' className='text-decoration-none'>
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
