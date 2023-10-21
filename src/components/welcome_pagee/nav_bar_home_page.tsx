/// <reference types="vite-plugin-svgr/client"/>
import {Keyframes, motion} from "framer-motion";
import {NavLink} from "react-router-dom";
import React from "react";
import {ReactComponent as Login} from "../../static assets/icon_login.svg";
import {ReactComponent as Logo} from "../../static assets/logo_animated/Logo.svg";

const slide_in_var = {
    init: {
        opacity: 0,
        y: -20
    },
    end: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'easeIn',
            duration: 1,
            delay: 0.2
        }
    }
}

const anim_click = () => {

    const animation_obj = (dir: 'normal' | 'reverse') => {
        const obj: Keyframe[] = [
            {transform: "scale(1)", opacity: '70%'},
            {transform: 'scale(1.2)', opacity: '100%'}
        ]
        const opt: KeyframeAnimationOptions = {
            duration: 300,
            easing: 'ease-in',
            fill: 'forwards',
            direction: dir
        }
        return [obj, opt]
    }
    const nav_animation_obj = [
        {opacity: '0'},
        {opacity: '1'}
    ]

    const lower_width = (
        parent_div: HTMLElement,
        nav: Element[]
    ) => {
        const [key, opt] = animation_obj('reverse')
        parent_div.animate(key as Keyframe[], opt as KeyframeAnimationOptions)
        nav.forEach(nav_el => {
            nav_el.animate(nav_animation_obj, opt as KeyframeAnimationOptions)
        })
    }
    const increase_width = (
        parent_div: HTMLElement,
        nav: Element[]
    ) => {
        const [key, opt] = animation_obj('normal')
        parent_div.animate(key as Keyframe[], opt as KeyframeAnimationOptions)
        nav.forEach(nav_el => {
            nav_el.animate(nav_animation_obj as Keyframe[], opt as KeyframeAnimationOptions)
        })
    }

    let was_click: boolean = false

    return (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.stopPropagation()

        const parent_div = ev.currentTarget as HTMLDivElement;
        const nav = [...document.querySelectorAll('.nav_mobile')]
        if (was_click) {
            lower_width(parent_div, nav)
        } else {
            increase_width(parent_div, nav)
        }
        was_click = !was_click
    }
}

export const NavBarHomePage = () => (
    <motion.header
        variants={slide_in_var}
        initial="init"
        animate="end"
        className="w-screen flex justify-end h-[10%] ">
        <nav aria-label="logo for sign in"
             className="
             mt-4
             transition ease-in delay-0
             flex flex-row items-center gap-[0.5em] mr-[0.3em] px-2 py-[0.3em]  rounded-xl"
        >
            <NavLink to='/login' className="bg-[#2b313b]
                      p-1 px-2 rounded-xl
                      opacity-0 text-sm  text-logo nav_mobile">Login</NavLink>
            <NavLink to='/register' className="
                    p-1 px-2  bg-[#2b313b] rounded-xl opacity-0 text-sm  text-logo nav_mobile">Register</NavLink>

            <div
                onClick={anim_click()}
                className="bg-[#2b313b] p-2 rounded-2xl  opacity-100
                cursor-pointer">
                <Login
                    className="w-[clamp(2rem,1rem+2vw,4rem)]
                     transition ease-in delay-0
                      h-[clamp(2rem,1rem+2vw,4rem)]
                      svg_login"/>
            </div>
        </nav>
    </motion.header>
)

export const NavBarDeskHomePage = () => (
    <motion.header
        variants={slide_in_var}
        initial="init"
        animate="end"
        className=" flex justify-center h-fit  w-full md:justify-end  hover:opacity-100 ">
        <motion.nav
            className="flex flex-row h-fit
                    mt-10  bottom-[15%] text-landing-page-nav-desk
                    text-logo justify-between  me-10   ">
            <NavLink to='/login'
                     className="opacity-80 hover:opacity-100 text-landing-page-nav-desk mr-6 rounded-xl bg-[#2b313b] hover:scale-110  p-2 px-4">Login</NavLink>
            <NavLink to='/register'
                     className='opacity-80 hover:opacity-100 text-landing-page-nav-desk rounded-xl bg-[#2b313b] hover:scale-110  p-2 px-4'>Register</NavLink>
        </motion.nav>
    </motion.header>
)
