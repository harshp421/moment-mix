import { sidebarLinks } from '@/constant';
import { INavLink } from '@/type';
import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom';

const Bottombar = () => {
    const { pathname } = useLocation();
    return (
        <section className='bottom-bar'>
            {
                sidebarLinks.map((link: INavLink) => {
                    const isActive = pathname === link.route;
                    return (
                        <Link to={link.route} className={`${isActive && "rounded-[10px] bg-primary-500 "
                            } flex-center flex-col gap-1 p-2 transition`} key={link.imgURL}>
                            <img
                                src={link.imgURL}
                                alt={link.label}
                                width={16}
                                height={16}
                                className={`${isActive && "invert-white"}`}
                            />

                            <p className="tiny-medium text-light-2">{link.label}</p>
                        </Link>)

                })
            }
        </section>
    )
}

export default Bottombar