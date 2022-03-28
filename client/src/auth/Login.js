import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import { login, authenticate } from '../actions/auth';
import { message } from 'antd';
import { useDispatch } from 'react-redux';

const Login = ({ history }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const { email, password } = values;

  const dispatch = useDispatch();

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        email: email,
        password: password,
      });
      if (data) {
        //Save user and token to LocalSTorage
        authenticate(data);
        //Save user and token to redux
        dispatch({
          type: 'LOGGED_IN_USER',
          payload: data.token,
        });
        history.push('user/dashboard');
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };

  return (
    <>
      <div className='container mt-5'>
        <div className='row'>
          <div className='col-md-10 col-lg-6 col-sm-11 mx-auto'>
            <LoginForm
              email={email}
              password={password}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
