/// <reference types="vite-plugin-svgr/client" />
import {motion} from "framer-motion";
import {NavLink} from "react-router-dom";
import {ReactComponent as LearnIcon} from '../../static assets/navigation_logos/navigation_learn_logo.svg'
import {ReactComponent as NFTIcon} from '../../static assets/navigation_logos/navigation_nft_logo.svg'
import {ReactComponent as NewsIcon} from '../../static assets/navigation_logos/navigation_news_logo.svg'
import {ReactComponent as MarketIcon} from '../../static assets/navigation_logos/navigation_market_logo.svg'
import {ReactComponent as ArrowBackHamburger} from '../../static assets/navigation_logos/navigation_hamburger_back.svg'
import React from 'react'
import type { LocatoinInfoThatINeed } from './Navbar.tsx'


enum HamActions {
    open = 0,
    close = 1
}

const widthNavImagesMob = 'w-[10vw] h-[10vw] fill-logo absolute left-[1em] bottom-0'
const widthNavImagesDesk = 'w-[2.5em] h-[2.5em]  '
const hamStyles = 'w-[3em] h-[1em]l bg-inactive-color rounded-2xl group-hover/parent-nav:bg-[#c862e1]'

const navItemsDesc = [
    'nft','news','market','learn'
]
const getImage = (name : string , className : string ) => {
    switch(name) {
        case  'nft': return <NFTIcon className={className} />;
        case 'news' : return <NewsIcon className={className} />;
        case 'market' : return <MarketIcon className={className} />
        case 'learn' : return <LearnIcon className={className} />
    }
}
const hamAnimations = () => {

    const body = (document.querySelector('body') as HTMLBodyElement)
    const section = document.querySelector('.navigation_reveal_clicked') as HTMLElement

    return (
        dir: HamActions
    ) => {
        if (dir) {
            body.style.overflow = 'visible'
            section.style.transform = `translateX(${-window.innerWidth}px)`
        } else {
            body.style.overflow = 'hidden'
            section.style.transform = 'translateX(0px)'
        }
    }
}
let timer: NodeJS.Timeout

const dealClickNav = (
    ev: React.MouseEvent,
    setLoading: Function
) =>{
    if(timer)
        clearTimeout(timer)
    ev.stopPropagation()
    setLoading(true)
    hamAnimations()(1)
    timer = setTimeout(() => {
        setLoading(false)
    }, 1000 )
}
export const giveClassNames = (type: 'desk' | 'mobile', location: LocatoinInfoThatINeed, setLoading : Function ) => {
    const mobileDiv = 'flex relative flex-row border-b-2 border-logo  fit-content' +
        ' hover:border-active-nav-logos'
    const deskDiv = 'flex flex-row-reverse  place-items-center gap-[5px]'
    const isDesk = type === 'desk'

    return navItemsDesc.map((name) => {

        const pathName = location.pathname.split('/')
        const shouldActiveColor = pathName[pathName.length -1 ].toLowerCase() === name.toLowerCase()

        return (
            <div key={`navigation_part_${type}_${name}`}
                 className={`${isDesk ? deskDiv : mobileDiv }  group/parent`}>
                <NavLink
                    onClick={(ev) => {dealClickNav(ev, setLoading )}}
                    to={`${name}`}
                    className={`
            navigation_text_${type} ${isDesk ? 'text-sub-content ' : 'text-header w-full text-end mr-[1em]'}
                ${shouldActiveColor ? 'text-active-nav-logos' : 'text-inactive-nav-logos'} group-hover/parent:text-active-nav-logos
                 `}>
                    {`${name[0].toUpperCase()}${name.slice(1,)}`}
                </NavLink>
                { getImage(name, `${isDesk ? widthNavImagesDesk :widthNavImagesMob } ${shouldActiveColor? 
                    'fill-active-nav-logos cursor-pointer stroke-active-nav-logos group-hover/parent:fill-active-nav-logos group-hover/parent:stroke-active-nav-logos' 
                    : 'cursor-pointer fill-inactive-nav-logos stroke-inactive-nav-logos'} 
                    group-hover/parent:fill-active-nav-logos group-hover/parent:stroke-active-nav-logos `  ) }
            </div>
        )
    })
}

export const navigationTypesDevices = (isMobile: 0 | 1, location: LocatoinInfoThatINeed, setLoading: Function  ) => {
    if (!isMobile) {
        return (
            <motion.section
                variants={{
                    up: {y: '-10vh'},
                    down: {
                        y: 0,
                        transition: {
                            type: 'easeIn',
                            duration: 0.2
                        }
                    }
                }}
                custom={window.innerWidth}
                initial="initial"
                animate="end"
                className="navigation_desk_type relative z-20 py-[0.4em]
                grid grid-cols-4 gap-x-[0.5em] pl-[0.4em]
                ">
                {giveClassNames('desk', location, setLoading)}
            </motion.section>
        )
    } else {
        return (
            <>
                <nav className="navigation_mobile_type text-sub-content flex justify-center items-center
                group/parent-nav">
                    <div
                        onClick={(ev) => {
                            ev.stopPropagation()
                            hamAnimations()( 0)
                        }}
                        className="grid grid-max-content-grid gap-y-[3px]   p-[5px] h-[3em] rounded-[8px]">
                        <div className={hamStyles}></div>
                        <div className={hamStyles}></div>
                        <div className={hamStyles}></div>
                    </div>
                </nav>
                <section
                    style={{
                        transform: `translateX(${-window.innerWidth}px)`
                    }}
                    className="navigation_reveal_clicked  translate-x-[-100vw]
                    w-screen  grid
                    bg-nav-bar-pop z-[200] transition duration-1000 ease-in-out absolute
                    h-screen
                    ">
                    <ArrowBackHamburger
                        className="w-[10vw] h-[10vw] absolute left-[88vw] top-[1vh] "
                        onClick={(ev) => {
                            ev.stopPropagation();
                            hamAnimations()(1)
                        }}
                    />
                    <nav className="w-[70vw] h-[50vh] relative top-[30vh] left-[15vw] grid grid-rows-max-content-grid-mob gap-y-[3em] ">
                        {giveClassNames('mobile', location, setLoading )}
                    </nav>
                </section>
            </>
        )
    }
}