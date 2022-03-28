import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { isAuthenticated } from '../actions/auth';
import { Link } from 'react-router-dom';
import { Tooltip } from 'antd';

const Chat = ({ match }) => {
  const [chat, setChat] = useState([]);
  const { user, token } = isAuthenticated();

  const socket = useRef();

  useEffect(() => {
    if (!socket.current) {
      socket.current = io('http://localhost:8000', {
        transports: ['websocket'],
      });
    }
    if (socket.current) {
      socket.current.emit('helloWorld', { name: 'Donald', age: 28 });

      socket.current.on('dataReceived', ({ msg }) => {
        console.log(msg);
      });
    }
  }, []);

  return (
    <>
      <div className='row container-fluid mx-auto mt-5 profile-container'>
        <div className='col-md-7 mx-auto mb-5'>
          <div className='card rounded-0 profile-card card-shadow'>
            <div className='d-flex justify-content-between card-header profile-card p-3'>
              <h2 className='text-center d-flex align-items-center'>
                <span>
                  <Link
                    to={`/user/messages?&message=${match.params.chatId}`}
                    className='text-decoration-none text-dark1 pe-4'
                  >
                    <Tooltip title='Back to Messages'>
                      <span className='category-span'>
                        <i class='fas fa-arrow-circle-left p-0'></i>
                      </span>
                    </Tooltip>
                  </Link>
                </span>
                <span>Chat with </span>
              </h2>
            </div>
            {/* {chats.length > 0 && <ChatList chats={chats} />} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
