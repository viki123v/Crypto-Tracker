/// <reference types="vite-plugin-svgr/client" />
import React, {memo, useEffect, useRef} from 'react' ;
import AnimatedLogo from '../../../static assets/logo_animated/AnimatedLogo.tsx'
import {motion, useInView} from 'framer-motion'
import {variant_divs, text_var, use_ref_intro} from './intro_helpers.tsx'
import dataLeft from '../../../static assets/WelcomeLeft.json'
import dataRight from '../../../static assets/WelcomeRight.json'
import Lottie from 'react-lottie'
import  {preventScroll , giveShouldAnimate, decideAnimationMobile} from "./animationHelpers.ts";

export const defaultOptionsLeft = {
    loop: true,
    autoplay: true,
    animationData: dataLeft,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
};
export const defaultOptionsRight = {
    loop: true,
    autoplay: true,
    animationData: dataRight,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
    }
}



const dimLottie = '3em'
const paddingLottie = '3em'

const shouldAnimate :Function = giveShouldAnimate();
const IntroductionMobile: React.FC<{}> = memo(() => {

    const div = useRef<HTMLDivElement>(null)
    const inViewDiv = useInView(div)


    const {
        ref,
        ref_parent_div,
        controls,
        controls_text
    } = use_ref_intro()

    useEffect(() => {

        const shouldAnimatePassingProps = (ev : WheelEvent) : void  => {
            shouldAnimate(ev,decideAnimationMobile)
        }

        window.addEventListener('wheel', preventScroll, {passive: false});
        window.addEventListener('wheel', shouldAnimatePassingProps, {passive: false});

        return () => {
            window.removeEventListener('wheel', shouldAnimatePassingProps)
            window.removeEventListener('wheel', preventScroll)
        }
    }, [])

    return (
        <motion.article
            id="article-circle"
            data-view={'not'}
            className='overflow-x-[hidden] scroll_sec snap-always text-header-learn h-screen snap-start w-full  bg-[#10161c] relative  '>
            <div className='absolute w-screen h-screen flex justify-center items-center '>
                <section
                    className="min-h-fit changeOpacity flex flex-col _sc h-[90vh]
                     justify-between text-xl  w-[100%] items-center translate-y-12">
                    <div className=" text-content 
                before_goolge_zafrkavat flex gap-4 items-center flex-col ">
                        <AnimatedLogo classNames="
                      sm:w-[12em]  w-full h-[6em]
                      z-1 relative "/>
                        <motion.h1
                            ref={ref}
                            className='overflow-hidden
                              w-fit h-fit
                              text-logo px-1 text-center
                                 font-bold
                                decoration-solid'>
                            <motion.span className="text-header-learn">
                                Vendetta Track
                            </motion.span>
                            <motion.span
                                initial="init"
                                variants={text_var}
                                animate={controls_text}
                                transition={{duration: 1, type: 'easeIn'}}
                                className='
                                text-sub-header-welcome-page
                                 block
                                 decoration-0 font-normal
                                 '>Your All-in-One Crypto Tracking Solution
                            </motion.span>
                        </motion.h1>
                    </div>
                    <div
                        ref={div}
                        className="w-full  grow flex justify-center ">
                        <motion.div
                            transition={{staggerChildren: 0.2}}
                            ref={ref_parent_div}
                            className="
                        max-w-[23.75rem] h-[80%]
                     flex-col flex  overflow-hidden
                     bf border-l-2 justify-center
                      border-logo z-0  pl-1 mt-8 
                      mx-8">
                            <motion.div
                                variants={variant_divs}
                                initial="init"
                                animate={controls}
                                transition={{
                                    duration: 1.2,
                                    type: 'easeIn'
                                }}
                                className="
                        bg-pop-up-col  p-2 mx-2 leading-1 z-1  h-fit
                        lg:leading-extra w-fit rounded-2xl  text-[#fff]">
                                <p className='text-[clamp(0.8rem,0.5rem+1.2vw,2.5rem)] p-2  indent-2 inline-block '>
                                    In the ever-evolving realm of cryptocurrencies, a formidable newcomer has arrived –
                                    "Vendetta
                                    Track."
                                    This cutting-edge crypto tracker is poised to disrupt the market and redefine how we
                                    monitor
                                    and
                                    manage
                                    our digital assets.
                                </p>
                            </motion.div>
                            <motion.div
                                variants={variant_divs}
                                initial="init"
                                animate={controls}
                                transition={{
                                    duration: 1.2,
                                    type: 'easeIn'
                                }}
                                className="
                            mt-2 md:mt-5
                            bg-pop-up-col  p-2 mx-2 leading-1 z-1  lg:leading-extra w-fit rounded-2xl
                              text-[#fff] h-fit
                        ">
                                <p className="
                         text-[clamp(0.8rem,0.5rem+1.2vw,2.5rem)]
                         p-2 md:indent-[1px] inline-block  indent-2 ">
                                    Vendetta Track steps onto the scene with an array of innovative features and a
                                    commitment to
                                    making
                                    crypto tracking accessible to everyone. Its intuitive interface welcomes both
                                    newcomers
                                    and
                                    seasoned
                                    traders, offering a seamless and user-friendly experience.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
                <footer
                    data-view={'not'}
                    className='footer-glaven flex flex-col justify-end    items-center w-screen h-screen  opacity-0 absolute  '>
                    <div className="w-[70%] h-[1px] bg-[#fff] "></div>
                    <div className="w-screen h-[85vh] sm:h-[50vh] s sm:justify-items-center sm:px-[15%]  px-[1em] sm:items-center sm:mt-[1vh]  mt-[3vh] text-[#fff] inline-grid sm:grid-cols-2 sm:grid-rows-[min-content,min-content]
                            grid-rows-[repeat(4,min-content)]    justify-items-center sm:gap-y-0
                           gap-x-[0.5em] sm:gap-x-[1em]   content-stretch grid-cols-1">
                        <h1 className=" h-fit text-header-footer w-full text-center ">Made by</h1>
                        <h1 className="w-full h-fit text-header-footer text-center mt-[2em] sm:text-center  sm:mt-[2em]   row-start-3  sm:col-span-2 sm:row-start-2">Contact</h1>
                        <figure className='flex flex-col content-center sm:self-center mt-[1em] sm:mt-0'>
                            <img className="aspect-[1/1] w-[5em]" alt="creater cartoon image"
                                 src="../../../../src/static assets/avataaars.png"/>
                            <figcaption className="text-sub-image mt-[1em] text-center ">Viktor Hristovski</figcaption>
                        </figure>
                        <div
                            className="sm:col-span-2 sm:justify-items-center sm:mt-[0.2em] sm:self-start sm:gap-y-[0.2em] grid-cols-1 w-full justify-items-center  auto-rows-auto pt-[0.7em] sm:pt-0 self-stretch inline-grid gap-y-[1em]  grid-rows-[repeat(2,min-content)] ">
                            <div className="flex flex-col gap-[0.3em] w-[8em] ">
                                <h2 className='w-fit h-fit text-sub-image indent-2'>Email</h2>
                                <a href="mailto:viktorhristovski629@gmail.com"
                                   className='w-fit h-fit text-content-footer  indent-2 break-words'>viktorhristovski629@gmail.com</a>
                            </div>
                            <div className="flex flex-col gap-[0.3em] w-[8em]  ">
                                <h2 className="w-fit h-fit text-sub-image indent-2">Phone</h2>
                                <p className='w-fit h-fit text-content-footer indent-2'>078 396 995</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
            <section data-view = {'not'}
                className="w-screen transition-all duration-500 ease-in-out text-[#fff] h-screen circle bg-[#a26ace] absolute clip_circle clipped-circle inline-grid grid-cols-1 grid-rows-[1fr,min-content]">
                <section className="inline-grid grid-cols-1   p-[1em] gap-y-[1em] self-stretch">
                    <h1 className="text-header-learn text-center self-end">
                        <span>Why </span>
                        <span>Vendetta Track</span>
                    </h1>
                    <p className="text-welcome-rozevo text-center leading-[1.8em] px-[1em] ">
                        Vendetta Track is the ultimate choice for crypto enthusiasts and investors looking to stay
                        ahead
                        in the ever-evolving world of cryptocurrencies. With its user-friendly interface and
                        powerful
                        analytics tools, Vendetta Track empowers you to make informed decisions about your crypto
                        portfolio. Whether you're a seasoned trader or just starting out, Vendetta Track offers
                        real-time market data, in-depth analysis, and customizable alerts to help you navigate the
                        volatile crypto landscape.
                    </p>
                </section>
                <section className="w-full justify-between flex h-[4em]  relative overflow-x-hidden">
                    <div className=' p-[0.5em]  bg-[#fff] rounded-[100%] absolute top-0 left-[-10%] flex flex-col '>
                        <Lottie
                            style={{
                                alignSelf: 'end'
                            }}
                            options={defaultOptionsLeft}
                            width={dimLottie}
                            height={dimLottie}
                        />
                        <div className='w-[6em] h-[2em]'></div>
                    </div>
                    <div className="self-end ">
                        <div className="p-[0.5em]  bg-[#fff] rounded-[100%] absolute top-0 right-[-10%] flex flex-col ">
                            <Lottie
                                style={{
                                    alignSelf: 'start',
                                    marginLeft: '0.5em'
                                }}
                                options={defaultOptionsRight}
                                width={dimLottie}
                                height={dimLottie}
                            />
                            <div className='w-[6em] h-[2em]'></div>
                        </div>
                    </div>
                </section>
            </section>

        </motion.article>
    )
})
export default IntroductionMobile 