import { HashRouter as BrowserRouter, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
import { isAuthenticated } from './actions/auth';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap';
import 'semantic-ui-css/semantic.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// components
import NavMenu from './components/NavMenu';
import Login from './auth/Login';
import Register from './auth/Register';
import Home from './components/Home';
import UserDashboard from './user/UserDashboard';
import BusinessInfo from './user/BusinessInfo';
import AdminDashboard from './admin/AdminDashboard';
import AddCategory from './admin/AddCategory';
import AddLocation from './admin/AddLocation';
import EditLocation from './admin/EditLocation';
import EditCategory from './admin/EditCategory';
import ManageUsers from './admin/ManageUsers';
import AllProducts from './admin/AllProducts';
import ReportedProducts from './admin/ReportedProducts';
import EditUser from './admin/EditUser';
import PrivateRoute from './auth/PrivateRoute';
import AdminRoute from './auth/AdminRoute';
import EditProfile from './user/EditProfile';
import UpdatePassword from './user/UpdatePassword';
import ViewUser from './user/ViewUser';
import AddButton from './components/AddButton';
import Footer from './components/Footer';
import Default from './components/Default';
import RateUser from './user/RateUser';
import AddProduct from './products/AddProduct';
import EditProduct from './products/EditProduct';
import CategoryView from './category/CategoryView';
import Favourites from './user/Favourites';
import FollowList from './user/FollowList';
import ViewProduct from './products/ViewProduct';
import SearchResult from './components/SearchResult';
import UserNotifications from './notifications/UserNotifications';
import ChatList from './messages/ChatList';
import Chat from './messages/Chat';

function App() {
  const { user } = isAuthenticated();

  return (
    <BrowserRouter>
      <NavMenu />
      <AddButton />
      <Toaster />
      <ToastContainer position='top-center' />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={user ? UserDashboard : Login} />
        <Route
          exact
          path='/register'
          component={user ? UserDashboard : Register}
        />
        <Route exact path='/search-result' component={SearchResult} />
        <Route exact path='/category/:categoryId' component={CategoryView} />
        <Route exact path='/product/:productId' component={ViewProduct} />
        <PrivateRoute exact path='/user/dashboard' component={UserDashboard} />
        <PrivateRoute
          exact
          path='/user/notifications'
          component={UserNotifications}
        />
        <PrivateRoute exact path='/messages' component={ChatList} />
        <PrivateRoute exact path='/user/message/:chatId' component={Chat} />
        <PrivateRoute exact path='/user/business' component={BusinessInfo} />
        <PrivateRoute exact path='/user/follow-list' component={FollowList} />
        <PrivateRoute exact path='/user/favourites' component={Favourites} />
        <PrivateRoute exact path='/user/:userId' component={ViewUser} />
        <PrivateRoute exact path='/rate/user/:userId' component={RateUser} />
        <PrivateRoute exact path='/user/edit/:userId' component={EditProfile} />
        <PrivateRoute
          exact
          path='/user/password/:userId'
          component={UpdatePassword}
        />
        <PrivateRoute
          exact
          path='/add-product/:userId'
          component={AddProduct}
        />
        <PrivateRoute
          exact
          path='/edit-product/:productId'
          component={EditProduct}
        />
        <AdminRoute exact path='/admin/dashboard' component={AdminDashboard} />
        <AdminRoute exact path='/admin/add-category' component={AddCategory} />
        <AdminRoute exact path='/admin/add-location' component={AddLocation} />
        <AdminRoute exact path='/admin/all-products' component={AllProducts} />
        <AdminRoute
          exact
          path='/admin/category/edit/:categoryId'
          component={EditCategory}
        />
        <AdminRoute
          exact
          path='/admin/location/edit/:locationId'
          component={EditLocation}
        />
        <AdminRoute exact path='/admin/users' component={ManageUsers} />
        <AdminRoute
          exact
          path='/admin/reported-products'
          component={ReportedProducts}
        />
        <AdminRoute
          exact
          path='/admin/user/edit/:userId'
          component={EditUser}
        />
        <Route component={Default} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
