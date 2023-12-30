import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  QueryClient,
} from "@tanstack/react-query";
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser,getInfinitePosts, getPostById, getResentPost, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from "../appwrite/api";
import { INewPost, INewUser, IUpdatePost } from "@/type";
import { QUERY_KEYS } from "./queryKeys";
import { UpdatePost } from "@/_root/pages";


//for creating user
export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};
// for user SignIn
export const useSignInAccountMutation = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};
// for signout 
export const useSignOutAccountMutation=()=>{
    return useMutation({
        mutationFn:signOutAccount,
    })
}
export const useCratePostMutation=()=>{
  const queryClient=useQueryClient();
  return useMutation({
    mutationFn:(post:INewPost)=>createPost(post),
    onSuccess:()=>{
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
       })
    }
  })
}

//home page post
export const useGetResentPost=()=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
    queryFn:getResentPost,
  })
}
export const useLikePost=()=>{
  const queryClient=useQueryClient();
  return useMutation({
    mutationFn:({postId,likeArray}:{postId:string,likeArray:string[]})=>likePost(postId,likeArray),
    onSuccess:(data)=>{
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
       })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
       })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POSTS]
       })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
       })
    }
  })
}



export const useSavePost=()=>{
  const queryClient=useQueryClient();
  return useMutation({
    mutationFn:({postId,userId}:{postId:string,userId:string})=>savePost(postId,userId),
    onSuccess:()=>{
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
       })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POSTS]
       })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
       })
    }
  })
}


export const useDeleteSevedPost=()=>{
  const queryClient=useQueryClient();
  return useMutation({
    mutationFn:(savedRecordId:string)=>deleteSavedPost(savedRecordId),
    onSuccess:()=>{
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
       })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_POSTS]
       })
       queryClient.invalidateQueries({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER]
       })
    }
  })
}
export const useGetCurrentUser=()=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_CURRENT_USER],
    queryFn:getCurrentUser
  })
}

//get post by id 
export const useGetPostById=(postId:string)=>{
  return useQuery({
    queryKey:[QUERY_KEYS.GET_POST_BY_ID,postId],
    queryFn:()=>getPostById(postId),
    enabled:!!postId
  })
}

export const useUpdatePost=()=>{
  const queryClient=useQueryClient();
   return useMutation({
    mutationFn:(post:IUpdatePost)=>updatePost(post),
    onSuccess:(data)=>{
     queryClient.invalidateQueries({
      queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
     })
    }
   })
}

export const useDeletePost=()=>{
  const queryClient=useQueryClient();
   return useMutation({
    mutationFn:({postId,imageId}:{postId:string,imageId:string})=>deletePost(postId,imageId),
    onSuccess:()=>{
     queryClient.invalidateQueries({
      queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
     })
    }
   })
}

// form infinitepost
export const useGetPosts = () => {
  return useInfiniteQuery(
    {
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: getInfinitePosts as any,
    getNextPageParam: (lastPage: any) => {
      // If there's no data, there are no more pages.
      if (lastPage && lastPage.documents.length === 0) {
        return null;
      }

      // Use the $id of the last document as the cursor.
      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

// for search post by searchterm
export const useSearchPost=(searchTurm:string)=>{
   return useQuery({
    queryKey:[QUERY_KEYS.SEARCH_POSTS,searchTurm],
    queryFn:()=>searchPosts(searchTurm),
    enabled: !!searchTurm
   })
}