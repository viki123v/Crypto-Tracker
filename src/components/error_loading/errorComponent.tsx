/// <reference types="vite-plugin-svgr/client" />
import {ReactComponent as InfoSvg } from '../../static assets/infoLogo.svg'
import { motion } from 'framer-motion'
import {useEffect, useState} from "react";
import React from 'react'





const Error:React.FC<{message : string, isError : boolean}>  = ({message, isError}) => {



    return (
        <>
        <motion.article
            initial={{y : `-7rem`}}
            animate={{y : 0}}
            exit={{y: '-7rem'}}
            transition={{type : 'easeIn', duration : 2}}
            style={{
                backgroundColor : isError ? 'red' : "#6980FF"
            }}
            className={`
            error-article
            absolute w-fit h-fit p-2
             top-[2rem] rounded-2xl 
            left-[5vw] errorPopUp  
            `}>
            <div className="  containerForInfoSvg bg-[#1c1e21] w-fit h-fit translate-x-[-2rem] rounded-[100%] p-2 translate-y-[-2rem]">
                <InfoSvg/>
            </div>
            <h1
            className='text-[#fff] text-[clamp(0.7rem,1.5vw+0.2rem,1.7rem)] translate-y-[-1rem]'
            >{message}</h1>
        </motion.article>
        </>
    )
}

export default Error