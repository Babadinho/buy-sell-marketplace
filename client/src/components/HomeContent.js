import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip, message } from 'antd';
import { allProducts, addFavourite, removeFavourite } from '../actions/product';
import { isAuthenticated } from '../actions/auth';
import MobileMenuDrawer from './MobileMenuDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@nextui-org/react';

const HomeContent = ({ categories }) => {
  const favourites = useSelector((state) => state.buynsellUser.favourites);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [favourite, setFavourite] = useState(false);
  const { user, token } = isAuthenticated();

  useEffect(() => {
    loadProducts();
  }, [favourite]);

  const loadProducts = async () => {
    const res = await allProducts();
    setProducts(res.data);
  };

  const handleAddFavourite = async (productId) => {
    const res = await addFavourite(productId, { user, token });
    dispatch({
      type: 'USER_DETAILS',
      payload: res.data,
    });
    message.success('Added to Favourites');
    setFavourite(!favourite);
  };
  const handleRemoveFavourite = async (productId) => {
    const res = await removeFavourite(productId, { user, token });
    dispatch({
      type: 'USER_DETAILS',
      payload: res.data,
    });
    message.error('Removed to Favourites');
    setFavourite(!favourite);
  };

  //format currency
  Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  };

  return (
    <div className='container-fluid mb-5'>
      <div className='col-md-10 mx-auto desktop-side-menu mt-5'>
        <div className='row'>
          <div className='col-md-3'>
            <ul className='list-group card-shadow'>
              {categories.map((c, i) => {
                return (
                  <Link
                    key={i}
                    to={`/category/${c._id}`}
                    className='text-decoration-none'
                  >
                    <li className='list-group-item side-menu rounded-0 list-group-item-action d-flex justify-content-between align-items-center'>
                      <div className='flex-column text-dark1'>
                        {c.name}
                        <p className='mb-1 text-muted'>
                          <small>Products: {c.productCount}</small>
                        </p>
                      </div>
                      <div className='side-arrow text-muted'>
                        <i className='fas fa-chevron-right fa-sm'></i>
                      </div>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className='col-md-9'>
            <div className='row home-row'>
              <div className='d-flex justify-content-between'>
                <h3 className='text-dark1 pb-3'>
                  <i class='fab fa-hotjar'></i> Trending Products
                </h3>
              </div>
              {products.map((p, i) => {
                if (p.status === 'active') {
                  return (
                    <div className='col-md-4 d-flex' key={i}>
                      <div
                        className='card card-shadow mb-4'
                        style={{ width: '21rem' }}
                      >
                        <div className='product-img1'>
                          <Link
                            to={`/product/${p._id}`}
                            className='text-decoration-none'
                          >
                            <img
                              src={p.images[0]}
                              className='card-img-top img-top-desktop'
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
                          {user &&
                            token &&
                            favourites &&
                            favourites.includes(p._id) && (
                              <Tooltip title='Remove from Favourites'>
                                <span
                                  className='product-fav d-flex align-items-center justify-content-center'
                                  onClick={() => handleRemoveFavourite(p._id)}
                                  role='button'
                                  style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(0, 0, 0, 0.125)',
                                  }}
                                >
                                  <i class='fas fa-star'></i>
                                </span>
                              </Tooltip>
                            )}
                          {user &&
                            token &&
                            favourites &&
                            !favourites.includes(p._id) && (
                              <Tooltip title='Add to Favourites'>
                                <span
                                  className='product-fav d-flex align-items-center justify-content-center'
                                  onClick={() => handleAddFavourite(p._id)}
                                  role='button'
                                  style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    border: '1px solid rgba(0, 0, 0, 0.125)',
                                  }}
                                >
                                  <i class='far fa-star fa-star-text'></i>
                                </span>
                              </Tooltip>
                            )}
                        </div>
                        <div className='card-body pb-0'>
                          <div className='d-flex justify-content-between flex-wrap'>
                            <Tooltip title={p.name}>
                              <Link
                                to={`/product/${p._id}`}
                                className='text-decoration-none'
                              >
                                <p class='card-title text-dark1 card-text-title'>
                                  {p.name}
                                </p>
                              </Link>
                            </Tooltip>
                            <span>
                              <p className='text-success'>
                                ₦{parseInt(p.price).format()}
                              </p>
                            </span>
                          </div>
                          <span class='card-text d-flex justify-content-between mt-2'>
                            <Link
                              to={`/search-result?$location=${p.location._id}&category=&name=&price=&condition=`}
                              className='text-decoration-none'
                            >
                              <small class='text-muted'>
                                <p className='text-muted'>
                                  <i class='fas fa-map-marker-alt me-2'></i>
                                  {p.location.name}
                                </p>
                              </small>
                            </Link>
                            <small class='text-muted'>
                              Seller:{' '}
                              <Link
                                to={`/user/${p.author._id}`}
                                className='text-decoration-none text-dark1'
                              >
                                {p.author.username}
                              </Link>
                            </small>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </div>

      <div class='mobile-home-content mt-4'>
        <h3 className='text-dark1 pb-3 text-center'>
          <i class='fab fa-hotjar'></i> Trending Products
        </h3>
        <div className='d-flex justify-content-center'>
          <MobileMenuDrawer categories={categories} />
        </div>
        <Grid.Container gap={2} justify='center'>
          {products.map((p, i) => {
            if (p.status === 'active') {
              return (
                <Grid xs={6} md={4} key={i} justify='center'>
                  <div
                    className='card card-shadow rounded-0 mb-3'
                    style={{ width: '100%' }}
                  >
                    <div className='product-img'>
                      <Link
                        to={`/product/${p._id}`}
                        className='text-decoration-none'
                      >
                        <img
                          src={p.images[0]}
                          className='card-img-top img-top-mobile'
                          alt={p.name}
                          style={{
                            borderBottom: '1px solid rgba(0,0,0,.125)',
                            height: '20px',
                          }}
                        />
                        <span className='product-img-count'>
                          <span className='badge badge-pill opacity'>
                            {p.images.length}
                            <i class='fas fa-images ps-1'></i>
                          </span>
                        </span>
                      </Link>
                      {user &&
                        token &&
                        favourites &&
                        favourites.indexOf(p._id) !== -1 && (
                          <Tooltip title='Remove from Favourites'>
                            <span
                              className='product-fav d-flex align-items-center justify-content-center'
                              onClick={() => handleRemoveFavourite(p._id)}
                              role='button'
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: '1px solid rgba(0, 0, 0, 0.125)',
                              }}
                            >
                              <i class='fas fa-star'></i>
                            </span>
                          </Tooltip>
                        )}
                      {user &&
                        token &&
                        favourites &&
                        favourites.indexOf(p._id) === -1 && (
                          <Tooltip title='Add to Favourites'>
                            <span
                              className='product-fav d-flex align-items-center justify-content-center'
                              onClick={() => handleAddFavourite(p._id)}
                              role='button'
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                border: '1px solid rgba(0, 0, 0, 0.125)',
                              }}
                            >
                              <i class='far fa-star fa-star-text'></i>
                            </span>
                          </Tooltip>
                        )}
                    </div>
                    <div className='card-body pb-1'>
                      <div className='d-flex justify-content-between flex-wrap'>
                        <Tooltip title={p.name}>
                          <Link
                            to={`/product/${p._id}`}
                            className='text-decoration-none'
                          >
                            <p class='card-title text-dark1 card-text-title-mobile'>
                              {p.name}
                            </p>
                          </Link>
                        </Tooltip>
                        <span>
                          <p className='text-success'>
                            ₦{parseInt(p.price).format()}
                          </p>
                        </span>
                      </div>
                      <span class='card-text d-flex justify-content-between align-items-center mt-1'>
                        <Link
                          to={`/location/${p.location._id}`}
                          className='text-decoration-none'
                        >
                          <small class='text-muted'>
                            <p
                              className='text-muted'
                              style={{ fontSize: '0.8rem' }}
                            >
                              <i class='fas fa-map-marker-alt me-2'></i>
                              {p.location.name}
                            </p>
                          </small>
                        </Link>
                        <small
                          class='text-muted'
                          style={{ fontSize: '0.8rem' }}
                        >
                          By:{' '}
                          <Link
                            to={`/user/${p.author._id}`}
                            className='text-decoration-none text-dark1'
                          >
                            {p.author.username}
                          </Link>
                        </small>
                      </span>
                    </div>
                  </div>
                </Grid>
              );
            }
          })}
        </Grid.Container>
      </div>
    </div>
  );
};

export default HomeContent;
