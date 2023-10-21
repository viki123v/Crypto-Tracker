/// <reference types="vite-plugin-svgr/client" />
import React, {memo, useEffect, useRef, useContext, ReactComponentElement, ReactElement, useCallback} from "react";
import {motion, useAnimation, useInView} from "framer-motion";
import {
    awaitng,
    Content,
    GeneralContentObject,
} from './apsContent/ApsContentSearch.tsx'
import {ContextMobile} from "./Filter.tsx";
import {useNavigate} from "react-router-dom";
import {formatStringPrice} from './Graph/GraphVersions/graphHelpers.ts'
import {CommonContentObject, valueKeysObject} from "./apsContent/ApsContentSearch.tsx";
import apis from "./apisConfig.ts";
import {generateCommonContent} from "./apsContent/ApsContentSearch.tsx";

const hoverOpacity = " group-hover/tatko:opacity-100 "

interface CryptoCardProps {
    content: CommonContentObject
    func: {
        setContent: Function,
        setActiveGraph: Function
    },
    logo: ReactElement,
    page: number
    lastItem?: boolean,
}

const fetchNextPage = async (page: number, setContent: Function) => {
    if (page + 1 === 6) {
        return
    }

    let nextPageData: GeneralContentObject[] | CommonContentObject[] = await awaitng(apis.crypto.getPage(page + 1)) as GeneralContentObject[]
    nextPageData.forEach(val => generateCommonContent(val))
    setContent((prev: Content<CommonContentObject>) => {
        return {
            content: {
                coins: [...(prev.content.coins ?? []), ...nextPageData]
            },
            page: prev.page + 1
        }
    })
}
const handleClick = (ev: React.MouseEvent<HTMLElement>, navigate: Function, id: string, isMobile: boolean|null, setActiveGraph: Function): void => {
    ev.preventDefault()
    ev.stopPropagation()
    if (isMobile) {
        navigate(`/loading/user/market/${id}`) ;
    //     loading/:toWhere/:toWhere1
    } else {
        const navBar = document.querySelector('.nav_header') as HTMLElement;
        navBar.scrollIntoView()
        setActiveGraph(id)
    }
}

let time: number = 1
const CryptoCard: React.FC<CryptoCardProps> = memo(({
                                                        func, content, logo, page,
                                                        lastItem
                                                    }) => {

    const ref = useRef<HTMLElement | null>(null)
    const inViewRef = useInView(ref)
    const animate = useAnimation()
    const isMobile = useContext(ContextMobile)
    const navigate = useNavigate()

    const fetchNextPageCallback = useCallback((node: HTMLElement | null) => {
        if (!lastItem || !node || page === -1) {
            return
        }

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                fetchNextPage(page, func.setContent)
                observer.disconnect()
            }
        })


        observer.observe(node)

    }, [lastItem])


    useEffect(() => {
        if (inViewRef) {
            animate.start('animate')
        }
    }, [inViewRef]);

    return (
        <motion.div
            ref={(node) => node ? ref.current = node : ''}
            variants={{
                initial: {scale: 0.5},
                animate: {
                    scale: 1,
                    transition: {
                        duration: 0.5,
                        type: 'easeIn',
                    }
                }
            }}
            initial="initial"
            animate={animate}
            className="
            group/tatko  coin-card relative text-content rounded-xl
             items-center   grid grid-cols-max-crypto-col
               place-items-center gap-x-[1em]   text-[#fff]
              py-0
             ">
            <div
                ref={fetchNextPageCallback}
                className={` relative p-[1.5em] w-[2em] h-[2em] rounded-[100%] bg-background-color`}>
                <img
                    className={`${hoverOpacity} w-[2em] rounded-[100%] h-[2em] absolute left-[0.5em] top-[0.5em]`}
                    src={content.image} alt={`image for ${content.name}`}/>
            </div>
            <h2 onClick={(ev) => {
                handleClick(ev, navigate, content.id, isMobile, func.setActiveGraph)
            }} className={`m-0 p-0 ${hoverOpacity} break-all text-center cursor-pointer`}>{content.name}</h2>
            <h2
                data-set={`${formatStringPrice(content.price.toString(), false)}$`}
                className={`${hoverOpacity} text-center 
                    before:absolute relative before:p-[0.4em]
                    before:rounded-lg before:rounded-bl-none before:bg-nav-bar-pop
                    before:opacity-0 hover:before:opacity-100 
                    before:top-[-4ch] before:left-[80%]
                    before:transition before:duration-200 
                    before:ease-in-out before:text-sub-crypto
                    before:content-[attr(data-set)] 
                    `}
            >{formatStringPrice(content.price.toString(), true)}$</h2>
            <h2
                data-set={`${formatStringPrice(content.change.toString(),false)}%`}
                className={`${content.change < 0 ? 'text-red opacity-80' : 'text-[#fff] '} 
                   before:absolute relative before:p-[0.4em]
                    before:rounded-lg before:rounded-bl-none before:bg-nav-bar-pop
                    before:opacity-0 hover:before:opacity-100 
                    before:top-[-4ch] before:left-[80%]
                    before:transition before:duration-200 
                    before:ease-in-out before:text-sub-crypto
                    before:content-[attr(data-set)] 
                  ${hoverOpacity}`}
            >{!content.change ? 'No info' : `${formatStringPrice(content.change.toString(), true)}%`}</h2>
            <motion.div
                layout
                className=" flex transition duration-200 ease-in-out
              items-center justify-center ">
                {logo}
            </motion.div>
        </motion.div>
    )
})

export default CryptoCard