import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

const Default = () => {
  return (
    <div>
      <Result
        status='404'
        title='404'
        subTitle='Sorry, the page you visited does not exist.'
        extra={
          <Button type='primary'>
            <Link to='/' className='text-decoration-none'>
              Back Home
            </Link>
          </Button>
        }
      />
    </div>
  );
};

export default Default;
