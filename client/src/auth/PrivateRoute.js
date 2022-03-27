import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../actions/auth';

const PrivateRoute = ({ ...rest }) => {
  const user = isAuthenticated().user;
  const token = isAuthenticated().token;

  return user && token ? <Route {...rest} /> : <Redirect to='/login' />;
};

export default PrivateRoute;
