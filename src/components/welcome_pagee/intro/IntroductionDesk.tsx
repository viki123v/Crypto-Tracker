/// <reference types="vite-plugin-svgr/client" />
import React, {useEffect, useMemo } from 'react'
import {ReactComponent as Logo} from "../../../static assets/logoDesktop.svg";
import {

    preventScroll,
    decideAnimationDesk,
    giveShouldAnimate
} from "./animationHelpers.ts";

const styleH = 'text-header-desk text-[#fff]'
const styleP = 'text-content-desk text-[#fff]'
const styleSubH = 'text-sub-header-desk text-[#fff]'
const borderDivsStyles = 'border-t-1 transition duration-500 ease-in-out border-[#826d6d] border-b-1 hover:border-[#fff] hover:bg-[#b0b0b7] group/tatko '
const hoverTatko = 'group-hover/tatko:text-[#000]'
const styleStripes = 'h-screen w-[12vw] bg-pop-up-col opacity-50'
const Pstyles = 'text-[#fff] text-main-content-desk-desk'
const headerStyles = 'text-[#fff] text-header-main-desk'
const stylesLeftStripes = {
    background: '#ba74c9'
}
const shouldAnimate :Function = giveShouldAnimate()
const IntroductionDesk: React.FC<{}> = () => {

    useEffect(() => {
        const shouldAnimatePassingProps = (ev: WheelEvent): void => {
            shouldAnimate(ev, decideAnimationDesk)
        }

        window.addEventListener('wheel', preventScroll, {passive: false});
        window.addEventListener('wheel', shouldAnimatePassingProps, {passive: false});

        return () => {
            window.removeEventListener('wheel', shouldAnimatePassingProps)
            window.removeEventListener('wheel', preventScroll)
        }
    }, [])

    return (
        <div className='w-screen relative h-screen '>
            <article
                data-view={'not'}
                id="article-circle"
                className="absolute transition-all z-10 duration-500 ease-in-out overflow-x-hidden w-screen h-screen">
                <section className="w-[200vw] transition-all duration-500 ease-in-out h-screen overflow-x-hidden flex relative">
                    <section className='transition-all duration-500 ease-in-out w-screen h-screen items-center  relative flex'>
                        <div className="h-screen w-[43vw] absolute left-0 flex justify-between">
                            <div className={`${styleStripes}`}></div>
                            <div className={`${styleStripes}`}></div>
                            <div className={`${styleStripes}`}></div>
                        </div>
                        <div className="w-[43vw] h-screen flex items-center">
                            <div className='relative z-10 h-auto  '>
                                <h1 className={`${headerStyles} text-[#eab4f7]  justify-center mr-0 mb-[1em] w-full text-center flex flex-col items-center`}>
                                    <span>Vendetta track</span>
                                    <span className="block text-sub-header-main-desk">Your All-in-One Crypto Tracking Solution</span>
                                </h1>
                                <p className={`${Pstyles} px-[1em] text-center leading-[1.5em]`}>
                                    In the ever-evolving realm of cryptocurrencies, a formidable newcomer has arrived –
                                    "Vendetta
                                    Track."
                                    This cutting-edge crypto tracker is poised to disrupt the market and redefine how we
                                    monitor
                                    and
                                    manage
                                    our digital assets.
                                </p>
                            </div>
                        </div>
                    </section>
                    <Logo
                        className="absolute transition-all duration-500 ease-in-out desk_logo w-[100vw] h-[100vh] top-0 z-100 left-[50vw] z-10"/>
                    <section data-view={'not'}
                             className="clip_circle w-screen h-screen flex justify-end relative bg-active-nav-logos z-1">
                        <div
                            className='w-[43vw] h-screen flex transition-all duration-500 ease-in-out flex-col items-center justify-center'>
                            <div className='relative z-10 h-auto'>
                                <h1 className={`${headerStyles} text-center mb-[1em]`}>Why Vendetta track</h1>
                                <p className={`${Pstyles} text-center px-[1em] `}> Vendetta Track is the ultimate choice
                                    for
                                    crypto enthusiasts and
                                    investors looking to stay
                                    ahead
                                    in the ever-evolving world of cryptocurrencies. With its user-friendly interface and
                                    powerful
                                    analytics tools, Vendetta Track empowers you to make informed decisions about your
                                    crypto
                                    portfolio. Whether you're a seasoned trader or just starting out, Vendetta Track
                                    offers
                                    real-time market data, in-depth analysis, and customizable alerts to help you
                                    navigate
                                    the
                                    volatile crypto landscape.</p>
                            </div>
                        </div>
                        <div className="w-screen h-screen absolute z-1 flex justify-end ">
                            <div className="h-screen w-[43vw]  left-0 flex justify-between ">
                                <div style={stylesLeftStripes} className={`${styleStripes}`}></div>
                                <div style={stylesLeftStripes} className={`${styleStripes}`}></div>
                                <div style={stylesLeftStripes} className={`${styleStripes} `}></div>
                            </div>
                        </div>
                    </section>
                </section>
            </article>
            <footer data-view="not"
                    className="footer-glaven opacity-0 transition-all duration-500 ease-in-out absolute -z-1  w-screen h-screen bg-[#1e2124] flex flex-col justify-end ">
                <div className="mb-[5vh] w-full h-[60%] flex justify-center">
                    <div className={`grid grid-cols-1 grid-rows-2 w-[80%] `}>
                        <section className={`grid grid-cols-2 items-center ${borderDivsStyles}`}>
                            <h1 className={`${styleH} ${hoverTatko} text-center`}>Made by</h1>
                            <figure className=" w-full gap-[0.5em] flex flex-col justify-center items-center ">
                                <img className="aspect-[17/12] w-[15em]" alt="creater cartoon image"
                                     src="../../../../src/static assets/avataaars.png"/>
                                <figcaption className={`${styleP} ${hoverTatko}`}>Viktor Hristovski</figcaption>
                            </figure>
                        </section>
                        <section className={`grid grid-cols-2 min-h-fit items-center ${borderDivsStyles} `}>
                            <h1 className={`${styleH} text-center ${hoverTatko}`}>Contact</h1>
                            <section className='flex h-full justify-center'>
                                <div className=" flex flex-col gap-[1em] justify-center ">
                                    <div className="flex gap-[0.2em]  flex-col">
                                        <h2 className={`${styleSubH} ${hoverTatko}`}>Email</h2>
                                        <a className={`${styleP} ${hoverTatko} text-active-nav-logos
                                        group-hover/tatko:text-inactive-nav-logos  underline `}
                                           href="mailto:viktorhrisotvski629@gmail.com">viktorhrisotvski629@gmail.com</a>
                                    </div>
                                    <div className="flex gap-[0.2em] flex-col">
                                        <h2 className={`${styleSubH} ${hoverTatko}`}>Phone</h2>
                                        <p className={`${styleP} ${hoverTatko}`}>078 396 995</p>
                                    </div>
                                </div>
                            </section>
                        </section>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default IntroductionDesk

