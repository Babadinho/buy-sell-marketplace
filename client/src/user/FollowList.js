import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../actions/auth';
import { viewUser2, viewUser, followUser, unfollowUser } from '../actions/user';
import UserSideBar from '../components/UserSideBar';
import { Empty, Pagination, Button, message, Avatar } from 'antd';

const FollowList = () => {
  const countPerPage = 10;
  const [values, setValues] = useState({
    followers: [],
    following: [],
    favourites: [],
  });
  const [current, setCurrent] = useState();
  const [pagination, setPagination] = useState([]);
  const [pagination2, setPagination2] = useState([]);
  const [follow, setFollow] = useState(null);
  const [following2, setFollowing2] = useState([]);
  const [positiveRatings, setpositiveRatings] = useState([]);
  const [negativeRatings, setnegativeRatings] = useState([]);
  const positiveRating = [];
  const negativeRating = [];

  const { followers, following, favourites } = values;

  const { user, token } = isAuthenticated();

  useEffect(() => {
    loadUser(1);
    loadUser2();
  }, [follow]);

  const loadUser = async (page) => {
    let res = await viewUser2(user._id);
    setCurrent(page);
    const to = page * countPerPage;
    const from = to - countPerPage;
    setPagination(res.data.followers.slice(from, to));
    setPagination2(res.data.following.slice(from, to));
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
      favourites: res.data.favourites,
    });
  };

  const loadUser2 = async () => {
    let res = await viewUser(user._id);
    setFollowing2(res.data.following);
  };

  const handleFollow = async (userId) => {
    try {
      let res = await followUser(userId, user, token);
      console.log(res);
      follow === false ? setFollow(true) : setFollow(false);
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data);
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      let res = await unfollowUser(userId, user, token);
      console.log(res);
      follow === true ? setFollow(false) : setFollow(true);
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data);
    }
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
          <div className='card rounded-0 mb-4 profile-card card-shadow'>
            <div className='d-flex justify-content-between card-header profile-card p-3'>
              <h2 className='text-center'>Following</h2>
            </div>
            {following.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {following.length > 0 && (
              <div className='card-body'>
                {pagination2.map((p, i) => {
                  return (
                    <ul className='list-group mb-3 rounded-0'>
                      <li
                        class='list-group-item d-flex justify-content-between border-top-0 border-end-0 border-start-0'
                        key={i}
                      >
                        <div className='me-3'>
                          <Link
                            to={`/user/${p._id}`}
                            className='text-decoration-none text-dark'
                          >
                            <Avatar size='large' src={p.photo}>
                              {p.name[0]}
                            </Avatar>
                          </Link>
                        </div>
                        <div class='ms-2 me-auto'>
                          <div class='fw-bold'>
                            <Link
                              to={`/user/${p._id}`}
                              className='text-decoration-none text-dark text-dark-hover'
                            >
                              {p.name}
                            </Link>
                          </div>
                          <div className=''>
                            <span className='me-3 d-flex'>
                              Followers: {p.followers.length}
                            </span>
                            <span className='me-3 d-flex'>
                              Following: {p.following.length}
                            </span>
                          </div>
                        </div>
                        <Button
                          type='primary'
                          danger
                          shape='round'
                          onClick={() => handleUnfollow(p._id)}
                        >
                          Unfollow
                        </Button>
                      </li>
                    </ul>
                  );
                })}
                <Pagination
                  pageSize={countPerPage}
                  onChange={loadUser}
                  defaultCurrent={current}
                  total={following.length}
                />
              </div>
            )}
          </div>
          <div className='card rounded-0 profile-card card-shadow mb-4'>
            <div className='d-flex justify-content-between card-header profile-card p-3'>
              <h2 className='text-center'>Followers</h2>
            </div>
            {followers.length === 0 && (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            {followers.length > 0 && (
              <div className='card-body'>
                {pagination.map((p, i) => {
                  return (
                    <ul class='list-group mb-3 rounded-0'>
                      <li
                        class='list-group-item d-flex justify-content-between align-items-start border-top-0 border-end-0 border-start-0'
                        key={i}
                      >
                        <div className='me-3'>
                          <Link
                            to={`/user/${p._id}`}
                            className='text-decoration-none text-dark'
                          >
                            <Avatar size='large' src={p.photo}>
                              {p.name[0]}
                            </Avatar>
                          </Link>
                        </div>
                        <div class='ms-2 me-auto'>
                          <Link
                            to={`/user/${p._id}`}
                            className='text-decoration-none text-dark text-dark-hover'
                          >
                            <div class='fw-bold'>{p.name}</div>
                          </Link>
                          <div className=''>
                            <span className='me-3 d-flex'>
                              Followers: {p.followers.length}
                            </span>
                            <span className='me-3 d-flex'>
                              Following: {p.following.length}
                            </span>
                          </div>
                        </div>
                        {!following2.includes(p._id) && (
                          <Button
                            type='primary'
                            danger
                            shape='round'
                            onClick={() => handleFollow(p._id)}
                          >
                            Follow
                          </Button>
                        )}
                      </li>
                    </ul>
                  );
                })}
                <Pagination
                  pageSize={countPerPage}
                  onChange={loadUser}
                  defaultCurrent={current}
                  total={followers.length}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FollowList;
