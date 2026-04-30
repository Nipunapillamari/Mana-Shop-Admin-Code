import { Routes, Route } from 'react-router-dom'
import Sidebar from '../../components/sidebar/Sidebar'
import AddProduct from '../../components/addproduct/AddProduct'
import Dashboard from '../../components/dashboard/Dashboard'
import SuperCat from '../../components/supercategory/SuperCat'
import Category from '../../components/category/Category'
import SubCat from '../../components/subcategory/SubCat'

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar/>

      <div className='admin-content'>
        <Routes>
          <Route path='addproduct' element={<AddProduct/>}/>
          <Route path='listproduct' element={<ListProduct/>}/>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path='supercategory' element={<SuperCat/>}/>
          <Route path='category' element={<Category/>}/>
          <Route path='subcategory' element={<SubCat/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default Admin