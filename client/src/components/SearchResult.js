import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { Input, Pagination, Empty, Radio, Space } from 'antd';
import { prices } from '../components/PriceRange';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useHistory } from 'react-router';
import { allLocations } from '../actions/admin';
import { allCategories } from '../actions/product';
import { searchResults } from '../actions/product';
const { Search } = Input;

const SearchResult = () => {
  const countPerPage = 10;
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState([]);
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [condition, setCondition] = useState('');
  const [locationName, setLocationName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [current, setCurrent] = useState();
  const [pagination, setPagination] = useState();
  const history = useHistory();
  const minId = document.querySelector('.min');
  const maxId = document.querySelector('.max');

  const loadSearchResults = async (page) => {
    const { location, category, name } = queryString.parse(
      window.location.search
    );
    setCategory(category);
    setLocation(location);
    setName(name);
    const res = await searchResults({
      location,
      category,
      name,
      price,
      condition,
    });
    setCurrent(page);
    const to = page * countPerPage;
    const from = to - countPerPage;
    setPagination(res.data.slice(from, to));
    setSearchResult(res.data);
  };

  const loadCategories = async () => {
    const { category } = queryString.parse(window.location.search);
    const res = await allCategories();
    res.data.filter((cat) => {
      if (cat._id === category) {
        setCategoryName(cat.name);
      }
    });
  };
  const loadLocations = async () => {
    const { location } = queryString.parse(window.location.search);
    const res = await allLocations();
    res.data.filter((loc) => {
      if (loc._id === location) {
        setLocationName(loc.name);
      }
    });
  };

  const handleCondition = (e) => {
    setCondition(e.target.value);
    history.push(
      `search-result?&location=${location}&category=${category}&name=${name}&price=${price}&condition=${e.target.value}`
    );
  };

  const handlePriceRange = (e) => {
    setPrice(e.target.value);
    history.push(
      `search-result?&location=${location}&category=${category}&name=${name}&price=${e.target.value}&condition=${condition}`
    );
    setMin('');
    setMax('');
  };

  const handleSearch = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (name) => {
    history.push(
      `search-result?&location=${location}&category=${category}&name=${name}&price=${price}&condition=${condition}`
    );
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

    setPrice(newArray);

    history.push(
      `search-result?&location=${location}&category=${category}&name=${name}&price=${newArray}&condition=${condition}`
    );
  };

  //format currency
  Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  };

  useEffect(() => {
    loadSearchResults(1);
    loadCategories();
    loadLocations();
  }, [window.location.search]);

  return (
    <>
      <div className='search-header mb-3 container-fluid'>
        <div className='row search'>
          <p className='header-text text-center me-2 d-flex justify-content-center'>
            Searching for&nbsp;
            {categoryName ? categoryName : <span>Products</span>}&nbsp;in&nbsp;
            {locationName ? locationName : <span>Nigeria</span>}
          </p>
          <div className='col-md-8 mx-auto d-flex justify-content-center'>
            <Search
              value={name}
              className='shadow-none'
              placeholder='Enter your search here'
              allowClear
              style={{ width: '80%' }}
              enterButton='Search'
              size='large'
              onChange={handleSearch}
              onSearch={handleSubmit}
            />
          </div>
        </div>
      </div>

      <div className='row container-fluid mx-auto mt-3 mb-5 profile-container'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to='/' className='text-decoration-none'>
              Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            {categoryName ? categoryName : <span>Products</span>}
          </Breadcrumb.Item>
        </Breadcrumb>
        <div className='col-md-3 mb-2'>
          <div className='card rounded-0 profile-card card-shadow'>
            <div className='card-header p-3'>
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
              <div className='pt-2'>
                {searchResult.length > 0 && (
                  <h2 className='' style={{ fontSize: '1.7rem' }}>
                    Found {searchResult.length} result(s) for your search
                  </h2>
                )}
                {searchResult.length < 1 && (
                  <h2 className='' style={{ fontSize: '1.7rem' }}>
                    No products found
                  </h2>
                )}
              </div>
            </div>
            {searchResult.length <= 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {searchResult.length > 0 && (
              <div className='card-body desktop-product-view'>
                {pagination.map((p, i) => {
                  if (p.status === 'active') {
                    return (
                      <div class='card rounded-0 mb-3 product-card' key={i}>
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
                                  to={`/search-result?&location=${p.location._id}&category=&name=&price=&condition=`}
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
                  }
                })}
                <Pagination
                  pageSize={countPerPage}
                  onChange={loadSearchResults}
                  defaultCurrent={current}
                  total={searchResult.length}
                />
              </div>
            )}

            {searchResult.length > 0 && (
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
                  onChange={loadSearchResults}
                  defaultCurrent={current}
                  total={searchResult.length}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResult;
