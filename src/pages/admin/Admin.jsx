import { Routes, Route } from 'react-router-dom'
import Sidebar from '../../components/sidebar'
import AddProduct from '../../components/addproduct'
import Dashboard from '../../components/dashboard'
import SuperCat from '../../components/supercategory'
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