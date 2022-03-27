import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { isAuthenticated } from '../actions/auth';
import moment from 'moment';
import { viewUser } from '../actions/user';
import { rateUser, deleteRating } from '../actions/rating';
import {
  Card,
  Avatar,
  Tooltip,
  Button,
  message,
  Comment,
  Empty,
  Popconfirm,
} from 'antd';
import { DislikeFilled, LikeFilled } from '@ant-design/icons';

const { Meta } = Card;

const RateUser = ({ match, children }) => {
  const [values, setValues] = useState({
    _id: '',
    name: '',
    username: '',
    phone: '',
    photo: '',
    ratings: [],
  });

  const [active, setActive] = useState({
    thumbsUp: false,
    thumbsDown: false,
  });
  //   all ratinsg state
  const [rating, setRating] = useState('');
  const [rated, setRated] = useState('');
  const [feedback, setFeedback] = useState('');
  const [positiveRatings, setpositiveRatings] = useState([]);
  const [negativeRatings, setnegativeRatings] = useState([]);
  const [isUser, setIsUser] = useState(false);

  const { thumbsUp, thumbsDown } = active;
  const { _id, name, username, phone, photo, ratings } = values;

  const { user } = isAuthenticated();

  //antd ratings list start
  // const [action, setAction] = useState(null);

  // const comment = () => {};
  //ratings list end
  const positiveRating = [];
  const negativeRating = [];

  //   load user and also get user ratings info
  const loadUser = async () => {
    let res = await viewUser(match.params.userId);
    console.log(res);
    res.data.ratings.forEach((item) => {
      if (item.rating === 'positive') {
        positiveRating.push(item._id);
        setpositiveRatings(positiveRating);
      } else if (item.rating === 'negative') {
        negativeRating.push(item._id);
        setnegativeRatings(negativeRating);
      }
      if (item.author._id === user._id) {
        setRated(item.author._id);
      }
    });
    if (res.data._id === user._id) {
      setIsUser(true);
    }
    setValues({
      ...values,
      ...res.data,
    });
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handlePositive = () => {
    setActive({ thumbsUp: true, thumbsDown: false });
    setRating('positive');
  };
  const handleNegative = () => {
    setActive({ thumbsDown: true, thumbsUp: false });
    setRating('negative');
  };

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);

    try {
      const res = await rateUser(match.params.userId, {
        rating: rating,
        feedback: feedback,
        author: user._id,
      });
      console.log(res);
      message.success('Thanks for rating this user', 4);
      history.push(`/user/${_id}`);
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };

  const handleChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleRatingDelete = async (ratingId) => {
    const res = await deleteRating(ratingId, { userId: match.params.userId });
    if (res) {
      console.log(res);
      history.push(`/user/${_id}`);
      message.success('Rating Deleted', 4);
    }
  };

  return (
    <>
      <div className='row container-fluid mx-auto mt-5 mb-5 profile-container'>
        <div className='col-md-3 mb-5'>
          <Card
            className='card-shadow'
            style={{ width: 'auto' }}
            cover={
              <Avatar
                src={photo}
                className='mx-auto mt-3 avatar-user'
                size={130}
              >
                {name[0]}
              </Avatar>
            }
          >
            <div className='text-center'>
              <h5>({username})</h5>
            </div>
            <Meta
              title={name}
              description={phone}
              className='text-center user-details'
            />
          </Card>
        </div>
        <div className={isUser ? 'col-md-9 mb-5' : 'col-md-6 mb-5'}>
          <div
            className='card rounded-0 profile-card card-shadow'
            style={{ display: isUser ? 'none' : '' }}
          >
            <div className='card-header profile-card p-3'>
              <h2 className='text-center'>
                <Link
                  to={`/user/${_id}`}
                  className='text-decoration-none text-dark1'
                >
                  <Tooltip title='Back to User'>
                    <span className='category-span ms-1'>
                      <i class='fas fa-arrow-circle-left'></i>
                    </span>
                  </Tooltip>
                </Link>
                Rate {username}
              </h2>
            </div>

            {rated && (
              <div className='card-body'>
                <h5 className='text-center text-info'>
                  You already rated this user
                </h5>
              </div>
            )}
            {!rated && (
              <div className='card-body'>
                <ul className='nav nav-pills d-flex justify-content-center'>
                  <li className='nav-item me-2'>
                    <div
                      className={
                        thumbsUp ? 'btn btn-success' : 'btn btn-outline-success'
                      }
                      value={rating}
                      onClick={handlePositive}
                    >
                      <i class='fas fa-thumbs-up'></i> Positive
                    </div>
                  </li>
                  <li className='nav-item ms-2'>
                    <div
                      className={
                        thumbsDown ? 'btn btn-danger' : 'btn btn-outline-danger'
                      }
                      value={rating}
                      onClick={handleNegative}
                    >
                      <i class='fas fa-thumbs-down'></i> Negative
                    </div>
                  </li>
                </ul>

                <form onSubmit={handleSubmit}>
                  <div className='form-group mb-4 col-md-8 mx-auto'>
                    <div class='input-group mt-3'>
                      <textarea
                        class='form-control shadow-none'
                        aria-label='With textarea'
                        placeholder='Leave a detailed feedback'
                        style={{ height: '130px' }}
                        value={feedback}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                  <div className='mx-auto col-md-8 d-flex justify-content-center'>
                    <Button
                      type='primary'
                      size='large'
                      htmlType='submit'
                      className='form-control btn-primary'
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <div className='card rounded-0 profile-card card-shadow mt-4'>
            <div className='card-header profile-card p-3'>
              <div className='row'>
                <div className='col-md-6'>
                  {isUser ? (
                    <h3 className='text-center text-lg-start'>Your Ratings</h3>
                  ) : (
                    <h4 className='text-center text-lg-start'>User Ratings</h4>
                  )}
                </div>
                <div className='col-md-6'>
                  <div className='d-flex justify-content-lg-end justify-content-center'>
                    <span className='text-success me-3'>
                      <i class='fas fa-thumbs-up'></i> Positive (
                      {positiveRatings.length})
                    </span>
                    <span className='text-danger'>
                      <i class='fas fa-thumbs-down'></i> Negative (
                      {negativeRatings.length})
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {ratings.length < 1 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <div className='card-body'>
                {ratings.map((r, i) => {
                  return (
                    <Comment
                      key={i}
                      actions={[
                        <span key='comment-nested-reply-to'>
                          Reply to {r.author.name}
                        </span>,
                      ]}
                      author={
                        <Link
                          to={`/user/${r.author._id}`}
                          className='text-decoration-none rating-reply-author'
                        >
                          {r.author.name}
                        </Link>
                      }
                      avatar={
                        <Link
                          to={`/user/${r.author._id}`}
                          className='text-decoration-none rating-reply-author'
                        >
                          <Avatar
                            src={`${r.author.photo}`}
                            alt={r.author.name}
                          >{`${r.author.name[0]}`}</Avatar>
                        </Link>
                      }
                      content={
                        <div className='d-flex justify-content-between'>
                          <p>{r.feedback}</p>
                          <div className='d-flex flex-column'>
                            <div>
                              <span>
                                <Tooltip title='positive'>
                                  {r.rating === 'positive' && (
                                    <LikeFilled
                                      className='text-success'
                                      style={{ fontSize: '17px' }}
                                      role='button'
                                    />
                                  )}
                                </Tooltip>
                              </span>
                              <span>
                                <Tooltip title='negative'>
                                  {r.rating === 'negative' && (
                                    <DislikeFilled
                                      className='text-danger'
                                      style={{ fontSize: '17px' }}
                                      role='button'
                                    />
                                  )}
                                </Tooltip>
                              </span>
                            </div>
                          </div>
                        </div>
                      }
                      datetime={
                        <div className='d-flex'>
                          <Tooltip
                            title={moment(r.createdAt).format(
                              'YYYY-MM-DD HH:mm:ss'
                            )}
                          >
                            <span>{moment(r.createdAt).fromNow()}</span>
                          </Tooltip>
                          {user._id === r.author._id && (
                            <Popconfirm
                              placement='top'
                              title='Delete Rating?'
                              onConfirm={() => handleRatingDelete(r._id)}
                              okText='Yes'
                              cancelText='No'
                            >
                              <span className='text-danger ms-2' role='button'>
                                <i class='far fa-trash-alt'></i>
                              </span>
                            </Popconfirm>
                          )}
                        </div>
                      }
                    >
                      {children}
                    </Comment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div
          className='col-md-3 mb-5'
          style={{ display: isUser ? 'none' : '' }}
        >
          <div className='card card-shadow rounded-0'>
            <div className='d-flex justify-content-center flex-column align-items-center'>
              <i class='far fa-smile-beam fa-3x pt-3'></i>
              <p className='text-center p-2'>
                Your feedback is very important for the seller rating. Please
                leave an honest review to help other buyers and the seller in
                the customer attraction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RateUser;
