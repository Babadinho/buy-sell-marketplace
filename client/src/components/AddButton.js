import React from 'react';
import { useHistory } from 'react-router';
import { isAuthenticated } from '../actions/auth';

const AddButton = () => {
  const { user } = isAuthenticated();
  const history = useHistory();

  const handleSell = () => {
    if (isAuthenticated()) {
      history.push(`/add-product/${user._id}`);
    } else {
      history.push('/login');
    }
  };
  return (
    <>
      <div onClick={handleSell} className='float-button' role='button'>
        <i class='fa fa-plus my-float'></i>
      </div>
    </>
  );
};

export default AddButton;
