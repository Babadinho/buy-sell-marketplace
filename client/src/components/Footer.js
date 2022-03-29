import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <footer className='new_footer_area bg_color'>
        <div className='new_footer_top'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-md-3 mb-4'>
                <div
                  className='f_widget company_widget wow fadeInLeft'
                  data-wow-delay='0.2s'
                >
                  <h3 className='f-title f_600 t_color f_size_18'>
                    Get in Touch
                  </h3>
                  <p>Don’t miss any updates. Get in touch now!</p>
                  <form className='d-flex flex-nowrap' style={{ width: '90%' }}>
                    <input
                      type='text'
                      className='form-control rounded-0 shadow-none'
                      placeholder='Email'
                      style={{ width: '90%' }}
                    />
                    <button
                      className='btn btn-sm btn-primary rounded-0'
                      type='submit'
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
              <div className='col-md-3 mb-4'>
                <div className='f_widget about-widget'>
                  <h3 className='f-title f_600 t_color f_size_18'>Download</h3>
                  <ul className='list-unstyled f_list'>
                    <li>
                      <Link to='/' className='text-decoration-none'>
                        Company
                      </Link>
                    </li>
                    <li>
                      <Link to='/' className='text-decoration-none'>
                        Android App
                      </Link>
                    </li>
                    <li>
                      <Link to='/' className='text-decoration-none'>
                        ios App
                      </Link>
                    </li>
                    <li>
                      <Link to='/' className='text-decoration-none'>
                        Desktop
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='col-md-3 mb-4'>
                <div className='f_widget about-widget'>
                  <h3 className='f-title f_600 t_color f_size_18'>Help</h3>
                  <ul className='list-unstyled f_list'>
                    <li>
                      <Link to='/' className='text-decoration-none'>
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link to='/' className='text-decoration-none'>
                        Term &amp; conditions
                      </Link>
                    </li>
                    <li>
                      <Link to='/' className='text-decoration-none'>
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link to='/' className='text-decoration-none'>
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className='col-md-3 mb-4'>
                <div className='f_widget social-widget'>
                  <h3 className='f-title f_600 t_color f_size_18'>
                    Give us a Follow
                  </h3>
                  <div className='f_social_icon'>
                    <Link
                      to='/'
                      className='fab fa-facebook text-decoration-none'
                    ></Link>
                    <Link
                      to='/'
                      className='fab fa-twitter text-decoration-none'
                    ></Link>
                    <Link
                      to='/'
                      className='fab fa-linkedin text-decoration-none'
                    ></Link>
                    <Link
                      to='/'
                      className='fab fa-pinterest text-decoration-none'
                    ></Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='footer_bottom'>
          <div className='container'>
            <div className='text-center'>
              <p className='mb-0 f_400'>
                © Buy-and-Sell. 2022 All rights reserved.
              </p>
              <p>
                Built with <i class='fa fa-heart text-danger'></i> by{' '}
                <strong>
                  <a
                    href='https://github.com/Babadinho'
                    target='_blank'
                    className='text-danger'
                  >
                    Babadinho
                  </a>
                </strong>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
