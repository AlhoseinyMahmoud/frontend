import {useEffect } from "react";

import Navagation from "../compont/Navagation";
import Navbar from "../compont/Navbar";
import AOS from 'aos';
import 'aos/dist/aos.css';
import TableRepo from "../compont/TableRepo";
export default function Report() {
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
        <TableRepo/>
      </div>
    </div>
  );
}
