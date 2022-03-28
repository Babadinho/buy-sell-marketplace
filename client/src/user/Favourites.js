import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { isAuthenticated } from '../actions/auth';
import { removeFavourite } from '../actions/product';
import { userFavouriteProducts, viewUser } from '../actions/user';
import UserSideBar from '../components/UserSideBar';
import { useDispatch } from 'react-redux';
import { Empty, Pagination, Tooltip, message } from 'antd';

const Favourites = () => {
  const dispatch = useDispatch();
  const countPerPage = 5;
  const [values, setValues] = useState({
    followers: '',
    following: '',
  });
  const [favourite, setFavourite] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const [current, setCurrent] = useState();
  const [pagination, setPagination] = useState([]);
  const [positiveRatings, setpositiveRatings] = useState([]);
  const [negativeRatings, setnegativeRatings] = useState([]);
  const positiveRating = [];
  const negativeRating = [];

  const { followers, following } = values;

  const { user, token } = isAuthenticated();

  const loadFavouriteProducts = async (page) => {
    let res = await userFavouriteProducts(user._id);
    setCurrent(page);
    const to = page * countPerPage;
    const from = to - countPerPage;
    setPagination(res.data.slice(from, to));
    setFavourites(res.data);
  };

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
      followers: res.data.followers,
      following: res.data.following,
    });
  };

  useEffect(() => {
    loadUser();
    loadFavouriteProducts(1);
  }, [favourite]);

  const handleRemoveFavourite = async (productId) => {
    const res = await removeFavourite(productId, { user, token });
    dispatch({
      type: 'USER_DETAILS',
      payload: res.data,
    });
    message.error('Removed to Favourites');
    favourite ? setFavourite(false) : setFavourite(true);
  };

  //format currency
  Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  };

  return (
    <>
      <div className='row container-fluid mx-auto mt-5 profile-container'>
        <UserSideBar
          followers={followers}
          following={following}
          favourites={favourites}
          positiveRatings={positiveRatings}
          negativeRatings={negativeRatings}
        />
        <div className='col-md-9 mb-5'>
          <div className='card rounded-0 profile-card card-shadow'>
            <div className='d-flex justify-content-between card-header profile-card p-3'>
              <h2 className='text-center d-flex align-items-center'>
                <span>
                  <Link
                    to='/user/dashboard'
                    className='text-decoration-none text-dark1 pe-4'
                  >
                    <Tooltip title='Back to Dashboard'>
                      <span className='category-span'>
                        <i class='fas fa-arrow-circle-left p-0'></i>
                      </span>
                    </Tooltip>
                  </Link>
                </span>
                <span>Favourite Products</span>
              </h2>
            </div>
            {favourites.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {favourites.length > 0 && (
              <div className='card-body'>
                {pagination.map((p, i) => {
                  return (
                    <div
                      class='card rounded-0 mb-3 product-card desktop-product-view'
                      key={i}
                    >
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
                          {user && token && !favourites.includes(p._id) && (
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
                        </div>
                        <div class='col-md-9'>
                          <div class='card-body pt-3 pb-2'>
                            <div className='d-flex justify-content-between'>
                              <Link
                                to={`/product/${p._id}`}
                                className='text-decoration-none'
                              >
                                <h6 class='card-title text-dark1'>{p.name}</h6>
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
                                to={`/location/${p.location._id}`}
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
                                Posted {moment(p.createdAt).fromNow()}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Pagination
                  pageSize={countPerPage}
                  onChange={loadFavouriteProducts}
                  defaultCurrent={current}
                  total={favourites.length}
                />
              </div>
            )}

            {favourites.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {favourites.length > 0 && (
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
                          {user && token && !favourites.includes(p._id) && (
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
                  onChange={loadFavouriteProducts}
                  defaultCurrent={current}
                  total={favourites.length}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Favourites;
