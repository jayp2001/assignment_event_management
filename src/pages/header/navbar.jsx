import './navbar.css';
import logo from '../../assets/logo/logo.svg'
import { useLocation } from 'react-router-dom';
function Navbar() {
    const location = useLocation();
    if (location.pathname.toLowerCase() === "/login") {
        return null
    } else
        return (
            <div className='flex headerContainer'>
                <div className='headerLogo'>
                    <img src={logo}></img>
                </div>
                <div className='header self-center ml-4'>
                    Event Management System
                </div>
            </div>
        )
}
export default Navbar;