import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import UserSideBar from '../components/UserSideBar';
import { isAuthenticated } from '../actions/auth';
import { viewUser, getUserProducts } from '../actions/user';
import { closeProduct } from '../actions/product';
import { Card, Empty, Pagination, message, Popconfirm } from 'antd';

const { Meta } = Card;

const UserDashboard = () => {
  const { user } = isAuthenticated();
  const countPerPage = 5;
  const [values, setValues] = useState({
    _id: '',
    followers: '',
    following: '',
    products: [],
    favourites: [],
  });
  const [activeProducts, setActiveProducts] = useState([]);
  const [current, setCurrent] = useState();
  const [closed, setClosed] = useState(false);
  const [pagination, setPagination] = useState([]);
  const [positiveRatings, setpositiveRatings] = useState([]);
  const [negativeRatings, setnegativeRatings] = useState([]);
  const [filter, setFilter] = useState('active');
  const positiveRating = [];
  const negativeRating = [];

  const { _id, products, followers, following, favourites } = values;

  const loadUser = async () => {
    let res = await viewUser(user._id);
    //get user ratings
    res.data.ratings.forEach((item) => {
      if (item.rating === 'positive') {
        positiveRating.push(item._id);
        setpositiveRatings(positiveRating);
      } else if (item.rating === 'negative') {
        negativeRating.push(item._id);
        setnegativeRatings(negativeRating);
      }
    });
    // console.log(res);
    setValues({
      _id: res.data._id,
      followers: res.data.followers,
      following: res.data.following,
      products: res.data.products,
      favourites: res.data.favourites,
    });
  };

  const loadUserProducts = async (page) => {
    let res = await getUserProducts(user._id, { filter: filter });
    setCurrent(page);
    const to = page * countPerPage;
    const from = to - countPerPage;
    setPagination(res.data.slice(from, to));
    setActiveProducts(res.data);
    console.log(res.data);
  };

  useEffect(() => {
    loadUser();
    loadUserProducts(1);
  }, [filter, closed]);

  const handleClose = async (productId) => {
    try {
      const res = await closeProduct(productId);
      message.success('Product closed', 4);
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
    setClosed(true);
  };

  // get Pending product count
  const pendingCount = products.filter(
    (product) => product.status === 'pending'
  );
  // get Active product count
  const activeCount = products.filter((product) => product.status === 'active');
  // get Closed product count
  const closedCount = products.filter((product) => product.status === 'closed');

  //format currency
  Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  };

  return (
    <>
      <div className='row container-fluid mx-auto mt-5 profile-container'>
        <UserSideBar
          _id={_id}
          products={products}
          followers={followers}
          following={following}
          favourites={favourites}
          positiveRatings={positiveRatings}
          negativeRatings={negativeRatings}
        />
        <div className='col-md-9 mb-5'>
          <div className='card rounded-0 profile-card card-shadow'>
            <div className='d-flex justify-content-between card-header profile-card p-3'>
              {filter === 'active' && <h2>Active Products</h2>}
              {filter === 'pending' && <h2>Pending Products</h2>}
              {filter === 'closed' && <h2>Closed Products</h2>}
              <ul className='nav nav-pills justify-content-end'>
                <li
                  className={`nav-item nav-active-hover ${
                    filter === 'active' && 'nav-active'
                  }`}
                >
                  <a
                    onClick={() => setFilter('active')}
                    className={`nav-link nav-tab nav-tab-item nav-active nav-margin ${
                      filter === 'active' && 'active'
                    }`}
                  >
                    <small>
                      <i class='fas fa-check-circle'></i> Active (
                      {activeCount.length})
                    </small>
                  </a>
                </li>
                <li
                  className={`nav-item nav-pending-hover ${
                    filter === 'pending' && 'nav-pending'
                  }`}
                >
                  <a
                    onClick={() => setFilter('pending')}
                    className={`nav-link nav-tab nav-pending nav-tab-item nav-margin ${
                      filter === 'pending' && 'active'
                    }`}
                  >
                    <small>
                      {' '}
                      <i class='fas fa-clock'></i> Pending (
                      {pendingCount.length})
                    </small>
                  </a>
                </li>
                <li
                  className={`nav-item nav-closed-hover ${
                    filter === 'closed' && 'nav-closed'
                  }`}
                >
                  <a
                    onClick={() => setFilter('closed')}
                    className={`nav-link nav-tab nav-closed nav-tab-item nav-margin ${
                      filter === 'closed' && 'active'
                    }`}
                  >
                    <small>
                      <i class='fas fa-times-circle'></i> Closed (
                      {closedCount.length})
                    </small>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              {activeProducts.length === 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
              {activeProducts.length > 0 && (
                <div className='card-body desktop-product-view'>
                  {pagination.map((p, i) => {
                    return (
                      <div class='card rounded-0 mb-3 product-card' key={i}>
                        <div class='row g-0'>
                          <div class='col-md-3 product-img'>
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
                          </div>
                          <div class='col-md-9'>
                            <div class='card-body pt-3 pb-2'>
                              <div className='d-flex justify-content-between'>
                                <Link
                                  to={`/product/${p._id}`}
                                  className='text-decoration-none'
                                >
                                  <h6 class='card-title text-dark1'>
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
                                  {p.description.substring(0, 110)}..
                                </p>
                              </small>
                              <div className='d-flex justify-content-between mt-4 product-cat-text'>
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

                                <div>
                                  {user._id === _id && (
                                    <>
                                      <span className=''>
                                        <Link
                                          to={`/edit-product/${p._id}`}
                                          class='btn btn-primary btn-sm text-white pt-0 pb-0 shadow-none'
                                        >
                                          Edit
                                        </Link>
                                      </span>
                                      {p.status !== 'closed' && (
                                        <Popconfirm
                                          placement='top'
                                          title={'Are you sure to close?'}
                                          onConfirm={() => handleClose(p._id)}
                                          okText='Yes'
                                          cancelText='No'
                                        >
                                          <span className='ps-2'>
                                            <button class='btn btn-danger btn-sm text-white pt-0 pb-0 shadow-none'>
                                              Close
                                            </button>
                                          </span>
                                        </Popconfirm>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              <span class='card-text d-flex justify-content-between'>
                                <Link
                                  to={`/search-result?location=${p.location._id}&category=&name=&price=&condition=`}
                                  className='text-decoration-none'
                                >
                                  <p
                                    className='text-muted'
                                    style={{ fontSize: '14px' }}
                                  >
                                    <i class='fas fa-map-marker-alt me-2'></i>
                                    {p.location.name}
                                  </p>
                                </Link>
                                <small class='text-muted'>
                                  {moment(p.createdAt).fromNow()}
                                  {/* by{' '}
                                  <Link
                                    to={`/user/${p.author._id}`}
                                    className='text-decoration-none text-dark1'
                                  >
                                    {p.author.name}
                                  </Link> */}
                                </small>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Pagination
                    pageSize={countPerPage}
                    onChange={loadUserProducts}
                    defaultCurrent={current}
                    total={activeProducts.length}
                  />
                </div>
              )}

              {activeProducts.length > 0 && (
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
                              {user._id === _id && (
                                <>
                                  <span className=''>
                                    <Link
                                      to={`/edit-product/${p._id}`}
                                      class='btn btn-primary btn-sm text-white pt-0 pb-0 shadow-none'
                                    >
                                      Edit
                                    </Link>
                                  </span>
                                  {p.status !== 'closed' && (
                                    <Popconfirm
                                      placement='top'
                                      title={'Are you sure to close?'}
                                      onConfirm={() => handleClose(p._id)}
                                      okText='Yes'
                                      cancelText='No'
                                    >
                                      <span className='ps-2'>
                                        <button class='btn btn-danger btn-sm text-white pt-0 pb-0 shadow-none'>
                                          Close
                                        </button>
                                      </span>
                                    </Popconfirm>
                                  )}
                                </>
                              )}
                            </div>
                            {/* <div className='mb-3'>
                              <small class='text-muted'>
                                By:{' '}
                                <Link
                                  to={`/user/${p.author._id}`}
                                  className='text-decoration-none text-dark1'
                                >
                                  {p.author.username}
                                </Link>
                              </small>
                            </div> */}
                            <div class='card-text d-flex justify-content-between align-items-center mt-1'>
                              <div>
                                <Link
                                  to={`/search-result?location=${p.location._id}&category=&name=&price=&condition=`}
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
                    onChange={loadUserProducts}
                    defaultCurrent={current}
                    total={activeProducts.length}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
