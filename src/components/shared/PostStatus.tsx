import { useUserContect } from '@/context/AuthContext';
import { useDeleteSevedPost, useGetCurrentUser, useLikePost, useSavePost } from '@/lib/react-query/queriesAndMutations';
import { checkIsLiked } from '@/lib/utils';
import { Models } from 'appwrite'
import React, { useEffect, useState } from 'react'
import Loader from './Loader';


type PostStateProp={
    post?:Models.Document;
     userId:string;
}
const PostStatus = ({post,userId}:PostStateProp) => {
    
    const likesList=post?.likes.map((user:Models.Document)=>user.$id);
    


    const [likes, setLikes] = useState(likesList);
    const [isSeved, setisSeved] = useState(false);


    const{mutate:savePost,isPending:isSavingPost}=useSavePost();
    const{mutate:likePost}=useLikePost();
    const{mutate:deletesavedPost,isPending:isDeletingPost}=useDeleteSevedPost();
    const {data:currentUser}=useGetCurrentUser();
    const sevedPostRecord=currentUser?.save.find((record:Models.Document)=>record.post.$id===post?.$id);
    useEffect(() => {
       setisSeved(!!sevedPostRecord)
    }, [currentUser])
    

    const handleLikePost=(e:React.MouseEvent)=>{
        e.stopPropagation();
        let newLikes=[...likes];
        const hasLikes=newLikes.includes(userId);
        if(hasLikes)
        {
            newLikes=newLikes.filter((id)=>id!==userId);
        }else{
            newLikes.push(userId)
        }
        setLikes(newLikes);
        likePost({postId:post?.$id || '',likeArray:newLikes})
    }
    const handleSavePost=(e:React.MouseEvent)=>{
        e.stopPropagation();
       
        if(sevedPostRecord)
        {
            setisSeved(false);
            deletesavedPost(sevedPostRecord.$id)
        }
        else
        {
            savePost({postId:post?.$id || " ",userId})
            setisSeved(true);
        }

       
     
    }
  return (
     <div className='flex justify-between item-center z-20'>
        <div className="flex gap-2 mr-2">
            <img
              src= {checkIsLiked(likes,userId)?'/assets/icons/liked.svg':'/assets/icons/like.svg'}
              alt="liked"
              height={20}
              width={20}
              onClick={handleLikePost}
              className='cursor-pointer'
            />
            <p className='small-medium lg:base-medium'>{likes.length}</p>
        </div>
        <div className="flex gap-2 ">
          {isSavingPost || isDeletingPost ?<Loader/> :  <img
            src= {isSeved?'/assets/icons/saved.svg':'/assets/icons/save.svg'}
              alt="saved"
              height={20}
              width={20}
              onClick={handleSavePost}
              className='cursor-pointer'
            />}
            {/* <p className='small-medium lg:base-medium'>20</p> */}
        </div>
     </div>
  )
}

export default PostStatus