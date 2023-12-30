
import AuthPage from './_auth/AuthPage'
import SignInForm from './_auth/component/SignInForm'
import SignUpForm from './_auth/component/SignUpForm'
import './globals.css'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Rootlayout from './layout/Rootlayout'
import { AllUsers, CreatePost, Explore, Home, PostDetails, Profile, Saved, UpdatePost, UpdateProfile } from './_root/pages'
import { Toaster } from "@/components/ui/toaster"

const App = () => {
  return (
    <>
  
    <main className='flex h-screen'>
     <Routes>
      {/* Public Page */}
      <Route element={<AuthPage/>}>
        <Route path='/sign-in' element={<SignInForm/>}/>
        <Route path='/sign-up' element={<SignUpForm/>}/>
      </Route>
      {/* Private Page */}
      <Route element={<Rootlayout/>}>
      <Route index element={<Home/>}/>
      <Route path="/explore" element={<Explore/>} />
          <Route path="/saved" element={<Saved/>} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<UpdatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
      </Route>
    
     
      
     </Routes>
     </main>
     <Toaster />
    
    </>
  )
}

export default App