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