import AnimatedLogoForAll from "../../static assets/logo_animated/AnimatedLogoForAll";
import {motion} from 'framer-motion'
import {useLoaderData, Outlet, redirect, useLocation} from "react-router-dom";
import {fireStore} from "../../firebaseConfig.ts";
import {getDoc, doc} from 'firebase/firestore'
import {getDownloadURL, ref, getStorage, listAll} from 'firebase/storage'
import type {LoaderFunctionArgs} from "@remix-run/router/utils";
import {navigationTypesDevices,} from './helpersNavbar.tsx'
import React, {memo, useState, useEffect, useMemo} from 'react'
import {Wachlist} from "../crypto_price/apsContent/ApsContentSearch.tsx";
import UserIcon from "./UserIcon.tsx";
import {useLoading} from "../crypto_price/Graph/Graph.tsx";
import Loading from "../error_loading/loadingPage.tsx";
import type {TUserWachlist} from "./UserIcon.tsx";

export type LocatoinInfoThatINeed = {
    pathname: string
}

export interface UserDoc {
    username?: string,
    wachlist?: TUserWachlist | undefined ,
    imgUrl?: string,
    email: string,
    hasCoverPicture: boolean
}

export const loadUser = async ({}: LoaderFunctionArgs): Promise<Pick<UserDoc, 'username' | 'imgUrl' | 'wachlist'> | Response> => {

    const dowloadImgUrl = async (email: string) => {
        try {
            const refImgUrl    = ref(getStorage(fireStore.app), `users/${email}`)
            let pictureRef = ' '
            pictureRef = await getDownloadURL(refImgUrl)
                .catch(err => {
                    throw err
                });
            return pictureRef

        } catch (err) {
            throw err
        }
    }



    const email = window.localStorage.getItem('email')
    if (!email) {
        console.log('tuka vlegvam')
        return redirect('/home')
    }

    try {
        let imgUrl: string = '',
            username : string,
            wachlist: Wachlist

        let user = await getDoc(doc(fireStore, 'users', `${email}`)).then(data => data.data()) as UserDoc


        if (user.hasCoverPicture !== undefined) {
            try {
                imgUrl = await dowloadImgUrl(`${email}`)
            }catch(e) {
                imgUrl = ''
            }
        }

        wachlist = user.wachlist as TUserWachlist
        username = user.username ?? user.email
        return {username, imgUrl, wachlist}

    } catch (err) {
        return redirect('/home')
    }
}
//
const Navbar = memo(() => {

    const [isMobileDevice, setMobileDevice] = useState<0 | 1>(window.innerWidth < 877 ? 1 : 0)
    const user = useLoaderData() as UserDoc
    const locaiton = useLocation() as LocatoinInfoThatINeed
    const {loading, setLoading} = useLoading()

    const [wachlistList, setWachlistList] = useState<string[]|undefined>(!user.wachlist ? undefined :
    Object.keys(user.wachlist).length !== 0 ? Object.keys(user.wachlist) : undefined )
    window.localStorage.removeItem('pop');

    useEffect(() => {
        const funcNavBar = (ev: Event) => {
            ev.stopPropagation();
            ev.preventDefault();
            setMobileDevice(window.innerWidth < 877 ? 1 : 0)
        }
        window.addEventListener('resize', funcNavBar);
        return () => {
            window.removeEventListener('resize', funcNavBar);
        }
    }, []);

    useEffect(() => {
        const root = document.querySelector('#root');
        const body = document.querySelector('body') ;

        if (!root || !body)
            return
        root.classList.add('scroll')
        body.classList.add('scroll')
        return () => {
            root.classList.remove('scroll')
            body.classList.remove('scroll')
        }
    }, []);


    return (
        <>
            <motion.header className="
            nav_header grid grid-cols-3
            w-screen h-[10vh] lg:h-[8vh] bg-nav-bar-pop text-sub-header text-logo relative
            ">
                {navigationTypesDevices(isMobileDevice, locaiton, setLoading)}
                <div className='relative z-[8]'>
                    <AnimatedLogoForAll className="-z-10 absolute w-[160%] h-[215%] top-[-30%] bottom-[5%] left-[-25%]"
                                        isHomePage={true}/>
                </div>
                <section className="
                conatinerUserNameLogo flex justify-center
                text-content items-center
                ">
                    <UserIcon userName={user.username} imgUrl={user.imgUrl} isMobile={isMobileDevice} wachlsit={wachlistList}/>
                </section>
            </motion.header>
            {
                loading ?
                    (
                        <div className="w-screen relative   z-[100] mt-[20vh]">
                            <Loading />
                        </div>
                    ) :
                    <Outlet context={{wachlist : wachlistList , set : setWachlistList}}/>
            }

        </>
    )
})
export default Navbar
