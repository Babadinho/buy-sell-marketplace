import React, { useState, useEffect, useRef } from 'react';
import queryString from 'query-string';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import io from 'socket.io-client';
import { isAuthenticated } from '../actions/auth';
import { Divider, Comment, Icon, List } from 'semantic-ui-react';
import { Spin, Avatar, Empty, Tooltip } from 'antd';
import { useHistory } from 'react-router';
import MessageInputField from '../messages/MessageInputField';
import Message from '../messages/Message';
import { getUser, setMsgToUnread, markMessageRead } from '../actions/user';
import { getChats, deleteChat } from '../actions/chat';
import { Link } from 'react-router-dom';
import newMsgSound from './newMessageSound';
import { useDispatch, useSelector } from 'react-redux';

const scrollDivToBottom = (divRef) =>
  divRef.current !== null &&
  divRef.current.scrollIntoView({ behaviour: 'smooth' });

const ChatList = () => {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [userData, setUserData] = useState({
    name: '',
    photo: '',
  });
  const { name, photo } = userData;

  const [infiniteScroll, setInfiniteScroll] = useState({
    loading: false,
    hasMore: true,
  });
  const { loading, hasMore } = infiniteScroll;

  const { user, token } = isAuthenticated();

  const dispatch = useDispatch();

  const socket = useRef();

  const { message } = queryString.parse(window.location.search);
  const history = useHistory();

  const divRef = useRef();

  const openChatId = useRef('');

  const loadChats = async () => {
    const res = await getChats(user._id);
    setChats(res.data);
    const read = await markMessageRead({
      userId: user._id,
    });
    dispatch({
      type: 'USER_DETAILS',
      payload: read.data,
    });
  };

  useEffect(() => {
    loadChats();
  }, []);

  //CONNECTION useEffect
  useEffect(() => {
    if (!socket.current) {
      socket.current = io('http://localhost:8000', {
        transports: ['websocket'],
      });
    }
    if (socket.current) {
      socket.current.emit('join', { userId: user._id });

      socket.current.on('connectedUsers', ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });
    }

    if (chats.length > 0 && !message) {
      history.push(`/messages?&message=${chats[0].messagesWith}`);
    }

    return () => {
      if (socket.current) {
        socket.current.emit('disconnectUser');
        socket.current.off();
      }
    };
  }, []);

  // LOAD MESSAGES useEffect
  useEffect(() => {
    const loadMessages = () => {
      socket.current.emit('loadMessages', {
        userId: user._id,
        messagesWith: message,
      });

      socket.current.on('messagesLoaded', async ({ chat }) => {
        setMessages(chat.messages);
        setUserData({
          name: chat.messagesWith.name,
          photo: chat.messagesWith.photo,
        });

        openChatId.current = chat.messagesWith._id;
        divRef.current && scrollDivToBottom(divRef);
      });

      socket.current.on('noChatFound', async () => {
        const res = await getUser(message);

        const newChat = {
          messagesWith: res.data._id,
          name: res.data.name,
          profilePicUrl: res.data.photo,
          lastMessage: '',
          date: Date.now(),
        };

        setChats((prev) => [newChat, ...prev]);

        setUserData({
          name: res.data.name,
          photo: res.data.photo ? res.data.photo : '',
        });
        setMessages([]);

        openChatId.current = message;
      });
    };

    if (socket.current && message) loadMessages();
  }, [message]);

  const sendMsg = (msg) => {
    if (socket.current) {
      socket.current.emit('sendNewMsg', {
        userId: user._id,
        msgSendToUserId: openChatId.current,
        msg,
      });
    }
  };

  // Confirming message is sent and receving the messages useEffect
  useEffect(() => {
    if (socket.current) {
      socket.current.on('msgSent', ({ newMsg }) => {
        if (newMsg.receiver === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);

          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.receiver
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            return [...prev];
          });
        }
      });

      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        let senderName;

        // WHEN CHAT WITH SENDER IS CURRENTLY OPENED INSIDE YOUR BROWSER
        if (newMsg.sender === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);

          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.sender
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            senderName = previousChat.name;

            return [...prev];
          });
        }
        //
        else {
          const ifPreviouslyMessaged =
            chats.filter((chat) => chat.messagesWith === newMsg.sender).length >
            0;

          // IF NO PREVIOUS CHAT WITH THE SENDER
          if (!ifPreviouslyMessaged) {
            const res = await getUser(newMsg.sender);
            senderName = name;

            const newChat = {
              messagesWith: newMsg.sender,
              name: res.data.name,
              profilePicUrl: res.data.photo,
              lastMessage: newMsg.msg,
              date: newMsg.date,
            };
            setChats((prev) => [
              newChat,
              ...prev.filter((chat) => chat.messagesWith !== newMsg.sender),
            ]);
          } else {
            setChats((prev) => {
              const previousChat = prev.find(
                (chat) => chat.messagesWith === newMsg.sender
              );
              previousChat.lastMessage = newMsg.msg;
              previousChat.date = newMsg.date;

              senderName = previousChat.name;

              return [
                previousChat,
                ...prev.filter((chat) => chat.messagesWith !== newMsg.sender),
              ];
            });
          }
        }

        newMsgSound(senderName);
      });
      socket.current.on('setMsgToUnread', async ({ msgSendToUserId }) => {
        const res = await setMsgToUnread({
          userId: msgSendToUserId,
        });
      });
    }
  }, []);

  useEffect(() => {
    messages.length > 0 && scrollDivToBottom(divRef);
  }, [messages]);

  const deleteMsg = (messageId) => {
    if (socket.current) {
      socket.current.emit('deleteMsg', {
        userId: user._id,
        messagesWith: openChatId.current,
        messageId,
      });

      socket.current.on('msgDeleted', () => {
        setMessages((prev) =>
          prev.filter((message) => message._id !== messageId)
        );
      });
    }
  };

  const deleteMessage = async (messagesWith) => {
    try {
      const res = await deleteChat(messagesWith, { userId: user._id, token });

      setChats((prev) =>
        prev.filter((chat) => chat.messagesWith !== messagesWith)
      );
      history.push('/messages');
    } catch (error) {
      console.log(error);
    }
  };

  const handleInfiniteOnLoad = () => {
    setInfiniteScroll({
      loading: true,
    });
    if (chats.length > 14) {
      //   message.warning('Infinite List loaded all');
      setInfiniteScroll({
        hasMore: false,
        loading: false,
      });
      return;
    }
  };

  return (
    <div className='row container-fluid mx-auto mt-4 profile-container'>
      <div className='col-md-4 mx-auto mb-5'>
        <div className='card rounded-0 profile-card card-shadow'>
          <div className='d-flex justify-content-between card-header profile-card p-3'>
            <h2 className='text-center d-flex align-items-center'> Messages</h2>
          </div>
          {chats.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          <>
            <div className='card-body demo-infinite-container'>
              <InfiniteScroll
                initialLoad={false}
                pageStart={0}
                loadMore={handleInfiniteOnLoad}
                hasMore={!loading && hasMore}
                useWindow={false}
              >
                {chats.map((chat, i) => {
                  return (
                    <div key={i}>
                      <List selection>
                        <List.Item
                          active={message === chat.messagesWith}
                          onClick={() =>
                            history.push(
                              `/messages?&message=${chat.messagesWith}`
                            )
                          }
                        >
                          <Comment.Group>
                            <Comment>
                              <Comment.Avatar
                                as='a'
                                src={
                                  chat.profilePicUrl ? (
                                    chat.profilePicUrl
                                  ) : (
                                    <Avatar>{chat.name[0]}</Avatar>
                                  )
                                }
                              />
                              <Comment.Content>
                                <Comment.Author as='a'>
                                  {chat.name}{' '}
                                  {connectedUsers.length > 0 &&
                                    connectedUsers.filter(
                                      (user) =>
                                        user.userId === chat.messagesWith
                                    ).length > 0 && (
                                      <Icon
                                        name='circle'
                                        size='small'
                                        color='green'
                                      />
                                    )}
                                </Comment.Author>

                                <Comment.Metadata>
                                  <div>{moment(chat.date).fromNow()}</div>
                                  <div
                                    style={{
                                      position: 'absolute',
                                      right: '2px',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Tooltip title='Delete chat?'>
                                      <Icon
                                        name='trash alternate'
                                        color='red'
                                        className='me-auto'
                                        onClick={() =>
                                          deleteMessage(chat.messagesWith)
                                        }
                                      />
                                    </Tooltip>
                                  </div>
                                </Comment.Metadata>

                                <Comment.Text>
                                  {chat.lastMessage.length > 20
                                    ? `${chat.lastMessage.substring(0, 20)} ...`
                                    : chat.lastMessage}
                                </Comment.Text>
                              </Comment.Content>
                            </Comment>
                          </Comment.Group>
                        </List.Item>
                        {loading && hasMore && (
                          <div className='demo-loading-container'>
                            <Spin />
                          </div>
                        )}
                      </List>
                      <Divider />
                    </div>
                  );
                })}
              </InfiniteScroll>
            </div>
          </>
        </div>
      </div>

      <div className='col-md-8 mb-5'>
        {message && (
          <div className='card rounded-0 profile-card card-shadow'>
            {message && (
              <Link to={`/user/${message}`}>
                <div className='d-flex align-items-center card-header profile-card p-3'>
                  <Avatar src={photo}>{name[0]}</Avatar>
                  <p
                    className='text-center ms-3 text-dark1'
                    style={{ fontWeight: '600' }}
                  >
                    {name}
                  </p>
                </div>
              </Link>
            )}
            <div
              className='card-body'
              style={{
                overflow: 'auto',
                overflowX: 'hidden',
                maxHeight: '35rem',
                height: '35rem',
              }}
            >
              {messages.map((message, i) => (
                <Message
                  divRef={divRef}
                  key={i}
                  bannerProfilePic={photo === undefined ? '' : photo}
                  message={message}
                  user={user}
                  setMessages={setMessages}
                  deleteMsg={deleteMsg}
                />
              ))}
            </div>
            <MessageInputField sendMsg={sendMsg} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
