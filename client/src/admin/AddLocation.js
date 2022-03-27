import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { isAuthenticated } from '../actions/auth';
import moment from 'moment';
import throttle from 'lodash/throttle';
import {
  Card,
  Avatar,
  Button,
  Tooltip,
  message,
  Popconfirm,
  Pagination,
} from 'antd';
import { addLocation, allLocations, deleteLocation } from '../actions/admin';

const { Meta } = Card;

const AddLocation = () => {
  const [name, setName] = useState('');
  const countPerPage = 5;
  const [locations, setLocations] = useState({
    location: [],
    pagination: [],
    deleted: false,
    newAdded: false,
  });
  const [current, setCurrent] = useState();
  const [search, setSearch] = useState('');
  const { location, pagination, deleted, newAdded } = locations;

  const { user, token } = isAuthenticated();

  const searchData = useRef(
    throttle(async (val) => {
      const query = val.toLowerCase();
      setCurrent(1);
      const data = await allLocations();
      const newData = data.data
        .filter((item) => item.name.toLowerCase().indexOf(query) > -1)
        .slice(0, countPerPage);
      setLocations({ ...locations, pagination: newData });
    }, 400)
  );

  useEffect(() => {
    if (!search) {
      loadLocations(1);
    } else {
      searchData.current(search);
    }
  }, [search, newAdded, deleted]);

  const loadLocations = async (page) => {
    const res = await allLocations();
    setCurrent(page);
    const to = page * countPerPage;
    const from = to - countPerPage;
    setLocations({ location: res.data, pagination: res.data.slice(from, to) });
  };

  const handleDelete = async (locationId) => {
    const res = await deleteLocation(locationId, token);
    if (res.error) {
      console.log(res.error);
    } else {
      console.log(res);
      message.success('Location deleted', 4);
      setLocations({ ...locations, deleted: true });
    }
  };

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addLocation({ name });
      console.log(res);
      message.success('Location added', 4);
      setName('');
      setLocations({ ...locations, newAdded: true });
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };

  const history = useHistory();

  const logout = () => {
    window.localStorage.removeItem('buynsell');
    history.push('/login');
    window.location.reload();
  };

  return (
    <>
      <div className='row container-fluid mx-auto mt-5 profile-container'>
        <div className='col-md-3 mb-5'>
          <Card
            className='card-shadow'
            style={{ width: 'auto' }}
            cover={
              <Avatar
                src={user.photo}
                className='mx-auto mt-3 avatar-user'
                size={130}
              >
                {user.name[0]}
              </Avatar>
            }
          >
            <div className='text-center'>
              <h5>({user.username})</h5>
            </div>
            <Meta
              title={user.name}
              description={user.phone}
              className='text-center user-details'
            />
          </Card>
          <ul className='list-group rounded-0 profile-list card-shadow'>
            <li className='list-group-item'>
              <Link
                to='/admin/dashboard'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-user-shield'></i> Admin Dashboard
              </Link>
            </li>
            <li className='list-group-item'>
              <Link
                to='/user/dashboard'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-user'></i> User Dashboard
              </Link>
            </li>

            <li className='list-group-item'>
              <Link
                to='/admin/add-category'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-plus-square'></i> Add Category
              </Link>
            </li>
            <li className='list-group-item'>
              <Link
                to='/admin/users'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-user-edit'></i> Manage Users
              </Link>
            </li>
            <li
              className='list-group-item text-dark1'
              role='button'
              onClick={logout}
            >
              <i class='fas fa-sign-out-alt'></i> Logout
            </li>
          </ul>
        </div>
        <div className='col-md-9 mb-5'>
          <div className='card rounded-0 mb-5 pb-5 card-shadow'>
            <div className='card-header p-4'>
              <h2 className='text-center'>
                <Link
                  to='/admin/dashboard'
                  className='text-decoration-none text-dark1'
                >
                  <Tooltip title='Back to Admin'>
                    <span className='category-span'>
                      <i class='fas fa-arrow-circle-left'></i>
                    </span>
                  </Tooltip>
                </Link>
                <i class='fas fa-plus-circle'></i> Add New Location
              </h2>
            </div>
            <div className='card-body'>
              <form onSubmit={handleSubmit}>
                <div className='form-group mb-4 col-md-8 mx-auto'>
                  <label className='form-label'>Location Name</label>
                  <input
                    type='text'
                    className='form-control shadow-none rounded-0'
                    placeholder='Enter location name'
                    value={name}
                    onChange={handleChange}
                  />
                </div>
                <div className='mx-auto col-md-8'>
                  <Button
                    type='primary'
                    size='large'
                    shape='round'
                    className='rounded-0'
                    htmlType='submit'
                  >
                    Add Location
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className='card rounded-0 profile-card card-shadow'>
            <div className='card-header profile-card p-3'>
              <div className='row'>
                <div className='col-md-8'>
                  <h4>Manage Locations</h4>
                </div>
                <div className='col-md-4'>
                  <div class='input-group'>
                    <input
                      type='text'
                      className='form-control rounded-0 shadow-none'
                      placeholder='Search locations'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <table class='table'>
                <thead>
                  <tr>
                    <th scope='col'>Name</th>
                    <th scope='col'>Date Added</th>
                    <th scope='col'></th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.map((c, i) => (
                    <tr key={i}>
                      <td>
                        <Link
                          to={`/location/${c._id}`}
                          className='text-decoration-none text-dark1'
                        >
                          {c.name}
                        </Link>
                      </td>
                      <td className='text-dark1'>
                        {moment(c.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                      </td>
                      <td className='d-flex justify-content-evenly manage-user-btn'>
                        <Link
                          to={`/admin/location/edit/${c._id}`}
                          class='btn btn-warning btn-sm text-white pt-0 pb-0'
                        >
                          Edit
                        </Link>
                        <span class='btn btn-danger btn-sm text-white pt-0 pb-0'>
                          <Popconfirm
                            placement='top'
                            title={'Are you sure to delete this category?'}
                            onConfirm={() => handleDelete(c._id)}
                            okText='Yes'
                            cancelText='No'
                          >
                            Delete
                          </Popconfirm>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <Pagination
                pageSize={countPerPage}
                onChange={loadCategories}
                current={current}
                total={category.length}
              /> */}
              <Pagination
                pageSize={countPerPage}
                onChange={loadLocations}
                defaultCurrent={current}
                total={location.length}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLocation;
