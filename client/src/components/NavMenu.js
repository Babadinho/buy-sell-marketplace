import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, Button, Badge } from 'antd';
import io from 'socket.io-client';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import { isAuthenticated } from '../actions/auth';
import {
  reduxUser,
  getUser,
  getUserNotifications,
  setMsgToUnread,
} from '../actions/user';
import { useDispatch, useSelector } from 'react-redux';
// import NProgress from 'nprogress';

const NavMenu = () => {
  const userInfo = useSelector((state) => state.buynsellUser);
  const dispatch = useDispatch();

  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(null);
  const { user, token } = isAuthenticated();
  const history = useHistory();
  const socket = useRef();
  // let location = useLocation();

  // useEffect(() => {
  //   NProgress.start();

  //   setTimeout(() => {
  //     NProgress.done();
  //   }, 500);
  // }, [location]);

  const loadUser = async () => {
    if (user) {
      let res = await reduxUser(user._id);
      let userNotifications = await getUserNotifications(user._id);
      dispatch({
        type: 'USER_DETAILS',
        payload: res.data,
      });
      setNotifications(userNotifications.data.notifications);
      setNotificationCount(userNotifications.data.currentNotificationCount);
    }
  };

  useEffect(() => {
    loadUser();
  }, [dispatch]);

  //Socket useEffect
  useEffect(() => {
    if (user) {
      if (!socket.current) {
        socket.current = io('http://localhost:8000', {
          transports: ['websocket'],
        });
      }

      if (socket.current) {
        socket.current.emit('join', { userId: user._id });

        socket.current.on('newMsgReceived', async ({ newMsg }) => {
          if (window.location.pathname !== '/messages') {
            const res = await setMsgToUnread({
              userId: newMsg.receiver,
            });
          }
          let res = await getUser(newMsg.receiver);
          dispatch({
            type: 'USER_DETAILS',
            payload: res.data,
          });
        });
      }
    }
  }, []);

  const logout = () => {
    window.localStorage.removeItem('buynsell');
    history.push('/login');
    window.location.reload();
  };

  const handleSell = () => {
    if (isAuthenticated()) {
      history.push(`/add-product/${user._id}`);
    } else {
      history.push('/login');
    }
  };

  return (
    <div className='container-fluid p-0'>
      <div className='navmenu navbar navbar-expand-sm navbar-dark px-sm-5 container-fluid nav-shadow'>
        <Link className='navbar-brand' to='/'>
          Buy-and-Sell
        </Link>
        <ul className='navbar-nav align-items-center ms-auto'>
          <li className='nav-item ml-5 px-2'>
            <Button
              type='primary'
              danger
              size='large'
              shape='round'
              onClick={handleSell}
              className='sellButton ml-5'
            >
              Sell a Product
            </Button>
          </li>
          {user && token && (
            <>
              <div class='nav-item ml-5 px-2 dropdown'>
                <Badge
                  dot={userInfo.unreadNotification || userInfo.unreadMessage}
                >
                  <Avatar
                    src={user.photo}
                    size={40}
                    style={{
                      borderRadius: 'none',
                    }}
                    shape='square'
                    class='nav-link dropdown-toggle nav-avatar'
                    to='/dashboard'
                    role='button'
                    id='navbarDropdown'
                    data-toggle='dropdown'
                    aria-haspopup='true'
                    aria-expanded='false'
                  >
                    {user.username[0]}
                  </Avatar>
                </Badge>
                <ul className='dropdown-menu' aria-labelledby='navbarDropdown'>
                  <Link className='nav-link' to='/user/dashboard'>
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link className='nav-link' to='/admin/dashboard'>
                      Admin
                    </Link>
                  )}
                  <Link
                    className='nav-link d-flex align-items-center'
                    to='/user/notifications'
                  >
                    <div>Notifications </div>
                    {notifications.length - notificationCount > 0 && (
                      <div>
                        <span class='badge rounded-pill bg-danger ms-2 notification-badge'>
                          {notifications.length === 0 ||
                          !userInfo.unreadNotification
                            ? ''
                            : notifications.length - notificationCount}
                        </span>
                      </div>
                    )}
                  </Link>
                  <Link className='nav-link' to='/messages'>
                    <div className='d-flex align-items-center'>
                      <div className='pe-1'>Messages</div>
                      <div>
                        {userInfo.unreadMessage && (
                          <span
                            class='badge bg-danger'
                            style={{ fontSize: '7px' }}
                          >
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                  <span className='nav-link' role='button' onClick={logout}>
                    Logout
                  </span>
                </ul>
              </div>
            </>
          )}
          {!user && !token && (
            <>
              <li className='nav-item ml-5 px-2'>
                <Link className='nav-link' to='/login'>
                  Login
                </Link>
              </li>
              <li className='nav-item ml-5 px-2'>
                <Link className='nav-link' to='/register'>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavMenu;
