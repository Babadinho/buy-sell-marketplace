import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../actions/auth';
import { message, Button, Tooltip } from 'antd';
import { addProduct } from '../actions/product';
import { allLocations, allCategories } from '../actions/admin';
import { useHistory, Link } from 'react-router-dom';

const AddProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    category: '',
    location: '',
    description: '',
    condition: '',
    price: '',
  });
  const [images, setImages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  const { token } = isAuthenticated();
  const { name, category, location, description, condition, price } = values;

  useEffect(() => {
    loadCategories();
    loadLocations();
  }, []);

  const loadCategories = async () => {
    let res = await allCategories();
    setCategories(res.data);
  };
  const loadLocations = async () => {
    let res = await allLocations();
    setLocations(res.data);
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
  };
  const handleImageChange = (e) => {
    //get multiple images & convert to base64 fro cloudinary
    if (e.target.files) {
      Array.from(e.target.files).forEach((file) => {
        URL.createObjectURL(file);
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          var base64data = reader.result;
          setImages((prevImages) => prevImages.concat(base64data));
          // console.log(base64data);
          Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
        };
      });
    }
  };

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let productData = new FormData();
    productData.append('name', name);
    productData.append('category', category);
    productData.append('location', location);
    productData.append('description', description);
    productData.append('condition', condition);
    productData.append('price', price);
    for (let i = 0; i < images.length; i++) {
      images && productData.append('images', images[i]);
    }

    console.log(productData);

    try {
      const res = await addProduct(match.params.userId, productData, token);
      console.log(res);
      message.success('Product added successfully', 4);
      history.push('/user/pending-products');
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };

  const addProductForm = () => (
    <div className='card rounded-0 pb-5 card-shadow'>
      <div className='card-header p-4'>
        <h2 className='text-center'>
          <Link
            to='/user/dashboard'
            className='text-decoration-none text-dark1'
          >
            <Tooltip title='Back to Dashboard'>
              <span className='category-span'>
                <i class='fas fa-arrow-circle-left'></i>
              </span>
            </Tooltip>
          </Link>
          <i class='fas fa-user-edit'></i> Post a Product
        </h2>
      </div>
      <div className='card-body'>
        <form onSubmit={handleSubmit}>
          <div className='form-group mb-4 col-md-8 mx-auto'>
            <label className='form-label'>Product Name*</label>
            <input
              type='text'
              className='form-control shadow-none rounded-0'
              placeholder='Enter product name'
              value={name}
              onChange={handleChange('name')}
            />
          </div>
          <div className='mx-auto col-md-8'>
            <h6>Upload Images*</h6>
            <div className='form-group mb-3 d-flex'>
              <div>
                <label
                  className='btn btn-secondary rounded-circle p-0'
                  style={{ fontSize: '30px' }}
                >
                  <div>
                    <i class='fas fa-plus fa-1x p-4'></i>
                  </div>
                  <input
                    onChange={handleImageChange}
                    type='file'
                    name='images'
                    accept='image/*'
                    multiple
                    hidden
                  />
                </label>
              </div>
              {images && images.length > 0 && (
                <div>
                  {images.map((image, i) => {
                    return (
                      <img
                        key={i}
                        src={image}
                        alt='preview_image'
                        className='img img-fluid m-2'
                        style={{ height: '75px', width: '75px' }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className='form-group mb-4 col-md-8 mx-auto'>
            <h6>Category*</h6>
            <select
              class='form-select shadow-none rounded-0'
              aria-label='Default select example'
              onChange={handleChange('category')}
              value={category}
            >
              <option>Select category</option>
              {categories.map((c, i) => {
                return (
                  <option key={i} value={c._id}>
                    {c.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='form-group mb-4 col-md-8 mx-auto'>
            <h6>Location*</h6>
            <select
              class='form-select shadow-none rounded-0'
              aria-label='Default select example'
              onChange={handleChange('location')}
              value={location}
            >
              <option>Select location</option>
              {locations.map((l, i) => {
                return (
                  <option key={i} value={l._id}>
                    {l.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='form-group mb-4 col-md-8 mx-auto'>
            <label className='form-label'>Description*</label>
            <textarea
              type='text'
              className='form-control shadow-none rounded-0'
              placeholder='Enter detailed description of product'
              value={description}
              onChange={handleChange('description')}
              style={{ height: '100px' }}
            />
          </div>
          <div className='form-group mb-4 col-md-8 mx-auto'>
            <h6>Condition</h6>
            <select
              class='form-select shadow-none rounded-0'
              aria-label='Default select example'
              onChange={handleChange('condition')}
              value={condition}
            >
              <option value=''>Select condition</option>
              <option key={1} value=''>
                Not applicable
              </option>
              <option key={2}>New</option>
              <option key={3}>Used</option>
            </select>
          </div>
          <div className='form-group mb-4 col-md-8 mx-auto'>
            <label className='form-label'>Price*</label>
            <div className='input-group'>
              <span
                class='input-group-text shadow-none rounded-0'
                id='basic-addon1'
              >
                ₦
              </span>
              <input
                type='number'
                className='form-control shadow-none rounded-0'
                placeholder='Enter price'
                value={price}
                onChange={handleChange('price')}
              />
            </div>
          </div>

          <div className='mx-auto col-md-8'>
            <Button
              type='primary'
              size='large'
              shape='round'
              className='rounded-0'
              htmlType='submit'
            >
              Post Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <div className='container-fluid profile-settings-container mt-5'>
        <div className='row'>
          <div className='col-md-8 mx-auto mb-5'>{addProductForm()}</div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
