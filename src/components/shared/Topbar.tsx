import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccountMutation } from '@/lib/react-query/queriesAndMutations'
import { useUserContect } from '@/context/AuthContext'

const Topbar = () => {
    const navigate=useNavigate();
     const {mutateAsync:signOut,isSuccess}=useSignOutAccountMutation();
     const {user}=useUserContect();
     useEffect(()=>{
        if(isSuccess)navigate(0)
     },[isSuccess])
  return (
    <section className='topbar'>
          <div className="flex-between py-3 px-5">
            <Link to='/' className='flex gap-3 items-center'>
                <img
                src='/assets/icons/logo_white.png' 
                alt='logo'
                width={130}
                height={325}
                />
            </Link>
         
         <div className="flex gap-2">
            <Button variant={"ghost"} className='shad-button_ghost' onClick={()=>signOut()}>
               <img src="/assets/icons/logout.svg" alt="logout"  />
            </Button>
            <Link to={`/profile/${user.id}`} className='flex-center gap-2'>
                <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                 alt='image'
                 className='rounded-full h-8  w-8'

                />
            </Link>
         </div>

        </div>


    </section>
  )
}

export default Topbar