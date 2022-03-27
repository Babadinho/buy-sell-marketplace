import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../actions/auth';
import { message, Button, Tooltip, Popconfirm, Result } from 'antd';
import {
  singleProduct,
  updateProduct,
  deleteProductImage,
} from '../actions/product';
import { allLocations, allCategories } from '../actions/admin';
import { useHistory, Link } from 'react-router-dom';

const EditProduct = ({ match }) => {
  const [values, setValues] = useState({
    name: '',
    category: '',
    location: '',
    description: '',
    condition: '',
    price: '',
    author: '',
  });
  const [images, setImages] = useState([]);
  const [images2, setImages2] = useState([]);
  const [imageIds, setimageIds] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  const { user, token } = isAuthenticated();
  const { name, category, location, description, condition, price, author } =
    values;

  useEffect(() => {
    loadCategories();
    loadLocations();
    loadProduct();
  }, []);

  const loadCategories = async () => {
    let res = await allCategories();
    setCategories(res.data);
  };
  const loadLocations = async () => {
    let res = await allLocations();
    setLocations(res.data);
  };

  const loadProduct = async () => {
    const res = await singleProduct(match.params.productId);
    console.log(res);
    setValues({
      ...values,
      name: res.data.name,
      category: res.data.category._id,
      location: res.data.location._id,
      description: res.data.description,
      condition: res.data.condition,
      price: res.data.price,
      author: res.data.author._id,
    });
    setImages(res.data.images);
    setImages2(res.data.images);
    setimageIds(res.data.image_ids);
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
    productData.append('author', author);
    productData.append('userAuth', user._id);
    for (let i = 0; i < images.length; i++) {
      images && productData.append('images', images[i]);
    }
    console.log(productData);

    try {
      const res = await updateProduct(
        match.params.productId,
        productData,
        token
      );
      console.log(res);
      message.success('Product updated successfully', 4);
      user.role === 'admin'
        ? history.push('/admin/dashboard')
        : history.push('/user/pending-products');
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };

  const handleDelete = async (imageId, imageUrl) => {
    const imageIndex = images2.indexOf(imageUrl);

    try {
      if (imageIndex === -1) {
        const imageArray = images.filter((item) => item !== imageUrl);
        setImages(imageArray);
      } else {
        const res = await deleteProductImage(match.params.productId, {
          imageId,
          imageUrl,
          token,
        });
        console.log(res);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };

  const editProductForm = () => (
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
          <i class='fas fa-user-edit'></i> Edit Product
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
                <div className='d-flex flex-wrap'>
                  {images.map((image, i) => {
                    return (
                      <div className='position-relative' key={i}>
                        <img
                          src={image}
                          alt='preview_image'
                          className='img img-fluid m-2'
                          style={{ height: '75px', width: '75px' }}
                        />
                        <Popconfirm
                          placement='top'
                          title={'Delete image?'}
                          onConfirm={() => handleDelete(imageIds[i], image)}
                          okText='Yes'
                          cancelText='No'
                        >
                          <span className='position-absolute end-0'>
                            <i
                              class='fas fa-times-circle text-danger'
                              role='button'
                            ></i>
                          </span>
                        </Popconfirm>
                      </div>
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
              <option disabled value={category._id}>
                {category.name}
              </option>
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
              <option disabled value={location._id}>
                {location.name}
              </option>
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
              Edit Product
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
          {author !== user._id && (
            <Result
              status='403'
              title='403'
              subTitle='Sorry, you are not authorized to access this page.'
              extra={
                <Link to='/'>
                  <Button type='primary'>Back Home</Button>
                </Link>
              }
            />
          )}
          {author === user._id && (
            <div className='col-md-8 mx-auto mb-5'>{editProductForm()}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditProduct;
