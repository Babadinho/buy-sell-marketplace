import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../actions/auth';
import { Tooltip, message, Descriptions, Card, Avatar, Button } from 'antd';
import moment from 'moment';
import {
  singleProduct,
  addFavourite,
  removeFavourite,
  favouriteCount,
} from '../actions/product';
import ReportProduct from '../components/ReportProduct';
import { viewUser } from '../actions/user';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import RelatedProducts from './RelatedProducts';
import { useDispatch, useSelector } from 'react-redux';
const { Meta } = Card;

const ViewProduct = ({ match, history }) => {
  const dispatch = useDispatch();
  const [product, setProduct] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [productLocation, setProductLocation] = useState([]);
  const [productAuthor, setProductAuthor] = useState([]);
  const [productAuthorName, setProductAuthorName] = useState([]);
  const [productReports, setProductReports] = useState([]);
  const [reported, setReported] = useState(false);
  const [category, setCategory] = useState('');
  const [favourites, setFavourites] = useState([]);
  const [favourite, setFavourite] = useState(false);
  const [favCount, setFavCount] = useState(null);

  const { user, token } = isAuthenticated();

  useEffect(() => {
    loadProduct();
    loadUser();
    loadFavouriteCount();
  }, [favourite, reported, match.params.productId]);

  const loadUser = async () => {
    if (user && token) {
      const res = await viewUser(user._id);
      setFavourites(res.data.favourites);
    }
  };

  const loadProduct = async () => {
    const res = await singleProduct(match.params.productId);
    setProduct(res.data);
    setCategory(res.data.category);
    setProductLocation(res.data.location);
    setProductAuthor(res.data.author);
    setProductAuthorName(res.data.author.name);
    var imageArray = res.data.images
      .slice(0)
      .map((item, index) => ({ original: item, thumbnail: item }));
    setProductImages(imageArray);

    const reportArray = [];
    res.data.reports.map((item) => reportArray.push(item.author));
    setProductReports(reportArray);
    dispatch({
      type: 'PRODUCT_DETAILS',
      payload: res.data.category,
    });
  };

  const loadFavouriteCount = async () => {
    const res = await favouriteCount(match.params.productId);
    setFavCount(res.data);
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
    setFavourite(!favourite);
  };

  //format currency
  Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  };

  return (
    <>
      <div className='row mb-4 mt-3 container-fluid profile-container mx-auto product-carousel'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to='/' className='text-decoration-none'>
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link
              to={`/category/${category._id}`}
              className='text-decoration-none'
            >
              {category.name}
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className='col-md-9 mx-auto mb-4'>
          <div className='card rounded-0 profile-card'>
            <ImageGallery
              items={productImages}
              showPlayButton={false}
              showFullscreenButton={false}
            />
            <div className='d-flex justify-content-between align-items-center p-3'>
              <span>
                <h1 className='text-dark1' style={{ fontSize: '1.4rem' }}>
                  {product.name}
                </h1>
              </span>
              {user && token && (
                <div className='d-flex'>
                  <div>
                    {favourites.includes(product._id) && (
                      <Tooltip title='Remove from Favourites'>
                        <span
                          className='single-product-fav'
                          onClick={() => handleRemoveFavourite(product._id)}
                          role='button'
                          style={{
                            borderRadius: '50%',
                            border: '1px solid rgba(0, 0, 0, 0.125)',
                          }}
                        >
                          <i class='fas fa-star'></i>
                        </span>
                      </Tooltip>
                    )}
                    {!favourites.includes(product._id) && (
                      <Tooltip title='Add to Favourites'>
                        <span
                          className='single-product-fav'
                          onClick={() => handleAddFavourite(product._id)}
                          role='button'
                          style={{
                            borderRadius: '50%',
                            border: '1px solid rgba(0, 0, 0, 0.125)',
                          }}
                        >
                          <i class='far fa-star fa-star-text'></i>
                        </span>
                      </Tooltip>
                    )}
                  </div>
                  <div>
                    <span class='badge bg-light text-dark text-muted'>
                      {favCount}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <small>
              <div className='d-flex justify-content-between'>
                <div className='d-flex'>
                  <p class='text-muted ps-3 pe-4'>
                    <i class='far fa-clock pe-1'></i>Posted{' '}
                    {moment(product.createdAt).fromNow()}
                  </p>
                  <Link
                    to={`/search-result?&location=${productLocation._id}&category=&name=&price=&condition=`}
                    className='text-decoration-none'
                  >
                    <p className='text-muted' style={{ fontSize: '14px' }}>
                      <i class='fas fa-map-marker-alt me-2'></i>
                      {productLocation.name}
                    </p>
                  </Link>
                </div>

                <span className='me-3'>
                  <p className='text-muted' style={{ fontSize: '15px' }}>
                    ₦{parseInt(product.price).format()}
                  </p>
                </span>
              </div>
            </small>
            <div className='pe-2 ps-2 mb-5'>
              <Descriptions bordered>
                <Descriptions.Item label='Category'>
                  {category.name}
                </Descriptions.Item>
                {product.condition !== '' && (
                  <Descriptions.Item label='Condition'>
                    {product.condition}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label='Seller'>
                  {productAuthor.name}
                </Descriptions.Item>
                <Descriptions.Item label='Product Status'>
                  <span className='capitalize'>{product.status}</span>
                </Descriptions.Item>
                <Descriptions.Item label='Price'>
                  ₦{parseInt(product.price).format()}
                </Descriptions.Item>
                <Descriptions.Item label='Last Updated'>
                  {moment(product.updatedAt).fromNow()}
                </Descriptions.Item>
              </Descriptions>
              <h3 className='pt-3 ps-2 pe-2' style={{ fontSize: '1rem' }}>
                <strong>Description</strong>
              </h3>
              <p
                className='ps-2 pe-2'
                style={{ fontSize: '0.89rem', lineHeight: '1.5rem' }}
              >
                {product.description}
              </p>
            </div>
          </div>
          {category && <RelatedProducts category={category._id} />}
        </div>
        <div className='col-md-3'>
          <div className='card rounded-0 profile-card'>
            <Card
              style={{ width: 'auto', marginBottom: '-9px' }}
              className='border-0'
              cover={
                <Avatar
                  src={productAuthor.photo}
                  className='mx-auto mt-3 avatar-user'
                  size={120}
                  style={{ marginBottom: '-13px' }}
                >
                  {productAuthorName[0]}
                </Avatar>
              }
            >
              <Meta
                title={productAuthorName}
                description={
                  user && token ? (
                    <Tooltip title={`Call ${productAuthorName}`}>
                      <a
                        href={`tel:${productAuthor.phone}`}
                        className='text-decoration-none text-dark1 text-muted bg-light text-center p-2 pe-5 ps-5 bg-light'
                      >
                        <i class='fas fa-phone-alt'></i>{' '}
                        <span>{productAuthor.phone}</span>
                      </a>
                    </Tooltip>
                  ) : (
                    <span className='text-dark1 bg-light text-center p-2 pe-2 ps-2 bg-light'>
                      {' '}
                      <i>Login to view seller number..</i>
                    </span>
                  )
                }
                className='text-center user-details'
              />
              <span className='d-flex justify-content-center align-items-center mt-3'>
                <div className='text-dark1 me-2' style={{ fontSize: '15px' }}>
                  Joined
                </div>{' '}
                <span style={{ color: '#3f8600', fontSize: '15px' }}>
                  {moment(productAuthor.createdAt).fromNow()}
                </span>
              </span>
            </Card>
            {user && user._id !== productAuthor._id && (
              <div className='d-flex justify-content-evenly pe-4 ps-4 mb-4'>
                <div className=''>
                  <Link to={`/user/${productAuthor._id}`}>
                    <Button
                      type='primary'
                      danger
                      // shape='round'
                      style={{
                        backgroundColor: '#33b27b',
                        borderColor: '#33b27b',
                        color: '#ffffff',
                      }}
                    >
                      Seller Profile
                    </Button>
                  </Link>
                </div>
                <div className=''>
                  <Button
                    type='primary'
                    danger
                    // shape='round'
                    style={{
                      backgroundColor: '#33b27b',
                      borderColor: '#33b27b',
                      color: '#ffffff',
                    }}
                    onClick={() =>
                      history.push(`/messages?&message=${productAuthor._id}`)
                    }
                  >
                    <i class='fas fa-envelope me-2'></i> Message
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div className='card rounded-0 profile-card mt-3'>
            <div className='pe-2 ps-2 pt-2'>
              <span className='text-center text-dark1 ps-4'>
                <strong>Safety tips</strong>
              </span>
              <span>
                <ul>
                  <li>Do not pay in advance even for the delivery</li>
                  <li>Try to meet at a safe, public location</li>
                  <li>Check the item BEFORE you buy it</li>
                  <li>Pay only after collecting the item</li>
                </ul>
              </span>
            </div>
          </div>
          {user && token && user._id !== productAuthor._id && (
            <ReportProduct
              product={product}
              productReports={productReports}
              productId={match.params.productId}
              setReported={setReported}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewProduct;
