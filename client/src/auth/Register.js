import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
// import axios from 'axios';
import { toast } from 'react-toastify';
import { message } from 'antd';
import { register } from '../actions/auth';

const Register = ({ history }) => {
  const [values, setValues] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const { name, username, email, phone, password } = values;

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register({
        name: name,
        username: username,
        email: email,
        phone: phone,
        password: password,
      });
      console.log(res);
      message.success('Regitration successful. Please login', 4);
      history.push('/login');
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
            <RegisterForm
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              name={name}
              username={username}
              email={email}
              phone={phone}
              password={password}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
