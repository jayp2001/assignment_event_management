import logo from './logo.svg';
import "@fontsource/poppins"; // Defaults to weight 400
import "@fontsource/poppins/400.css"; // Specify weight
import "@fontsource/poppins/400-italic.css";
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from './pages/login/login';
import PageNotFoundRedirect from './pageNotFound';
import 'react-toastify/dist/ReactToastify.css';
import EventList from './pages/eventList/eventList';
import Navbar from './pages/header/navbar';
import AddEvent from './pages/addEvent/addEvent';
import ProtectedAdminRoutes from './protectedAdminRoutes';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProtectedAdminRoutes />}>
          <Route path='/eventList' exact element={<EventList />} />
          <Route path='/createEvent' exact element={<AddEvent />} />
          <Route path='*' element={<PageNotFoundRedirect />} />
        </Route>
        <Route path='/login' exact element={<LoginPage />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
