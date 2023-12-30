import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import { useGetResentPost } from '@/lib/react-query/queriesAndMutations';
import { Models } from 'appwrite';


const Home = () => {
  const { data: posts, isPending: isPostLoading, isError: isErrorPost } = useGetResentPost();


  return (
    <>
      <div className="flex flex-1">
        <div className="home-container">
          <div className="home-posts">
            <div className="flex-between w-full max-w-5xl mt-16 ">
              <h2 className='h3-bold md:h2-bold text-left W-full '>Home Feed</h2>
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

            {
              isPostLoading && !posts ? (
                <Loader />
              ) : (
                <ul className='flex flex-1 w-full gap-9  flex-col'>
                  {
                    posts?.documents.map((post: Models.Document) => {
                      return <PostCard post={post} key={post.$id} />
                    })
                  }
                </ul>
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}

export default Home