import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const LoginForm = ({ email, password, handleChange, handleSubmit }) => {
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
          <i class='fas fa-sign-in-alt'></i> Login to your account
        </h2>
      </div>
      <div className='card-body'>
        <form onSubmit={handleSubmit}>
          <div className='form-group mb-4 col-md-8 mx-auto'>
            <label className='form-label'>Email address</label>
            <input
              onChange={handleChange('email')}
              type='email'
              className='form-control shadow-none rounded-0'
              placeholder='Enter email'
              value={email}
            />
          </div>
          <div className='form-group mb-4 col-md-8 mx-auto'>
            <label className='form-label'>Password</label>
            <input
              onChange={handleChange('password')}
              type={toggle ? 'text' : 'password'}
              className='form-control shadow-none rounded-0 password'
              placeholder='Enter passoword'
              value={password}
              id='password'
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
              Login
            </Button>
            <span className='float-end'>
              {' '}
              Don't have an account?{' '}
              <Link to='/register' className='text-decoration-none'>
                Register
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
