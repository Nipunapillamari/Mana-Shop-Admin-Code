import React from 'react'
import { Link } from "react-router-dom"
import add_product from "../../assets/Product_Cart.svg"
import list_product from "../../assets/Product_list_icon.svg"
import "./Sidebar.css"

const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className='sidebar-container'>
                <Link to={"/dashboard"} style={{ textDecoration: "none" }}>
                    <div className='sidebar-item'>
                        <svg className='sidebar-icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 13H10C10.55 13 11 12.55 11 12V4C11 3.45 10.55 3 10 3H4C3.45 3 3 3.45 3 4V12C3 12.55 3.45 13 4 13ZM4 21H10C10.55 21 11 20.55 11 20V16C11 15.45 10.55 15 10 15H4C3.45 15 3 15.45 3 16V20C3 20.55 3.45 21 4 21ZM14 21H20C20.55 21 21 20.55 21 20V12C21 11.45 20.55 11 20 11H14C13.45 11 13 11.45 13 12V20C13 20.55 13.45 21 14 21ZM13 4V8C13 8.55 13.45 9 14 9H20C20.55 9 21 8.55 21 8V4C21 3.45 20.55 3 20 3H14C13.45 3 13 3.45 13 4Z" fill="currentColor"/>
                        </svg>
                        <p className='sidebar-text'>Dashboard</p>
                    </div>
                </Link>
                <Link to={"/supercategory"} style={{ textDecoration: "none" }}>
                    <div className='sidebar-item'>
                        <svg className='sidebar-icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7C6.45 12 6 11.55 6 11C6 10.45 6.45 10 7 10H17C17.55 10 18 10.45 18 11C18 11.55 17.55 12 17 12ZM13 16H7C6.45 16 6 15.55 6 15C6 14.45 6.45 14 7 14H13C13.55 14 14 14.45 14 15C14 15.55 13.55 16 13 16Z" fill="currentColor"/>
                        </svg>
                        <p className='sidebar-text'>Super Category</p>
                    </div>
                </Link>
                <Link to={"/category"} style={{ textDecoration: "none" }}>
                    <div className='sidebar-item'>
                        <svg className='sidebar-icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3H4C3.45 3 3 3.45 3 4V10C3 10.55 3.45 11 4 11H10C10.55 11 11 10.55 11 10V4C11 3.45 10.55 3 10 3ZM10 13H4C3.45 13 3 13.45 3 14V20C3 20.55 3.45 21 4 21H10C10.55 21 11 20.55 11 20V14C11 13.45 10.55 13 10 13ZM20 3H14C13.45 3 13 3.45 13 4V10C13 10.55 13.45 11 14 11H20C20.55 11 21 10.55 21 10V4C21 3.45 20.55 3 20 3ZM17 17C15.9 17 15 17.9 15 19C15 20.1 15.9 21 17 21C18.1 21 19 20.1 19 19C19 17.9 18.1 17 17 17ZM17 13C15.9 13 15 13.9 15 15C15 16.1 15.9 17 17 17C18.1 17 19 16.1 19 15C19 13.9 18.1 13 17 13Z" fill="currentColor"/>
                        </svg>
                        <p className='sidebar-text'>Category</p>
                    </div>
                </Link>
                <Link to={"/subcategory"} style={{ textDecoration: "none" }}>
                    <div className='sidebar-item'>
                        <svg className='sidebar-icon' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2ZM12 5.29L16.14 16.5L12 14.79L7.86 16.5L12 5.29Z" fill="currentColor"/>
                        </svg>
                        <p className='sidebar-text'>Sub Category</p>
                    </div>
                </Link>
                <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
                    <div className='sidebar-item'>
                        <img src={add_product} alt="" className='sidebar-icon' />
                        <p className='sidebar-text'>Add Product</p>
                    </div>
                </Link>
                <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
                    <div className='sidebar-item'>
                        <img src={list_product} alt="" className='sidebar-icon' />
                        <p className='sidebar-text'>Product List</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Sidebar