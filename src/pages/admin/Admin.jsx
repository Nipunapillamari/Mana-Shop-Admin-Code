import React from 'react'
import "./Admin.css"
import Sidebar from '../../components/sidebar/Sidebar'
import {Routes,Route} from "react-router-dom"
import AddProduct from "../../components/addproduct/AddProduct"
import ListProduct from "../../components/listproduct/ListProduct"
import Dashboard from "../../components/dashboard/Dashboard"
import SuperCat from "../../components/supercategory/SuperCat"
import SubCat from "../../components/subcategory/SubCat"
import Category from "../../components/category/Category"



const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>
      <Routes>
       <Route path='addproduct' element={<AddProduct/>}/>
       <Route path='listproduct' element={<ListProduct/>}/>
       <Route path='dashboard' element={<Dashboard/>}/>
       <Route path='supercategory' element={<SuperCat/>}/>
       <Route path='category' element={<Category/>}/>
       <Route path='subcategory' element={<SubCat/>}/>
       


      </Routes>
      
    </div>
  )
}

export default Admin
