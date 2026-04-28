import React from 'react'
import "./Navbar.css"
import nav_logo from "../../assets/nav-logo.svg"
import nav_profile from "../../assets/nav-profile.svg"

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className='nav-container'>
        <div className='nav-left'>
          <img src={nav_logo} alt="Logo" className='nav-logo'/>
        </div>
        
        <div className='nav-right'>
          <div className='nav-profile-container'>
            <img src={nav_profile} alt="Profile" className='nav-profile'/>
            <span className='profile-text'>Account</span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar