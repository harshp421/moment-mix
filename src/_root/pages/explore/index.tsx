import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResult from "@/components/shared/SearchResult";
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPost } from "@/lib/react-query/queriesAndMutations";
import {useIntersectionObserver} from 'react-intersection-observer-hook'
import { useEffect, useState } from "react";


const Explore = () => {
  const [ref, { entry }] = useIntersectionObserver();
  const isVisible = entry && entry.isIntersecting;

  const {data:posts,fetchNextPage,hasNextPage}=useGetPosts();
  console.log(hasNextPage,"op");
  
  const [searchValue, setSearchValue] = useState('');
  const debounceValue=useDebounce(searchValue,500 )
  const {data:searchedPosts,isFetching:isSearchFetching }=useSearchPost(debounceValue);

  useEffect(() => {
    if(isVisible && !searchValue) fetchNextPage();
  }, [searchValue,isVisible])
  
  if(!posts)
  {
    return (<div className="w-full h-full flex-center">
      <Loader/>
    </div>)
  }
  const shouldShowSearchResult = searchValue !== '';
  const shouldShowPost = !shouldShowSearchResult && posts?.pages.every((item) => item?.documents.length === 0);
  return <div className="explore-container">
    <div className="explore-inner_container">
      <h2 className="h3-bold md:h2-bold w-full">
        Search Post
      </h2>
      <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
        <img src="/assets/icons/search.svg" alt="search icon" width={24} height={24} />
        <input type="text" placeholder="search" className="explore-search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
      </div>
    </div>

    <div className="flex-between w-full max-w-5xl mt-16 mb-7">
      <h3 className="body-bold md:h3-bold">Populer Today</h3>
      <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 curser-pointer">
        <p className="small-mediumm md:base-medium text-light-2">All</p>
        <img
          src="/assets/icons/filter.svg"
          width={20}
          height={20}
          alt='filter'
        />
      </div>
    </div>

    <div className="flex flex-wrap gap-9 w-full max-w-5xl">
    { shouldShowSearchResult ? (
          <SearchResult
          isSearchFetching={isSearchFetching}
          searchedPosts={searchedPosts}
          />
        ) : shouldShowPost ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item.documents} />
          ))
        )}
    </div>

    {
      hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader/>
        </div>
      )
    }
  </div>
}
export default Explore;