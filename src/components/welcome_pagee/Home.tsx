/// <reference types="vite-plugin-svgr/client"/>
import React, {useEffect, useState} from 'react'
import {NavBarDeskHomePage, NavBarHomePage} from "./nav_bar_home_page.tsx";
import {motion as m } from 'framer-motion'
import IntroductionMobile from "./intro/IntroductionMobile.tsx";
import IntroductionDesk from "./intro/IntroductionDesk.tsx";
import {useRouteError} from 'react-router-dom';
import Error from "../error_loading/errorComponent.tsx";
import Lottie from 'react-lottie'
import dataForLottieAnimation from '../../static assets/Animation - 1695627836935.json'

const optionsLottie = {
    loop: true,
    autoplay: true,
    animationData: dataForLottieAnimation,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
}
const variantsForAnimating = {
    parent : {
        initial : {
            overflow : 'hidden'
        },
        animate : {
            overflow :'visible',
            transition : {
                staggerChildren : 0.1,
            }
        }
    },
    child : {
        initial : {
            x : '100%',
            y : '100%',
            rotate : 45
        },
        animate : {
            x : '0',
            y : '0',
            rotate : 45,
            transition : {
                duration : 1,
                type : 'linear'
            }
        }
    }
}

const factoryStylesImg = (coeficient: number ) => {
    const degV = 34 * coeficient;
    return {
        transform : `rotateX(24deg) rotateY(${degV}deg)`
    }
}

export const checkSize = (changeMobile: Function) => {

    return (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
        changeMobile(window.innerWidth < 1000);
    }
}
export const effectFunc = (change: Function) => {
    const func = checkSize(change);
    window.addEventListener('resize', func);
    return () => {
        window.removeEventListener('resize', func);
    }
}
const stylesTokenIcons = 'lg:w-[2em] rotate-x-[24deg] rotate-y-[22deg] w-[1em] h-[1em] lg:h-[1.5em] give-perspective animate-goreDoluEth'
const stylesFloatingThingsBehindHeader ="rounded-[66px] w-full h-full rotate-[45deg] opacity-30 bg-active-nav-logos"
const WelcomePage = () => {

    const [isMobile, setMobile] = useState<boolean>(window.innerWidth < 1000)
    const error = useRouteError() as string | null | undefined

    useEffect(() => {
        const removeit = effectFunc(setMobile);
        return removeit;
    }, []);

    return (
        <>
            <article className=" h-screen w-screen
                        flex flex-col   relative
                    ">
                {
                    isMobile && <NavBarHomePage />
                }
                <section className="flex-grow grid grid-cols-1 justify-items-center grid-rows-[max-content,1fr] lg:grid-rows-[auto,auto] lg:justify-items-start  lg:grid-cols-2 ">
                    <section className="grid place-items-center  grid-rows-[max-content,1fr] lg:grid-rows-[auto]">
                        <div className="overflow-hidden lg:ml-[2em] mt-[1.5em] relative text-header-desk p-[1em] w-fit h-fit lg:h-[50%] ">
                            <h1 className="text-header-welcome-page text-[#fff] relative z-20  text-center ">
                                <span>Welcome to</span>
                                <span className="matrix-effect block">Vendetta track</span>
                            </h1>
                            <m.div variants={variantsForAnimating.parent} initial={'initial'} animate={'animate'} className="absolute w-full h-full z-10 left-0 top-0 flex">
                                <m.div variants={variantsForAnimating.child} className={`${stylesFloatingThingsBehindHeader}`}></m.div>
                                <m.div variants={variantsForAnimating.child}  className={`${stylesFloatingThingsBehindHeader}`}></m.div>
                                <m.div variants={variantsForAnimating.child}  className={`${stylesFloatingThingsBehindHeader}`}></m.div>
                                <m.div variants={variantsForAnimating.child}  className={`${stylesFloatingThingsBehindHeader}`}></m.div>
                            </m.div>
                        </div>
                    </section>
                    <section
                        style={{
                            borderRadius : isMobile ? '64px' : 0,
                            borderBottomLeftRadius: !isMobile ? '16px' : 0
                        }}
                        className="shadow-photo-items-landing-page-mobile lg:w-full rounded-[63px] w-[90%] overflow-hidden lg:overflow-auto flex self-center lg:self-auto  lg:w-auto h-[70%]  lg:shadow-desk-photos-left  flex-col place-items-center lg:h-[85vh] bg-spiderWeb ">
                        {
                            !isMobile && <NavBarDeskHomePage />
                        }
                        <div className="flex-grow  w-full text-header-desk flex flex-col  overflow-hidden">
                            <Lottie
                            options={optionsLottie}
                            width={`88%`}
                            height={`75%`}
                            style={{
                                paddingLeft : isMobile ? 0 :  '1em',
                                paddingRight : isMobile ? 0 : '1em',
                                flexGrow : '1'
                            }}
                            />
                            <div className="w-full px-[0.5em]  justify-between lg:px-[1em] lg:pb-[1em] flex">
                                <img style={factoryStylesImg(1)} className={`${stylesTokenIcons} animate-goreDoluEth`} src="../../../src/static%20assets/eth.png"/>
                                <img style={factoryStylesImg(-1)} className={`${stylesTokenIcons} animate-goreDoluBit`} src="../../../src/static%20assets/bitcoin.png"/>
                            </div>
                        </div>
                    </section>
                </section>
            </article>
            <main className=" w-screen h-[100vh] overflow-y-hidden">
                {isMobile ? <IntroductionMobile/> : <IntroductionDesk/>}
            </main>
            {error && <Error message={error} isError={true}/>}
        </>
    )
}

export default WelcomePage