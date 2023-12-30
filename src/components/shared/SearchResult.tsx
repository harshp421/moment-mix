import { Models } from 'appwrite';
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultProps={
  isSearchFetching:boolean;
  searchedPosts:Models.Document[];
}
const SearchResult = ({isSearchFetching,searchedPosts}:SearchResultProps) => {
  console.log(searchedPosts,isSearchFetching,"serach post");
  
  if(isSearchFetching) return <Loader/>

  if(searchedPosts && searchedPosts?.documents.length>0)
  {
    return (
      <GridPostList posts={searchedPosts?.documents}/>
    )
  }
  return (
    <p className='text-light-4 mt-10 text-center w-full'>No Result Found</p>
  )
}

export default SearchResult