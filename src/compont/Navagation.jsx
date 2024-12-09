import { Link } from 'react-router-dom'
import './Navagation.css'

export default function Navagation() {
    
  return (
    <div>
        <div className="navigation">
            <ul>
                <li>
                    <a href="#">
                        <span className="icon material-symbols-outlined">bolt</span>
                        <span className="title fs-5">Company</span>
                    </a>
                    <hr className='col-9 m-auto text-light'/>
                </li>
                <li className="hovered">
                    <Link to={"/"}>
                        <span className="icon material-symbols-outlined">home</span>
                        <span className="title">Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/employees"}>
                    <span className="icon material-symbols-outlined">person_apron</span>
                        <span className="title">Employees</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/client"}>
                        <span className="icon material-symbols-outlined">group</span>
                        <span className="title">Client</span>
                    </Link>
                </li>
                <li>
                    {/* products */}
                    <Link to={"/products"}> 
                    <span className="icon material-symbols-outlined">production_quantity_limits</span>
                        <span className="title">Products</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/report"}>
                    <span className="icon material-symbols-outlined">attach_money</span>
                        <span className="title">Sales</span>
                    </Link>
                </li>               
                <li>
                    <Link to={""}>
                        <span className="icon material-symbols-outlined">settings</span>
                        <span className="title">Settings</span>
                    </Link>
                </li>
                <li>
                    <Link to={"/signin"} onClick={() => localStorage.removeItem('user')}>
                        <span className="icon material-symbols-outlined">logout</span>
                        <span className="title">Sign Out</span>
                    </Link>
                </li>
            </ul>
        </div>
    </div>
  )
}
