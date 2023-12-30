import { INewPost, INewUser, IUpdatePost } from "@/type";
import { account, appwriteConfig, avatar, db, storage } from "./config";
import { Databases, ID, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatar.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      userName: user.userName,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return Error;
  }
}

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  userName?: string;
}) {
  try {
    const newUser = await db.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}
//get current user
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error, "error");
    return null;
  }
}
//signOut Account
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

//Create post
export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // get uploaded file Url
    const fileUrl = getFilePreview(uploadedFile.$id);

    //if thair is no file url delete the file
    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }
    //convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //save new post to database
    const newPost = await db.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );
    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }
    return newPost;
  } catch (error) {
    console.log("error", error);
  }
}

//update post
export async function updatePost(post: IUpdatePost) {
  console.log(post,"post");
  
  const hasFileToUpdate = post.file.length > 0;
   console.log(hasFileToUpdate);
   
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;


      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    //  Update post
    const updatedPost = await db.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    console.log(updatedPost,"updatedpost");
    

    // Failed to update
    if (!updatedPost) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }
   
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}


// for delete post

export async function deletePost(postId:string,imageId:string) {
  if(!postId || !imageId) throw Error
  try{
    await db.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return {status:'ok'}

  }catch(error)
  {
    console.log(error);
    
  }
}
// for upload file /imaage
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {}
}
//geeeting preview of file
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}
// deleting the file
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "File Is deleted " };
  } catch (error) {
    console.log(error);
  }
}
// for geetting resent post
export async function getResentPost() {
  const posts = await db.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  console.log(posts, "post api");

  if (!posts) throw Error;
  return posts;
}
// for like the post
export async function likePost(postId: string, likeArray: string[]) {
  try {
    const updatedPost = await db.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likeArray,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// for save  the post
export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await db.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// delete saved post
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await db.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}
// get post information by id 
export async function getPostById(id:string) {
   try
   {
     const post =await db.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      id
     )
     console.log(post);
     
     return post;
   }catch(error)
   {
    console.log(error,"error");
    
   }
}


export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  
  try {
    const posts = await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
// get search Result
export async function searchPosts(searchTerm:string) {
  try{
    const posts=await db.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption',searchTerm)]
      )
    if(!posts) throw Error;
    return posts;
  }catch(error)
  {
    console.log(error,"error");
    
  }
}