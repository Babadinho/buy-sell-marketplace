import React, { useEffect, useState, useRef } from 'react';
import { getReportedProducts } from '../actions/product';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useHistory } from 'react-router';
import { isAuthenticated } from '../actions/auth';
import { Card, Avatar, Tooltip, message, Pagination, Popconfirm } from 'antd';
import { approveReport, rejectReport } from '../actions/admin';

const { Meta } = Card;

const ReportedProducts = () => {
  const countPerPage = 5;
  const [reports, setReports] = useState([]);
  const [current, setCurrent] = useState();
  const [report, setReport] = useState(false);
  const [pagination, setPagination] = useState([]);

  const { user, token } = isAuthenticated();

  useEffect(() => {
    loadReports(1);
  }, [report]);

  const loadReports = async (page) => {
    const res = await getReportedProducts();
    setReports(res.data);
    setCurrent(page);
    const to = page * countPerPage;
    const from = to - countPerPage;
    setPagination(res.data.slice(from, to));
  };

  const handleApprove = async (productId) => {
    try {
      const res = await approveReport(productId, token);
      message.success('Report Approved');
      report ? setReport(false) : setReport(true);
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };
  const handleReject = async (productId) => {
    try {
      const res = await rejectReport(productId, token);
      message.success('Report Approved');
      !report ? setReport(true) : setReport(false);
    } catch (err) {
      console.log(err);
      if (err.response.status === 400) message.error(err.response.data, 4);
    }
  };

  const history = useHistory();

  const logout = () => {
    window.localStorage.removeItem('buynsell');
    history.push('/login');
    window.location.reload();
  };
  return (
    <>
      <div className='row container-fluid mx-auto mt-5 profile-container'>
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
          </Card>
          <ul className='list-group rounded-0 profile-list card-shadow'>
            <li className='list-group-item'>
              <Link
                to='/admin/dashboard'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-user-shield'></i> Admin Dashboard
              </Link>
            </li>
            <li className='list-group-item'>
              <Link
                to='/user/dashboard'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-user'></i> User Dashboard
              </Link>
            </li>
            <li className='list-group-item'>
              <Link
                to='/admin/add-category'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-plus-square'></i> Add Category
              </Link>
            </li>
            <li className='list-group-item'>
              <Link
                to='/admin/add-location'
                className='text-dark1 text-decoration-none'
              >
                <i class='fas fa-plus-circle'></i> Add Location
              </Link>
            </li>
            <li
              className='list-group-item text-dark1'
              role='button'
              onClick={logout}
            >
              <i class='fas fa-sign-out-alt'></i> Logout
            </li>
          </ul>
        </div>
        <div className='col-md-9 mb-5'>
          <div className='card rounded-0 profile-card card-shadow'>
            <div className='card-header profile-card p-3'>
              <h2 className='text-center'>
                <Link
                  to='/admin/dashboard'
                  className='text-decoration-none text-dark1'
                >
                  <Tooltip title='Back to Admin'>
                    <span className='category-span'>
                      <i class='fas fa-arrow-circle-left'></i>
                    </span>
                  </Tooltip>
                </Link>
                <i class='fas fa-flag'></i> Reported Products ({reports.length})
              </h2>
            </div>
            <div className='card-body table-responsive'>
              <table class='table'>
                <thead>
                  <tr>
                    <th scope='col'>Product</th>
                    <th scope='col'>Reason</th>
                    <th scope='col'>Details</th>
                    <th scope='col'>Reported By</th>
                    <th scope='col'>Date</th>
                    <th scope='col'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagination.map((r, i) => (
                    <tr key={i}>
                      <td>
                        <Link
                          to={`/product/${r._id}`}
                          className='text-decoration-none text-dark1'
                        >
                          {r.product.name}
                        </Link>
                      </td>
                      <td className='text-dark1'>{r.reason}</td>
                      <td className='text-dark1'>{r.details}</td>
                      <td className='text-dark1'>{r.author.name}</td>
                      <td className='text-dark1'>
                        {moment(r.createdAt).format('M/D/YYYY, h:mm a')}
                      </td>
                      <td className='text-dark1 d-flex justify-content-evenly manage-user-btn'>
                        <span class='btn btn-warning btn-sm text-white pt-0 pb-0'>
                          <Popconfirm
                            placement='top'
                            title={'Are you sure to Approve?'}
                            onConfirm={() => handleApprove(r.product._id)}
                            okText='Yes'
                            cancelText='No'
                          >
                            Approve
                          </Popconfirm>
                        </span>
                        <span class='btn btn-danger btn-sm text-white pt-0 pb-0'>
                          <Popconfirm
                            placement='top'
                            title={'Are you sure to Reject?'}
                            onConfirm={() => handleReject(r.product._id)}
                            okText='Yes'
                            cancelText='No'
                          >
                            Reject
                          </Popconfirm>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                pageSize={countPerPage}
                onChange={loadReports}
                defaultCurrent={current}
                total={reports.length}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportedProducts;
