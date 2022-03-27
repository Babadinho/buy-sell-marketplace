import { Link } from 'react-router-dom';
import { Feed } from 'semantic-ui-react';
import { Avatar } from 'antd';
import moment from 'moment';

const RatingNotification = ({ user, notification }) => {
  return (
    <Feed className='mt-2'>
      <Feed.Event className='mb-3 ms-2'>
        <Feed.Label>
          {notification.user.photo ? (
            <img src={notification.user.photo} />
          ) : (
            <Avatar>{notification.user.name[0]}</Avatar>
          )}
        </Feed.Label>
        <Feed.Content>
          <Feed.Summary
            className={notification.status === 'read' && 'text-muted'}
          >
            <Feed.User>
              <Link to={`/user/${notification.user._id}`}>
                {notification.user.name}
              </Link>
            </Feed.User>{' '}
            Rated you{' '}
            <Link
              to={`/rate/user/${user._id}`}
              className={
                notification.ratingId.rating === 'positive'
                  ? 'text-success text-capitalize'
                  : 'text-danger text-capitalize'
              }
            >
              {notification.ratingId.rating}{' '}
              {notification.ratingId.rating === 'positive' ? (
                <i class='fas fa-thumbs-up' style={{ fontSize: '0.8rem' }}></i>
              ) : (
                <i
                  class='fas fa-thumbs-down'
                  style={{ fontSize: '0.8rem' }}
                ></i>
              )}
            </Link>
            <Feed.Date>{moment(notification.date).fromNow()}</Feed.Date>
          </Feed.Summary>
          <Feed.Extra
            text
            className={notification.status === 'read' && 'text-muted'}
          >
            {notification.ratingId.feedback}
          </Feed.Extra>
        </Feed.Content>
      </Feed.Event>
    </Feed>
  );
};

export default RatingNotification;
