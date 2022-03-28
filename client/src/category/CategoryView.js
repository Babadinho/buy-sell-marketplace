import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import {
  allLocations,
  addFavourite,
  removeFavourite,
} from '../actions/product';
import { viewUser } from '../actions/user';
import { isAuthenticated } from '../actions/auth';
import moment from 'moment';
import { getFilteredProducts } from '../actions/product';
import { prices } from '../components/PriceRange';
import {
  Pagination,
  Empty,
  Tooltip,
  Button,
  Drawer,
  Radio,
  Space,
  message,
} from 'antd';

const CategoryView = ({ match }) => {
  const countPerPage = 10;
  const [products, setProducts] = useState([]);
  const [current, setCurrent] = useState();
  const [pagination, setPagination] = useState();
  const [favourites, setFavourites] = useState([]);
  const [favourite, setFavourite] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationVisible, setLocationVisible] = useState(false);
  const [filter, setFilter] = useState({
    condition: '',
    price: [],
    category: match.params.categoryId,
    location: '',
  });
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [locationName, setLocationName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [sortBy, setSortBy] = useState('-1');
  const minId = document.querySelector('.min');
  const maxId = document.querySelector('.max');

  const { user, token } = isAuthenticated();

  const { condition, price, location } = filter;

  const loadUser = async () => {
    if (user && token) {
      const res = await viewUser(user._id);
      setFavourites(res.data.favourites);
    }
  };

  const loadLocations = async () => {
    const res = await allLocations();
    setLocations(res.data);
  };

  const loadFilteredResults = async (page) => {
    const res = await getFilteredProducts(filter, sortBy);
    setCurrent(page);
    const to = page * countPerPage;
    const from = to - countPerPage;
    setPagination(res.data.slice(from, to));
    setProducts(res.data);
    if (res.data.length > 0) {
      setCategoryName(res.data[0].category.name);
    }
  };

  useEffect(() => {
    loadUser();
    loadLocations();
    loadFilteredResults(1);
  }, [price, condition, sortBy, location, favourite]);

  // check for Active products, if none display Empty
  let checkActive = products.some(function (product) {
    return product.status === 'active';
  });

  const handleSorted = (e) => {
    setSortBy(e.target.value);
  };

  const handleCondition = (e) => {
    setFilter({ ...filter, condition: e.target.value });
  };

  const handlePriceRange = (e) => {
    setFilter({ ...filter, price: e.target.value });
    setMin('');
    setMax('');
  };

  const handleAddFavourite = async (productId) => {
    const res = await addFavourite(productId, { user, token });
    console.log(res.data);
    message.success('Added to Favourites');
    setFavourite(!favourite);
  };
  const handleRemoveFavourite = async (productId) => {
    const res = await removeFavourite(productId, { user, token });
    console.log(res.data);
    message.error('Removed to Favourites');
    setFavourite(!favourite);
  };

  //format currency
  Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  };

  const handleLocation = () => {
    setLocationVisible(true);
  };
  const handleLocationFilter = (id, name) => {
    setFilter({ ...filter, location: id });
    setLocationVisible(false);
    setLocationName(name);
  };
  const handleLocationCLose = () => {
    setLocationVisible(false);
  };

  const handleMin = (e) => {
    setMin(e.target.value);
    minId.style.border = '1px solid #ced4da';
  };
  const handleMax = (e) => {
    setMax(e.target.value);
    maxId.style.border = '1px solid #ced4da';
  };
  const handleSubmitPrice = () => {
    if (!min && !max) {
      minId.style.border = '1px solid red';
      maxId.style.border = '1px solid red';
      return;
    }
    if (!min) {
      minId.style.border = '1px solid red';
      maxId.style.border = '1px solid #ced4da';
      return;
    }
    if (!max) {
      maxId.style.border = '1px solid red';
      minId.style.border = '1px solid #ced4da';
      return;
    }
    const newArray = [];
    newArray[0] = parseInt(min);
    newArray[1] = parseInt(max);

    setFilter({ ...filter, price: newArray });
  };

  const locationDrawer = () => {
    return (
      <>
        <Drawer
          title='Locations'
          placement={'left'}
          // closable={false}
          onClose={handleLocationCLose}
          visible={locationVisible}
          width={300}
        >
          <li
            className='list-group-item side-menu rounded-0 list-group-item-action d-flex justify-content-between align-items-center'
            onClick={() => handleLocationFilter('')}
            role='button'
          >
            <div className='flex-column text-dark1 pb-2'>All Locations</div>
            <div className='side-arrow text-muted'>
              <i className='fas fa-chevron-right fa-sm'></i>
            </div>
          </li>
          {locations.map((l, i) => {
            return (
              <li
                className='list-group-item side-menu rounded-0 list-group-item-action d-flex justify-content-between align-items-center'
                key={i}
                onClick={() => handleLocationFilter(l._id, l.name)}
                role='button'
              >
                <div className='flex-column text-dark1 pb-2'>
                  {l.name} State
                </div>
                <div className='side-arrow text-muted'>
                  <i className='fas fa-chevron-right fa-sm'></i>
                </div>
              </li>
            );
          })}
        </Drawer>
      </>
    );
  };

  return (
    <>
      <div className='row container-fluid mx-auto mt-3 mb-5 profile-container'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to='/' className='text-decoration-none'>
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{categoryName}</Breadcrumb.Item>
        </Breadcrumb>
        <div className='col-md-3 mb-2'>
          <div className='card rounded-0 profile-card card-shadow category-sidebar'>
            <div className='card-header p-3'>
              <div className='d-flex align-items-center'>
                <div className='flex-fill'>
                  <Button
                    className='form-control rounded-0'
                    // type='primary'
                    size='large'
                    onClick={handleLocation}
                    style={{
                      marginBottom: 16,
                      color: '#1890ff',
                      backgroundColor: '#fafafa',
                      borderColor: '#1890ff',
                    }}
                  >
                    <i class='fas fa-map-marked-alt me-1'></i>{' '}
                    {location === '' && <span>Select Location</span>}
                    {location !== '' && <span>{locationName} State</span>}
                  </Button>
                  {locationDrawer()}
                </div>
              </div>
              <strong>
                <p className='text-dark1'>Condition</p>
              </strong>
              <Radio.Group onChange={handleCondition} value={condition}>
                <Space direction='vertical'>
                  <Radio value={''}>Any</Radio>
                  <Radio value={'New'}>New</Radio>
                  <Radio value={'Used'}>Used</Radio>
                </Space>
              </Radio.Group>
              <hr />
              <strong>
                <p className='text-dark1'>Price range</p>
              </strong>
              <div className='mb-2'>
                <Radio.Group onChange={handlePriceRange} value={price}>
                  <Space direction='vertical'>
                    {prices.map((p, i) => {
                      return (
                        <Radio key={i} value={p.array}>
                          {p.name}
                        </Radio>
                      );
                    })}
                  </Space>
                </Radio.Group>
              </div>
              <span>Custom price:</span>
              <div className='form-group d-flex justify-content-center align-items-center'>
                <div class='input-group input-group-sm me-2'>
                  <span class='input-group-text' id='inputGroup-sizing-sm'>
                    ₦
                  </span>
                  <input
                    type='number'
                    class='form-control rounded-0 shadow-none min'
                    id='min'
                    value={min}
                    onChange={handleMin}
                  />
                </div>
                <div>to</div>
                <div class='input-group input-group-sm ms-2'>
                  <span class='input-group-text' id='inputGroup-sizing-sm'>
                    ₦
                  </span>
                  <input
                    type='number'
                    class='form-control rounded-0 shadow-none max'
                    id='max'
                    value={max}
                    onChange={handleMax}
                  />
                </div>
                <div>
                  <button
                    onClick={handleSubmitPrice}
                    className='btn btn-primary btn-sm rounded-0 shadow-none ms-1'
                  >
                    GO
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-9'>
          <div className='card rounded-0 profile-card card-shadow'>
            <div className='card-header'>
              <div className='row category-header'>
                <div className='col-md-8 pt-2'>
                  {products.length > 0 && (
                    <h2
                      className='category-header-title'
                      style={{ fontSize: '1.7rem' }}
                    >
                      {location === '' && (
                        <span>{products[0].category.name} in Nigeria</span>
                      )}
                      {location !== '' && (
                        <span>
                          {products[0].category.name} in {locationName} State
                        </span>
                      )}
                    </h2>
                  )}
                  {products.length < 1 && (
                    <h2
                      className='category-header-title'
                      style={{ fontSize: '1.7rem' }}
                    >
                      No products yet
                    </h2>
                  )}
                </div>
                <div className='col-md-4 category-header-sort'>
                  <span>
                    <p className='pe-1'>Sort By: </p>
                  </span>
                  <select
                    className='form-select form-select-sm shadow-none'
                    style={{ width: '60%' }}
                    onChange={handleSorted}
                  >
                    <option value='-1'>Newest</option>
                    <option value='1'>Oldest</option>
                  </select>
                </div>
              </div>
            </div>
            {!checkActive && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            {checkActive && (
              <div className='card-body desktop-product-view'>
                {pagination.map((p, i) => {
                  if (p.status === 'active') {
                    return (
                      <div
                        class='card rounded-0 mb-3 product-card'
                        key={i}
                        // style={{ height: '180px' }}
                      >
                        <div class='row g-0'>
                          <div class='col-md-3 product-img embed-responsive embed-responsive-16by9'>
                            <Link
                              to={`/product/${p._id}`}
                              className='text-decoration-none'
                            >
                              <img
                                src={p.images[0]}
                                className='img-fluid rounded-start img-horizontal'
                                alt={p.name}
                                style={{ height: '100%' }}
                              />
                              <span className='product-img-count'>
                                <span className='badge badge-pill opacity'>
                                  {p.images.length}
                                  <i class='fas fa-images ps-1'></i>
                                </span>
                              </span>
                            </Link>
                            {user && token && favourites.includes(p._id) && (
                              <Tooltip title='Remove from Favourites'>
                                <span
                                  className='product-fav d-flex align-items-center justify-content-center'
                                  onClick={() => handleRemoveFavourite(p._id)}
                                  role='button'
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(0, 0, 0, 0.125)',
                                  }}
                                >
                                  <i class='fas fa-star'></i>
                                </span>
                              </Tooltip>
                            )}
                            {user && token && !favourites.includes(p._id) && (
                              <Tooltip title='Add to Favourites'>
                                <span
                                  className='product-fav d-flex align-items-center justify-content-center'
                                  onClick={() => handleAddFavourite(p._id)}
                                  role='button'
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(0, 0, 0, 0.125)',
                                  }}
                                >
                                  <i class='far fa-star fa-star-text'></i>
                                </span>
                              </Tooltip>
                            )}
                          </div>
                          <div class='col-md-9'>
                            <div class='card-body pt-3 pb-2'>
                              <div className='d-flex justify-content-between'>
                                <Link
                                  to={`/product/${p._id}`}
                                  className='text-decoration-none'
                                >
                                  <h6 class='card-title card-title-cat-desk text-dark1'>
                                    {p.name}
                                  </h6>
                                </Link>
                                <span>
                                  <h6 className='text-success'>
                                    ₦{parseInt(p.price).format()}
                                  </h6>
                                </span>
                              </div>
                              <small>
                                <p class='card-text text-muted'>
                                  {p.description.substring(0, 85)}..
                                </p>
                              </small>
                              <div className='d-flex justify-content-between mt-4 mb-5'>
                                <div>
                                  <span>
                                    <Link
                                      to={`/category/${p.category._id}`}
                                      className='badge badge-pill text-muted me-2 text-decoration-none'
                                      style={{
                                        backgroundColor: '#eef2f4',
                                        color: '#303a4b',
                                        // fontSize: '14px',
                                      }}
                                    >
                                      {p.category.name}
                                    </Link>
                                  </span>
                                  <span>
                                    <div
                                      className='badge badge-pill text-muted'
                                      style={{
                                        backgroundColor: '#eef2f4',
                                        color: '#303a4b',
                                      }}
                                    >
                                      {p.condition}
                                    </div>
                                  </span>
                                </div>

                                <span>
                                  <small class='text-muted'>
                                    Seller:{' '}
                                    <Link
                                      to={`/user/${p.author._id}`}
                                      className='text-decoration-none text-dark1'
                                    >
                                      {p.author.name}
                                    </Link>
                                  </small>
                                </span>
                              </div>
                              <div class='card-text d-flex justify-content-between'>
                                <Link
                                  to={`/search-result?&location=${p.location._id}&category=&name=&price=&condition=`}
                                  className='text-decoration-none'
                                >
                                  <p
                                    className='text-muted align-self-end'
                                    style={{ fontSize: '14px' }}
                                  >
                                    <i class='fas fa-map-marker-alt me-2'></i>
                                    {p.location.name}
                                  </p>
                                </Link>
                                <small class='text-muted'>
                                  Posted {moment(p.createdAt).fromNow()}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
                <Pagination
                  pageSize={countPerPage}
                  onChange={loadFilteredResults}
                  defaultCurrent={current}
                  total={products.length}
                />
              </div>
            )}

            {checkActive && (
              <div className='card-body mobile-product'>
                {pagination.map((p, i) => {
                  if (p.status === 'active') {
                    return (
                      <div
                        className='card card-shadow rounded-0 mb-3 mobile-product-view d-flex flex-row'
                        style={{ height: '12.43rem' }}
                      >
                        <div className='product-img-mobile'>
                          <div className='product-img-mobile'>
                            <Link
                              to={`/product/${p._id}`}
                              className='text-decoration-none'
                            >
                              <img
                                src={p.images[0]}
                                className='card-img-top img-top-category'
                                alt={p.name}
                                style={{
                                  borderBottom: '1px solid rgba(0,0,0,.125)',
                                }}
                              />
                              <span className='product-img-count'>
                                <span className='badge badge-pill opacity'>
                                  {p.images.length}
                                  <i class='fas fa-images ps-1'></i>
                                </span>
                              </span>
                            </Link>
                          </div>
                          {user && token && favourites.includes(p._id) && (
                            <Tooltip title='Remove from Favourites'>
                              <span
                                className='product-fav d-flex align-items-center justify-content-center'
                                onClick={() => handleRemoveFavourite(p._id)}
                                role='button'
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  border: '1px solid rgba(0, 0, 0, 0.125)',
                                }}
                              >
                                <i class='fas fa-star'></i>
                              </span>
                            </Tooltip>
                          )}
                          {user && token && !favourites.includes(p._id) && (
                            <Tooltip title='Add to Favourites'>
                              <span
                                className='product-fav d-flex align-items-center justify-content-center'
                                onClick={() => handleAddFavourite(p._id)}
                                role='button'
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  border: '1px solid rgba(0, 0, 0, 0.125)',
                                }}
                              >
                                <i class='far fa-star fa-star-text'></i>
                              </span>
                            </Tooltip>
                          )}
                        </div>
                        <div class='card-body pt-3 pb-2'>
                          <div>
                            <Link
                              to={`/product/${p._id}`}
                              className='text-decoration-none'
                            >
                              <h6 class='card-title card-title-cat text-dark1'>
                                {p.name.length > 40
                                  ? p.name.substring(0, 40) + '..'
                                  : p.name}
                              </h6>
                            </Link>
                            <span>
                              <h6 className='text-success'>
                                ₦{parseInt(p.price).format()}
                              </h6>
                            </span>
                          </div>
                          {/* <small>
                            <p class='card-text mobile-card-desc text-muted'>
                              {p.description.substring(0, 30)}..
                            </p>
                          </small> */}
                          <div className='mt-2 mb-2'>
                            <div>
                              <span>
                                <Link
                                  to={`/category/${p.category._id}`}
                                  className='badge badge-pill text-muted me-2 text-decoration-none'
                                  style={{
                                    backgroundColor: '#eef2f4',
                                    color: '#303a4b',
                                  }}
                                >
                                  {p.category.name}
                                </Link>
                              </span>
                              <span>
                                <div
                                  className='badge badge-pill text-muted'
                                  style={{
                                    backgroundColor: '#eef2f4',
                                    color: '#303a4b',
                                  }}
                                >
                                  {p.condition}
                                </div>
                              </span>
                            </div>
                          </div>
                          <div className='mb-3'>
                            <small class='text-muted'>
                              Seller:{' '}
                              <Link
                                to={`/user/${p.author._id}`}
                                className='text-decoration-none text-dark1'
                              >
                                {p.author.username}
                              </Link>
                            </small>
                          </div>
                          <div class='card-text d-flex justify-content-between align-items-center mt-1'>
                            <div>
                              <Link
                                to={`/search-result?&location=${p.location._id}&category=&name=&price=&condition=`}
                                className='text-decoration-none mt-auto'
                              >
                                <p
                                  className='text-muted'
                                  style={{ fontSize: '0.85rem' }}
                                >
                                  <i class='fas fa-map-marker-alt me-2'></i>
                                  {p.location.name}
                                </p>
                              </Link>
                            </div>
                            <small
                              class='text-muted'
                              style={{ fontSize: '0.85rem' }}
                            >
                              {moment(p.createdAt).fromNow()}
                            </small>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
                <Pagination
                  pageSize={countPerPage}
                  onChange={loadFilteredResults}
                  defaultCurrent={current}
                  total={products.length}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryView;
