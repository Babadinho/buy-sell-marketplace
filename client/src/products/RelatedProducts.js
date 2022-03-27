import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'react-multi-carousel/lib/styles.css';
import { Tooltip } from 'antd';
import { relatedProducts } from '../actions/product';
import Slider from 'react-slick';

const RelatedProducts = ({ category }) => {
  const [related, setRelated] = useState([]);

  const loadRelated = async () => {
    const res = await relatedProducts(category);
    setRelated(res.data);
  };

  useEffect(() => {
    loadRelated();
  }, []);

  //format currency
  Number.prototype.format = function (n, x) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
  };

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 3,
    centerPadding: '60px',
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          initialSlide: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          initialSlide: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <div>
        <h3 className='text-dark1 mb-3 mt-3 ms-2' style={{ fontSize: '22px' }}>
          Related Products
        </h3>
      </div>
      <Slider {...settings}>
        {related.map((p, i) => {
          if (p.status === 'active') {
            return (
              <div key={i}>
                <div
                  className='card card-shadow mb-4'
                  style={{ width: '21rem' }}
                >
                  <div className='product-img1'>
                    <Link
                      to={`/product/${p._id}`}
                      className='text-decoration-none'
                    >
                      <img
                        src={p.images[0]}
                        className='card-img-top img-top-related'
                        alt={p.name}
                        style={{
                          borderBottom: '1px solid rgba(0,0,0,.125)',
                        }}
                      />
                      <span className='product-img-count'>
                        <span className='badge badge-pill opacity'>
                          {p.images.length}
                          <i class='fas fa-images ps-1'></i>
                        </span>
                      </span>
                    </Link>
                  </div>
                  <div className='card-body pb-0'>
                    <div className='d-flex justify-content-between flex-wrap'>
                      <Tooltip title={p.name}>
                        <Link
                          to={`/product/${p._id}`}
                          className='text-decoration-none'
                        >
                          <p class='card-title text-dark1 card-text-title'>
                            {p.name}
                          </p>
                        </Link>
                      </Tooltip>
                      <span>
                        <p className='text-success'>
                          ₦{parseInt(p.price).format()}
                        </p>
                      </span>
                    </div>
                    <span class='card-text d-flex justify-content-between mt-2'>
                      <Link
                        to={`/search-result?location=${p.location._id}&category=&name=&price=&condition=`}
                        className='text-decoration-none'
                      >
                        <small class='text-muted'>
                          <p className='text-muted'>
                            <i class='fas fa-map-marker-alt me-2'></i>
                            {p.location.name}
                          </p>
                        </small>
                      </Link>
                      <small class='text-muted'>
                        Seller:{' '}
                        <Link
                          to={`/user/${p.author._id}`}
                          className='text-decoration-none text-dark1'
                        >
                          {p.author.name}
                        </Link>
                      </small>
                    </span>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </Slider>
    </div>
  );
};

export default RelatedProducts;
