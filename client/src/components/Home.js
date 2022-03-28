import React, { useState, useEffect } from 'react';
import { Input, Select } from 'antd';
import { useHistory } from 'react-router';
import { allLocations } from '../actions/admin';
import { allCategories } from '../actions/product';
import HomeContent from './HomeContent';
const { Search } = Input;
const { Option } = Select;

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState({
    location: '',
    category: '',
    name: '',
    condition: '',
    price: [],
  });

  const { location, category, name, condition, price } = search;
  const history = useHistory();

  useEffect(() => {
    loadCategories();
    loadLocations();
  }, []);

  const loadCategories = async () => {
    const res = await allCategories();
    setCategories(res.data);
  };
  const loadLocations = async () => {
    const res = await allLocations();
    setLocations(res.data);
  };

  // search functions start
  function handleLocation(value) {
    setSearch({ ...search, location: value });
  }
  function handleCategory(value) {
    setSearch({ ...search, category: value });
  }

  const handleSearch = (e) => {
    setSearch({ ...search, name: e.target.value });
  };
  const handleSubmit = (e) => {
    history.push(
      `search-result?&location=${location}&category=${category}&name=${name}&price=${price}&condition=${condition}`
    );
  };
  // search functions end
  function handleClick(e) {
    console.log('click', e);
  }
  return (
    <>
      {/* header */}
      <div className='home-header mb-3'>
        <div className='row'>
          <div className='col-md-8 mx-auto d-flex justify-content-center'>
            <p className='header-text text-center me-2'>Find a product in</p>
            <Select
              className='header-location'
              showSearch
              size={'small'}
              style={{ width: 130 }}
              placeholder='All Nigeria'
              optionFilterProp='children'
              onChange={handleLocation}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {locations.map((l, i) => {
                return (
                  <Option value={l._id} key={i}>
                    {l.name}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-5 mx-auto'>
            <Input.Group compact>
              <Select
                defaultValue='Category'
                style={{ width: '30%' }}
                onChange={handleCategory}
              >
                {categories.map((c, i) => {
                  return (
                    <Option value={c._id} key={i}>
                      {c.name}
                    </Option>
                  );
                })}
              </Select>
              <Search
                className='shadow-none'
                placeholder='Search a product'
                allowClear
                style={{ width: '70%' }}
                enterButton='Search'
                size='large'
                onChange={handleSearch}
                onSearch={handleSubmit}
              />
            </Input.Group>
          </div>
        </div>
        {/* <div className='header-image1'>
          <img src='/woman2.png' alt='' />
        </div>
        <div className='header-image2'>
          <img src='/man.png' alt='' />
        </div>
        <div className='header-image3'>
          <img src='/woman.png' alt='' />
        </div> */}
      </div>
      {/* home side menu */}

      <HomeContent
        categories={categories}
        locations={locations}
        handleClick={handleClick}
      />
    </>
  );
};

export default Home;
