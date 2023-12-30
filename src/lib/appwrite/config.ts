import {Client,Account,Databases,Storage,Avatars} from 'appwrite'

export const appwriteConfig={
    projectID:import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url:import.meta.env.VITE_APPWRITE_URL,
    databaseId:import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId:import.meta.env.VITE_APPWRITE_STORAGE_ID,
    userCollectionId:import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
    savesCollectionId:import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
    postCollectionId:import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID
}

//configar the client 
export const client=new Client();
client
  .setEndpoint(appwriteConfig.url)
  .setProject(appwriteConfig.projectID); 

export const account=new Account(client);
export const db=new Databases(client);
export const storage=new Storage(client);
export const avatar=new Avatars(client);