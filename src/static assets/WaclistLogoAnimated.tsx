/// <reference types="vite-plugin-svgr/client" />
import {AnimatePresence, motion, useAnimation} from 'framer-motion'
import React, {useMemo, useState, useRef} from 'react'
import {giveDebounce} from "../components/crypto_price/search/Search.tsx";
import {getDoc, setDoc, doc} from 'firebase/firestore'
import {fireStore} from "../firebaseConfig.ts";
import {UserDoc} from "../components/navigation/Navbar.tsx";
import {ReactComponent as CloseIcon} from "../static assets/closeIcon.svg";
import {
    Content,
    GeneralContentObject, TrendingContetnObject
} from "../components/crypto_price/apsContent/ApsContentSearch.tsx";
import {FilterValues} from "../components/crypto_price/Filter.tsx";
import {ReactComponent as InfoLogo} from "./infoLogo.svg";


export interface WaclistLogoAnimatedProps {
    className?: string,
    id: string,
    currentPrice: number,
    changeWachlist: Function,
    changeContent: Function
    activeFilter: FilterValues,
    wachlist: undefined | string[]
}

export const getUserDoc = async (email: string): Promise<UserDoc> => {
    const userDoc = (await getDoc(doc(fireStore, 'users', email))).data() as UserDoc
    return userDoc
}
const changeColor = (svg: SVGElement | undefined, which: boolean) => {
    console.log(svg)
    if (!svg) {
        return
    }
    // prvoto inactive vtoroto active
    const colorAnimation = which ? ['#884597', '#1C1E21'] : ['#e776ff', '#e776ff']

    svg.animate({
        stroke: colorAnimation[0],
        fill: colorAnimation[1]
    }, {
        direction: "normal",
        fill: 'forwards',
        easing: 'ease-in-out',
        duration: 500
    })
}
const getVariant = (direction: boolean | undefined) => {
    const neutralState = {
        stroke: '#884597', fill: '#1C1E21'
    }
    const activeStatee = {
        stroke: '#e776ff', fill: '#e776ff',
        transition: {
            duration: 1,
            type: 'easeIn'
        }
    }

    return direction ? {
        initial: activeStatee,
        end: neutralState,
    } : {
        initial: neutralState,
        end: activeStatee

    }
}
const dealWithDocEmail = async (): Promise<[UserDoc, string]> => {
    const email = window.localStorage.getItem('email') as string
    const userDoc = await getUserDoc(email)
    return [userDoc, email]
}
const removeFromWachlist = async (id: string,) => {

    const [userDoc, email] = await dealWithDocEmail()

    if (userDoc?.wachlist && userDoc.wachlist[id]) {
        delete userDoc.wachlist[id]
    }
    await setDoc(doc(fireStore, 'users', email), userDoc)
}
const addToWachlist = async (procent: string, id: string, currentPrice: number) => {

    let parsedProcent = isNaN(parseFloat(procent)) ? 20 : parseFloat(procent)

    const [userDoc, email] = await dealWithDocEmail()
    const wachlist = userDoc.wachlist ?? {}
    wachlist[id] = [currentPrice, parsedProcent / 100]
    userDoc.wachlist = wachlist
    await setDoc(doc(fireStore, 'users', email), userDoc)

}

const handleClcikInfo = () => {
    let wasClicked:boolean = false ;
    return (
        ev :React.MouseEvent<HTMLElement>
    ) => {
        ev.stopPropagation();
        ev.preventDefault()
        if(!ev.target)
            return
        const parentDiv = ev.currentTarget as HTMLElement;
        const valueClipPath = wasClicked ? '25%' : '200%';
        // clip-path: circle(22% at 100% 0 )
        parentDiv.style.clipPath = `circle(${valueClipPath} at 100% 0)`

        wasClicked = !wasClicked;
    }
}
const handleClickClosure = handleClcikInfo()

