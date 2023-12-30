import { sidebarLinks } from '@/constant';
import { INITIAL_USER, useUserContect } from '@/context/AuthContext';
import { useSignOutAccountMutation } from '@/lib/react-query/queriesAndMutations';
import { INavLink } from '@/type';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button';

const SideBar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { mutateAsync: signOut, isSuccess } = useSignOutAccountMutation();
    const { user,setIsAuthenticated,setUser } = useUserContect();
   
    const handleSignOut = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
      ) => {
        e.preventDefault();
        signOut();
        setIsAuthenticated(false);
        setUser(INITIAL_USER );
        navigate("/sign-in");
      };
    return (
        <nav className='leftsidebar'>
            <div className="flex flex-col gap-6">
                <Link to='/' className='flex gap-3 items-center'>
                    <img
                        src='/assets/icons/logo_white.png'
                        alt='logo'
                        width={230}
                        height={36}
                    />
                </Link>

                <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
                    <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
                        alt='image'
                        className='rounded-full h-14 w-14'
                    />
                    <div className="flex flex-col">
                        <p className="body-bold">
                            {user.name}
                        </p>
                        <p className="small-regular text-light-3">@{user.userName}</p>
                    </div>
                </Link>

                <ul className="flex flex-col gap-4">
                    {
                        sidebarLinks.map((link: INavLink) => {
                            const isActive = pathname === link.route;
                            return <li className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`} key={link.route}>
                                <NavLink to={link.route} className="flex gap-2 items-center p-4">
                                    <img src={link.imgURL} alt="icon" className={`group-hover:invert-white ${isActive && 'invert-white'}`} />
                                    {link.label}
                                </NavLink>
                            </li>
                        })
                    }
                </ul>

            </div>

            <Button
                variant="ghost"
                className="shad-button_ghost"
                onClick={(e) => handleSignOut(e)}>
                <img src="/assets/icons/logout.svg" alt="logout" />
                <p className="small-medium lg:base-medium">Logout</p>
            </Button>
        </nav>
    )
}

export default SideBar