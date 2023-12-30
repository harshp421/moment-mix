export type INewUser={
  name:string;
  userName:string;
  email:string;
  password:string


}

export type IUser={
    id:string;
    name:string;
    userName:string;
    email:string;
    imageUrl:string;
    bio?:string;

}

export type INavLink={
  
    imgURL:string;
    route: string;
    label: string;
  
}
export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};


export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};
