import { Link } from 'react-router-dom';
import { Feed } from 'semantic-ui-react';
import { Avatar } from 'antd';
import moment from 'moment';

const FavNotification = ({ notification }) => {
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
            Favorited your{' '}
            <Link to={`/product/${notification.product._id}`}>Product</Link>
            <Feed.Date>{moment(notification.date).fromNow()}</Feed.Date>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    </Feed>
  );
};

export default FavNotification;
