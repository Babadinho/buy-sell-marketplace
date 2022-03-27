import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import throttle from 'lodash/throttle';
import { useHistory } from 'react-router';
import { isAuthenticated } from '../actions/auth';
import { getUsers, deleteUser, banUser, unBanUser } from '../actions/admin';
import { Card, Avatar, Tooltip, message, Popconfirm, Pagination } from 'antd';

const { Meta } = Card;

const ManageUsers = () => {
  const countPerPage = 10;
  const [users, setUsers] = useState({
    userList: [],
    pagination: [],
    deleted: false,
    banned: false,
  });
  const [current, setCurrent] = useState();
  const [search, setSearch] = useState('');
  const { userList, pagination, deleted, banned } = users;
  const { user, token } = isAuthenticated();

  const searchData = useRef(
    throttle(async (val) => {
      const query = val.toLowerCase();
      setCurrent(1);
      const data = await getUsers();
      const newData = data.data
        .filter((item) => item.name.toLowerCase().indexOf(query) > -1)
        .slice(0, countPerPage);
      setUsers({ ...users, pagination: newData });
    }, 400)
  );

  useEffect(() => {
    if (!search) {
      loadUsers(1);
    } else {
      searchData.current(search);
    }
  }, [search, deleted, banned]);

  const loadUsers = async (page) => {
    const res = await getUsers();
    setCurrent(page);
    const to = page * countPerPage;
    const from = to - countPerPage;
    setUsers({ userList: res.data, pagination: res.data.slice(from, to) });
  };

  const history = useHistory();

  const logout = () => {
    window.localStorage.removeItem('buynsell');
    history.push('/login');
    window.location.reload();
  };

  const handleBan = async (userId) => {
    try {
      const adminRole = user.role;
      const res = await banUser(userId, { adminRole, token });
      console.log(res);
      message.success('User banned', 4);
      setUsers({ ...users, banned: false ? true : false });
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };
  const handleUnBan = async (userId) => {
    try {
      const adminRole = user.role;
      const res = await unBanUser(userId, { adminRole, token });
      console.log(res);
      message.success('User unbanned', 4);
      setUsers({ ...users, banned: true ? false : true });
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };
  const handleDelete = async (userId) => {
    try {
      const adminRole = user.role;
      const res = await deleteUser(userId, { adminRole, token });
      console.log(res);
      message.success('User deleted', 4);
      setUsers({ ...users, deleted: true });
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
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
                to='/admin/add-location'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-plus-circle'></i> Add Location
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
          <div className='card rounded-0 profile-card card-shadow'>
            <div className='card-header profile-card p-3'>
              <div className='row'>
                <div className='col-md-8'>
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
                    <i class='fas fa-user-edit'></i> Manage Users
                  </h2>
                </div>
                <div className='col-md-4'>
                  <div class='input-group'>
                    <input
                      type='text'
                      className='form-control rounded-0 shadow-none'
                      placeholder='Search users'
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
                    <th scope='col'>Date Joined</th>
                    <th scope='col'></th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.map((c, i) => (
                    <tr key={i}>
                      <td>
                        <Link
                          to={`/user/${c._id}`}
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
                          to={`/admin/user/edit/${c._id}`}
                          class='btn btn-info btn-sm text-white'
                        >
                          Edit
                        </Link>
                        {c.role === 'banned' ? (
                          <span class='btn btn-warning btn-sm text-white'>
                            <Popconfirm
                              placement='top'
                              title={`unBan ${c.name}?`}
                              onConfirm={() => handleUnBan(c._id)}
                              okText='Yes'
                              cancelText='No'
                            >
                              unBan
                            </Popconfirm>
                          </span>
                        ) : (
                          <span class='btn btn-warning btn-sm text-white'>
                            <Popconfirm
                              placement='top'
                              title={`Ban ${c.name}?`}
                              onConfirm={() => handleBan(c._id)}
                              okText='Yes'
                              cancelText='No'
                            >
                              Ban
                            </Popconfirm>
                          </span>
                        )}
                        <span class='btn btn-danger btn-sm text-white'>
                          <Popconfirm
                            placement='top'
                            title={'Are you sure to delete this user?'}
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
              <Pagination
                pageSize={countPerPage}
                onChange={loadUsers}
                defaultCurrent={current}
                total={userList.length}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageUsers;
