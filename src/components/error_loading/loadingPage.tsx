import {motion as m } from 'framer-motion'
import React from 'react'

const colors = [
    '#fff',
    '#c685d6',
    "#6980ff"
]
export const loadingCircles = {
    begin : {
        y : -10,
    },
    end : {
        y : 20,
    }
}
export const loadingCirclesParent = {
    begin : {
        overflow : 'hidden',
    },
    end : {
        overflow : "visible" ,
        transition : {
            ease : "easeIn" ,
            duration: 20,
            repeat : Infinity,
            staggerChildren : 0.2,
        }
    }
}

const arr = Array.from(Array(3).keys())
const Loading = () => {
    return (
        <m.div className="w-full h-full flex gap-[1em] justify-center " variants={loadingCirclesParent} animate="end"
                    initial="begin">
            {
                arr.map((i) => {
                    return (
                    <m.div
                        style={{
                            backgroundColor : colors[i]
                        }}
                        className={`w-[2em] h-[2em]  rounded-[100%] `}
                        variants={loadingCircles}
                        transition={{
                          type: 'spring',
                          damping: 0,
                          stiffness: 20,
                          bounce: 1,
                          }}
                        key={`loadingCircleNum${i}`}
                    ></m.div>
                    )
                })
            }
        </m.div>
    )
}
export default Loading 