const WaclistLogoAnimated: React.FC<WaclistLogoAnimatedProps> = (
    {
        className, id
        , currentPrice, changeWachlist, changeContent,
        activeFilter,
        wachlist
    }
) => {


    const isInWachlist = useMemo(() => {
        if (!wachlist || (Array.isArray(wachlist) && wachlist.length === 0)) {
            return false
        }
        return wachlist.indexOf(id) !== -1
    }, [wachlist])

    const animation = useAnimation()
    const debounceFunc = useMemo(giveDebounce, [])
    const animationExit = useAnimation()

    const svgRef = useRef<SVGElement>()
    const [wasClicked, setClicked] = useState<boolean>(false)
    const [procentValue, setProcentValue] = useState<string>('')

    return (
        <>
            <motion.svg
                ref={(node) => node ? svgRef.current = node : ''}
                layout
                variants={getVariant(isInWachlist)}
                whileHover={{
                    stroke: '#e776ff'
                }}
                initial="initial"
                animate={animation}
                exit={{
                    opacity: 0,
                    y: '-2em'
                }}
                transition={{
                    duration: 0.2,
                    type: 'easeInOut'
                }}
                onClick={(ev) => {
                    ev.stopPropagation();
                    console.log(isInWachlist)
                    if (isInWachlist) {
                        if (activeFilter === 'Wachlist') {
                            changeContent((prev: Content<GeneralContentObject | TrendingContetnObject>) => {
                                const filtredCoins = !prev.content.coins ? null : prev.content?.coins.filter(val => val.id !== id)
                                return ({
                                    content: {
                                        coins: !Array.isArray(filtredCoins) ? null : filtredCoins.length === 0 ? null : filtredCoins
                                    },
                                    page: prev.page
                                })
                            })
                        }
                        removeFromWachlist(id).then(_ => {})
                        changeColor((ev.target as SVGElement), true)
                        changeWachlist((prev: string[]) => {
                            const copyPrev = [...prev];
                            [copyPrev[0], copyPrev[copyPrev.indexOf(id)]] = [copyPrev[copyPrev.indexOf(id)], copyPrev[0]]
                            copyPrev.shift()
                            return copyPrev
                        })
                    } else {
                        setClicked(true)
                    }
                }}
                className={`stroke-inactive-nav-logos ${className} hover:stroke-active-nav-logos 
            cursor-pointer`} viewBox="0 0 512 408" xmlns="http://www.w3.org/2000/svg">
                <path
                    strokeWidth="40"
                    d="M256 20.7126L309.403 158.187L311.262 162.971H316.394H485.051L349.825 245.148L344.452 248.413L346.729 254.273L399.119 389.14L259.895 304.533L256 302.166L252.105 304.533L112.881 389.14L165.271 254.273L167.548 248.413L162.175 245.148L26.9491 162.971H195.606H200.738L202.597 158.187L256 20.7126Z"
                    stroke-width="15"/>
            </motion.svg>
            <AnimatePresence>
                {!isInWachlist && wasClicked &&
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: '-1em'
                        }}
                        animate={{
                            y: 0,
                            opacity: 1
                        }}
                        exit={{
                            opacity: 0,
                            y: '-1em'
                        }}
                        transition={{
                            duration: 1,
                            type: 'easeInOut'
                        }}
                        className={`absolute w-full h-fit pb-[3em]
                   backdrop-blur-lg flex zvezda-za-${id}
                     text-content bg-transparent left-0 top-0`}
                        style={{
                            zIndex: '10',
                            backdropFilter: "blur(6px)",
                            outline: 'none',
                            left: 0,
                            top: 0,
                            justifyContent: 'center',
                            alignContent: 'start',
                            alignItems: 'start'
                        }}
                    >
                        <div className="w-full flex gap-[1em] flex-col mt-[0.5em]">
                            <CloseIcon
                                className="rounded-xl cursor-pointer
                      w-[1em] h-[1em]  mt-[1em] bg-nav-bar-pop
                      mr-[1em] self-end" style={{alignSelf: 'flex-end'}}
                                onClick={(ev) => {
                                    ev.stopPropagation()
                                    setClicked(false)
                                }}
                            />
                            <div className="flex w-[50%] p-[2em] rounded-xl  bg-nav-bar-pop
                        flex-col  gap-[1em] relative items-center justify-center shadow-lg  "
                                 style={{
                                     width: 'max-content',
                                     padding: '2em',
                                     boxShadow: '8px 8px 10px black',
                                     marginTop: '1em',
                                     alignSelf: 'center',
                                     gap: '1.5em'
                                 }}
                            >
                                <div

                                    onClick={handleClickClosure}
                                    className={`absolute z-50 w-full bg-[#373f48]  
                                    transition duration-500 ease-in-out  clipper-circle-wachlist
                                     rounded-xl h-full left-0 top-0 flex flex-col hover:[clip-path:circle(500%_at_100%_0)]`}>
                                    <div
                                        className={'w-full h-full flex flex-col '}>
                                        <div className={`flex w-full h-[1em] justify-end`}>
                                            <InfoLogo
                                                className={`w-[2em] h-[2em] relative z-50  cursor-pointer mr-[0.2em] mt-[0.2em]`}/>
                                        </div>
                                        <div className={`flex-grow flex justify-center items-center `}>
                                            <p
                                                className={`text-sub-header p-[1em] text-center break-words`}
                                            >The number below represents the rise or fall (in percent) of the
                                                cryptocurrency for which you want to be notified</p>
                                        </div>
                                    </div>
                                </div>
                                <label

                                    htmlFor="percentage"
                                    className="
                                   relative
                                   text-sub-header text-center break-words "
                                >
                                    Enter the percentage:
                                </label>
                                <input
                                    onClick={(ev) => {
                                        ev.stopPropagation()
                                    }}
                                    onChange={(ev) => {
                                        ev.stopPropagation()
                                        ev.preventDefault()
                                        const target = ev.target as HTMLInputElement
                                        setProcentValue(target.value)
                                    }}
                                    value={procentValue}
                                    type="text"
                                    placeholder="20"
                                    style={{
                                        borderColor: '#e776ff'
                                    }}
                                    name="percentage"
                                    className="
                    w-full
                    border-b-1
                    focus-visible:outline-none
                    focus-visible:border-b-1
                    bg-[transparent]
                    text-content
                    text-[#fff]
                    "
                                />
                                <button
                                    style={{
                                        borderRadius: '6px'
                                    }}
                                    className="bg-green  p-[0.2em] px-[0.5em] w-fit h-fit  text-text-desktop  rounded-lg "
                                    onClick={(ev) => {
                                        ev.stopPropagation()
                                        ev.preventDefault()
                                        setClicked(false)
                                        debounceFunc(addToWachlist, 100, procentValue, id, currentPrice)
                                        setTimeout(() => {
                                            changeWachlist((prev: string[] | undefined) => {
                                                let newPrev = prev ? [...prev] : []
                                                newPrev.push(id)
                                                return newPrev
                                            })
                                            changeColor(svgRef.current, false)
                                        }, 500)
                                    }}
                                >Submit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                }
            </AnimatePresence>
        </>
    )

}
export default WaclistLogoAnimated