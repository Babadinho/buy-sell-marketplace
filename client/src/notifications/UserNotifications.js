import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../actions/auth';
import { getUserNotifications, markNotificationsRead } from '../actions/user';
import { useDispatch } from 'react-redux';
import { Empty, Pagination, Tooltip } from 'antd';
import FavNotification from './FavNotification';
import RatingNotification from './RatingNotification';
import FollowNotification from './FollowNotification';

const UserNotifications = () => {
  const countPerPage = 10;
  const [current, setCurrent] = useState();
  const [pagination, setPagination] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { user } = isAuthenticated();
  const dispatch = useDispatch();

  const markRead = async (page) => {
    try {
      if (user) {
        let userNotifications = await getUserNotifications(user._id);
        setNotifications(userNotifications.data.notifications);
        setCurrent(page);
        const to = page * countPerPage;
        const from = to - countPerPage;
        setPagination(userNotifications.data.notifications.slice(from, to));
        const res = await markNotificationsRead({
          userId: user._id,
          notificationCount: userNotifications.data.notifications.length,
        });
        dispatch({
          type: 'USER_DETAILS',
          payload: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    markRead(1);
  }, []);

  return (
    <>
      <div className='row container-fluid mx-auto mt-4 profile-container'>
        <div className='col-md-8 mb-5'>
          <div className='card rounded-0 profile-card card-shadow'>
            <div className='d-flex justify-content-between card-header profile-card'>
              <h2 className='text-center d-flex align-items-center'>
                <span>
                  <Link
                    to='/user/dashboard'
                    className='text-decoration-none text-dark1 pe-4'
                  >
                    <Tooltip title='Back to Dashboard'>
                      <span className='category-span'>
                        <i class='fas fa-arrow-circle-left p-0 me-3'></i>
                      </span>
                    </Tooltip>
                  </Link>
                </span>
                <span>Notifications</span>
              </h2>
            </div>
            <div className='card-body'>
              {pagination.length === 0 && (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
              {pagination.length > 0 && (
                <>
                  {pagination.map((notification, index) => (
                    <div key={index}>
                      {notification.type === 'newFavorite' && (
                        <FavNotification
                          key={notification._id}
                          notification={notification}
                        />
                      )}
                      {notification.type === 'newFollower' && (
                        <FollowNotification
                          key={notification._id}
                          notification={notification}
                        />
                      )}
                      {notification.type === 'newRating' && (
                        <RatingNotification
                          key={notification._id}
                          user={user}
                          notification={notification}
                        />
                      )}
                    </div>
                  ))}
                </>
              )}
              {pagination.length > 10 && (
                <Pagination
                  pageSize={countPerPage}
                  onChange={markRead}
                  defaultCurrent={current}
                  total={notifications.length}
                />
              )}
            </div>
          </div>
        </div>
        <div className='col-md-4 mb-5'>
          <div className='card rounded-0 profile-card card-shadow'>
            <div className=' card-header profile-card'>
              <h2 className=''>
                <span>Links</span>
              </h2>
            </div>
            <ul className='list-group rounded-0 profile-list card-shadow'>
              <li className='list-group-item'>
                <Link
                  to='/user/dashboard'
                  className='text-dark1 text-dark-hover text-decoration-none'
                >
                  <i class='fas fa-users me-1'></i>Dashboard
                </Link>
              </li>
              <li className='list-group-item'>
                <Link
                  to='/user/messages'
                  className='text-dark1 text-dark-hover text-decoration-none'
                >
                  <i class='fas fa-envelope me-2'></i>Messages
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserNotifications;
