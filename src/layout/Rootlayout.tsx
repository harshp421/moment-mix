import Bottombar from '@/components/shared/Bottombar'
import RightSideBar from '@/components/shared/RightSideBar'
import SideBar from '@/components/shared/SideBar'
import Topbar from '@/components/shared/Topbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Rootlayout = () => {
  return (
    <div className='w-full md:flex'>
      {/* Topbar section */}
      <Topbar />
      {/* left sideBar section */}
      <SideBar />

      <section className='flex flex-1 h-full'>
        <Outlet />
      </section>
      <RightSideBar/>
      {/* Bottom sectio */}
      <Bottombar />
    </div>
  )
}

export default Rootlayout