import { useEffect } from "react";
import './Employees.css';
import './HomePage.css';
import Navagation from "../compont/Navagation";
import Navbar from "../compont/Navbar";
import Charts from "../compont/Charts";
import AOS from 'aos';
import 'aos/dist/aos.css';
export default function HomePage() {

    useEffect(() => {
        AOS.init({
            once: true,
            disable: "phone",
            duration: 800,
            easing: "ease-out-cubic",
        });
      }, [])
    const addHoverEffectToLinks = () => {
        const list = document.querySelectorAll('.navigation li');
        const activeLink = function () {
            list.forEach(item => item.classList.remove("hovered"));
            this.classList.add('hovered');
        };
        list.forEach(item => item.addEventListener('mouseover', activeLink));

        // Cleanup function to remove event listeners on unmount
        return () => list.forEach(item => item.removeEventListener('mouseover', activeLink));
    };

    const setupToggleMenu = () => {
        const toggle = document.querySelector('.toggle');
        const navigation = document.querySelector('.navigation');
        const main = document.querySelector('.main');
        
        const handleToggle = () => {
            navigation.classList.toggle('hide');
            main.classList.toggle('navigation-hide');
        };

        if (toggle) {
            toggle.addEventListener('click', handleToggle);
        }

        // Cleanup function to remove event listener on unmount
        return () => {
            if (toggle) {
                toggle.removeEventListener('click', handleToggle);
            }
        };
    };

    useEffect(() => {
        const cleanupHoverEffect = addHoverEffectToLinks();
        const cleanupToggleMenu = setupToggleMenu();

        // Cleanup all event listeners on component unmount
        return () => {
            cleanupHoverEffect();
            cleanupToggleMenu();
        };
    }, []);

    return (
        <div className="container-fluid">
            <Navagation />           
            <div className="main mt-4 rounded-5">
                <Navbar />
                <div className="cardBox">
                    <div className="card" data-aos="fade-up-right" data-aos-offset="300"data-aos-easing="ease-in-sine">
                        <div className="iconBox">
                            <span className="material-symbols-outlined" style={{color: '#2e96ff'}}>shopping_cart</span>
                        </div>
                        <div>
                            <div className="numbers">1,504</div>
                            <div className="cardName">Item Sales</div>
                        </div>                        
                    </div>
                    <div className="card" data-aos="fade-up-left" data-aos-offset="300"data-aos-easing="ease-in-sine">
                    <div className="iconBox">
                        <span className="material-symbols-outlined" style={{color: '#02b2af'}}>inventory_2</span>
                        </div>
                        <div>
                            <div className="numbers">530</div>
                            <div className="cardName">Total Products</div>
                        </div>
                    </div>
                    <div className="card"  data-aos="fade-left" data-aos-offset="300"data-aos-easing="ease-in-sine">
                    <div className="iconBox">
                        <span className="material-symbols-outlined" style={{color: '#b800d8'}}>orders</span>
                        </div>
                        <div>
                            <div className="numbers">283</div>
                            <div className="cardName">New Orders</div>
                        </div>                      
                    </div>
                    <div className="card" data-aos="fade-right" data-aos-offset="300"data-aos-easing="ease-in-sine">
                    <div className="iconBox">
                            <span className="material-symbols-outlined text-success">payments</span>
                        </div>
                        <div>
                            <div className="numbers">$783</div>
                            <div className="cardName">Earnings</div>
                        </div>
                        
                    </div>  
                    <Charts/>                                                                                 
                </div>
            </div>
        </div>
    );
}
