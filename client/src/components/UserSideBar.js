import React from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { isAuthenticated } from '../actions/auth';
import { Card, Avatar, Row, Col, Statistic } from 'antd';

const { Meta } = Card;

const UserSideBar = ({
  followers,
  following,
  favourites,
  positiveRatings,
  negativeRatings,
}) => {
  const { user } = isAuthenticated();

  const history = useHistory();
  const logout = () => {
    window.localStorage.removeItem('buynsell');
    history.push('/login');
    window.location.reload();
  };

  const urlLocation =
    history.location.pathname === '/user/favourites' ||
    history.location.pathname === '/user/follow-list';

  return (
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
        {user.location && user.location !== 'undefined' && (
          <div className='text-center mt-2 bg-light'>
            <h6 className='p-1' style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
              <i class='fas fa-map-marker-alt me-2'></i>
              {user.location} State
            </h6>
          </div>
        )}
        <div className='site-statistic-demo-card'>
          <Row gutter={16}>
            <Col span={12}>
              <Card className='d-flex justify-content-center stats-card'>
                <Statistic
                  className='text-center'
                  title='Followers'
                  value={followers.length}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card className='d-flex justify-content-center'>
                <Statistic
                  className='text-center'
                  title='Following'
                  value={following.length}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
      <ul className='list-group rounded-0 profile-list card-shadow'>
        <Link
          to={`/rate/user/${user._id}`}
          className='text-dark1 text-dark-hover text-decoration-none'
        >
          {positiveRatings && negativeRatings && (
            <li className='list-group-item d-flex justify-content-between align-items-center text-dark1 text-dark-hover'>
              <i class='fas fa-star-half-alt me-1'></i>
              <span className='me-auto'> Reputation</span>
              <div className=''>
                <span className='text-success me-3'>
                  <i class='fas fa-thumbs-up'></i> ({positiveRatings.length})
                </span>
                <span className='text-danger'>
                  <i class='fas fa-thumbs-down'></i> ({negativeRatings.length})
                </span>
              </div>
            </li>
          )}
        </Link>
        {urlLocation && (
          <li className='list-group-item'>
            <Link
              to='/user/dashboard'
              className='text-dark1 text-dark-hover text-decoration-none'
            >
              <i class='fas fa-user'></i> User Dashboard
            </Link>
          </li>
        )}
        {user.role === 'admin' && (
          <li className='list-group-item'>
            <Link
              to='/admin/dashboard'
              className='text-dark1 text-dark-hover text-decoration-none'
            >
              <i class='fas fa-user-shield'></i> Admin Dashboard
            </Link>
          </li>
        )}
        <li className='list-group-item'>
          <Link
            to={`/user/edit/${user._id}`}
            className='text-dark1 text-dark-hover text-decoration-none'
          >
            <i class='fas fa-user-cog me-1'></i>Profile Settings
          </Link>
        </li>
        <Link
          to='/user/favourites'
          className='text-dark1 text-dark-hover text-decoration-none'
        >
          <li className='list-group-item text-dark-hover d-flex justify-content-between align-items-center text-dark1'>
            <i class='fas fa-heart me-1'></i>{' '}
            <span className='me-auto'>Favourites</span>
            <span class='badge badge-pill bg-success'>{favourites.length}</span>
          </li>
        </Link>
        <li className='list-group-item'>
          <Link
            to='/user/follow-list'
            className='text-dark1 text-dark-hover text-decoration-none'
          >
            <i class='fas fa-users me-1'></i>Follow List
          </Link>
        </li>
        {/* <li className='list-group-item'>
          <Link
            to='/user/business'
            className='text-dark1 text-dark-hover text-decoration-none'
          >
            <i class='fas fa-address-card'></i> Business Info
          </Link>
        </li> */}
        <li
          className='list-group-item text-dark1 text-dark-hover'
          role='button'
          onClick={logout}
        >
          <i class='fas fa-sign-out-alt'></i> Logout
        </li>
      </ul>
    </div>
  );
};

export default UserSideBar;
