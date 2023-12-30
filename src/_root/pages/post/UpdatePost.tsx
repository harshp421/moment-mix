import React from 'react'
import PostForm from '@/components/forms/PostForm'
import { useParams } from 'react-router-dom';
import { useGetPostById } from '@/lib/react-query/queriesAndMutations';
import Loader from '@/components/shared/Loader';


const UpdatePost = () => {
  const {id}=useParams();
  const{data:post,isPending}=useGetPostById(id || '');
  if(isPending)return<Loader/>

  return (
    <div className='flex flex-1'>
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src='/assets/icons/add-post.svg'
            alt='add-post'
            height={36}
            width={36}
          />
          <h2 className="h3-bold md:12-bold text-left w-full">
            Update Post
          </h2>

        </div>
        <PostForm action="Update" post={post}/>
      </div>
    </div>
  )
}

export default UpdatePost