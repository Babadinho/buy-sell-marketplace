import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { reportProduct } from '../actions/product';
import { isAuthenticated } from '../actions/auth';

const ReportProduct = ({ product, productId, productReports, setReported }) => {
  const { user } = isAuthenticated();
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState({
    reason: '',
    details: '',
    product: productId,
    author: user._id,
  });

  const { reason, details } = report;

  const handleModal = () => {
    setShowModal(true);
  };

  const handleReport = async () => {
    if (reason === '') {
      return message.error('Select a reason for this report');
    }
    const res = await reportProduct(productId, report);
    setShowModal(false);
    setReported(true);
    message.success(`You reported ${product.name}`);
  };

  const handleCancel = () => {
    setShowModal(false);
  };
  const handleReason = (e) => {
    setReport({ ...report, reason: e.target.value });
  };
  const handleDetails = (e) => {
    setReport({ ...report, details: e.target.value });
  };

  return (
    <div>
      <div className='card rounded-0 profile-card mt-3 p-3'>
        <button
          className={
            productReports.includes(user._id)
              ? 'btn btn-danger form-control disabled rounded-0'
              : 'btn btn-danger form-control rounded-0'
          }
          onClick={handleModal}
        >
          <i class='far fa-flag'></i>{' '}
          {productReports.includes(user._id) ? (
            <>You reported this product</>
          ) : (
            <>Report this Product</>
          )}
        </button>
      </div>

      <Modal
        title={`Report - '${product.name}'`}
        visible={showModal}
        onOk={handleReport}
        onCancel={handleCancel}
        okText='Report'
        closable={false}
      >
        <select
          className='form-select rounded-0 shadow-none mb-1'
          aria-label='Default select example'
          onChange={handleReason}
        >
          <option selected disabled>
            Select reason
          </option>
          <option value='Product is illegal'>Product is illegal</option>
          <option value='Product is spam'>Product is spam</option>
          <option value='Wrongly categorised'>Wrongly categorised</option>
          <option value='Seller asked for prepayment'>
            Seller asked for prepayment
          </option>
          <option value='Product is already sold'>
            Product is already sold
          </option>
          <option value='Seller unreachable'>Seller unreachable</option>
          <option value='Other'>Other</option>
        </select>

        <textarea
          onChange={handleDetails}
          className='form-control rounded-0 shadow-none'
          rows='4'
          placeholder='more datails about this report'
        ></textarea>
      </Modal>
    </div>
  );
};

export default ReportProduct;
