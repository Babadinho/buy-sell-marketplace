import React, { useState } from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import moment from 'moment';

function Message({ message, user, deleteMsg, bannerProfilePic, divRef }) {
  const [deleteIcon, showDeleteIcon] = useState(false);

  const ifYouSender = message.sender === user._id;

  const photo = user.photo ? user.photo : '';

  return (
    <div className='bubbleWrapper' ref={divRef}>
      <div
        className={ifYouSender ? 'inlineContainer own' : 'inlineContainer'}
        onClick={() => ifYouSender && showDeleteIcon(!deleteIcon)}
      >
        <img
          className='inlineIcon'
          src={ifYouSender ? photo : bannerProfilePic}
        />

        <div className={ifYouSender ? 'ownBubble own' : 'otherBubble other'}>
          {message.msg}
        </div>

        {deleteIcon && (
          <Popup
            trigger={
              <Icon
                name='trash'
                color='red'
                style={{ cursor: 'pointer' }}
                onClick={() => deleteMsg(message._id)}
              />
            }
            content='Delete message? Only for you!'
            position='top right'
          />
        )}
      </div>

      <span className={ifYouSender ? 'own' : 'other'}>
        {moment(message.date).format('DD/MM/YYYY LT')}
      </span>
    </div>
  );
}

export default Message;
