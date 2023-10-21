import {DataApiObject, fetchPageData, NewsContent} from "./News";
import type {Voptions} from "./News";
import React, {useEffect, useRef, useCallback} from 'react'
import {ReactComponent as ArrowExpand} from '../../static assets/NewsCardExpand.svg'
import {AnimationControls, motion as m, useAnimation} from 'framer-motion'


interface PNewsCard {
    content: DataApiObject,
    changeContent: Function,
    selectedValue: Voptions,
    page: number,
    isLast: boolean,
    controlsP? : AnimationControls
}
export enum WhichContent {
    News,
    Nfts
}

const fetchNextPage = async (selected: Voptions, changeContent: Function, page: number) => {
    if (page + 1 === 9) {
        return
    }

    try {
        const nextPageData = await fetchPageData(page + 1, selected, 20)
        if(!nextPageData.articles){
            throw new Error()
        }
        changeContent((prev: NewsContent) => {
            let key = selected as keyof  Pick<NewsContent, "defi"|"web3"|"nfts">
            return {
                ...prev,
                [selected]: {
                    page: page + 1,
                    content: [...(prev[key].content ?? []), ...nextPageData.articles]
                },
                error : false
            }
        })

    }
    catch(err) {}

}

export const handleErrorImage = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    ev.stopPropagation()
    ev.preventDefault()

    if (!ev.target)
        return
    const target: HTMLElement = ev.target as HTMLElement
    const errorReplaceElement = document.createElement('div')
    errorReplaceElement.classList.add('img-problem')
    console.log(target, errorReplaceElement);
    (ev.target as HTMLElement).replaceWith(errorReplaceElement)

}
export const getImage = (url: string, title: string) => {

        const image: React.ReactElement = <img
            className="w-full opacity-50 md:h-[300px] shadow-[11px_14px_2px_#000000] left-0 z-0 top-0 h-[90%] absolute "
            src={url} alt={`image for ${title}`}
            onError={handleErrorImage}/>
        return image
}
const formatAuthor = (author: string|null): string|null => {
    if(!author) { return null }
    const authors = author.split(',')

    return authors.length > 1 ? `${authors[0]} and others` : authors[0]

}
const expandP = (
    ev:React.MouseEvent<SVGElement>,
    dir: boolean, anCon: AnimationControls,
    ref:React.RefObject<HTMLElement>,
    controlsP : AnimationControls|undefined
): void => {
    ev.stopPropagation()
    ev.preventDefault()

    if(!ref.current) { return }

    const Adir = dir ? 'clicked' : 'notClicked'
    const Pdir = dir ? 'animate' : 'initial'
    anCon.start(Adir)
    if(controlsP) {
        controlsP.start(Pdir)
    }
    ref.current.style.opacity = dir ? '100%' : '0%'
}
// 44
const getHeight = (dir: boolean) => {
    const width = window.innerWidth
    if(width < 400)
        return dir ?   '50vh' : '30vh'
    else if(width < 1000)
        return dir ? '30vh'  : '17vh'
    else
        return dir ? '500px' : '300px'
}
const NewsCard: React.FC<PNewsCard> = ({content, changeContent, selectedValue, page, isLast, controlsP }) => {

    let {urlToImage, title, url, author, description} = content

    const animation = useAnimation()
    const cardRef = useRef<HTMLDivElement>(null)
    const isLastFetch = useCallback((node:HTMLElement|null ) => {

        if (!node || !isLast || page === -1) {
            return
        }

        const observer = new IntersectionObserver( (entries) => {
            if (entries[0].isIntersecting) {
                fetchNextPage(selectedValue, changeContent, page)
                observer.disconnect()
            }
        }, {
            threshold : [0.8]
        })
        observer.observe(node)
    }, [isLast])



    return (

        <m.div
            style={{
                height: getHeight(false)
            }}
            variants={{
                notClicked: { height : getHeight(false)},
                clicked: {
                    height : getHeight(true),
                    transition: {
                        duration: 1,
                        type: 'easeInOut'
                    }
                }
            }}
            transition={{
                duration : 1,
                type : "easeInOut"
            }}
            animate={animation}
            className="h-[30vh] transition duration-500 ease-in-out   relative ">
            <div ref={isLastFetch} id={`this is the id ${title}`}  className="h-[30vh]    md:h-[300px] md:w-full text-content sm:h-[18vh] w-full shadow-md text-[#fff] relative z-10">
                    <div
                    className="grid grid-cols-1 grid-rows-[1fr,1fr,min-content] md:grid-rows-[1fr,min-content,min-content] backdrop-blur-[4px] gap-y-[0.5em] h-[90%] md:h-[300px] relative z-10 text-[#fff] ">
                    <div></div>
                    <div  className="flex  justify-center items-end relative z-10">
                        <div className="grid grid-cols-1 h-[90%]  w-[90%] gap-y-[5px] text-content   ">
                            <h2 className="  opacity-100 text-news-card-author text-active-nav-logos  text-end ">{formatAuthor(author)}</h2>
                            <h1 className="text-news-card-title  text-[#fff] opacity-100 flex  ">
                                <a href={url}
                                   className="backdrop-blur-[2px]"
                                >{title}
                                </a>
                            </h1>
                        </div>
                    </div>
                    <div  className="w-full flex justify-end">
                        <ArrowExpand  onClick={(ev) => {expandP(ev,true, animation, cardRef, controlsP)}}
                                     className="w-[1em]  h-[1em] mb-[1em] mr-[1em]"/>
                    </div>
                </div>
                <div className='absolute w-full h-[100%] -z-10 top-0 left-0'>
                    {getImage(urlToImage, title)}
                </div>
            </div>
            <div className="absolute z-0 left-0 top-0 h-full w-full flex flex-col justify-end items-center  ">
                <div
                    ref={cardRef}
                    className="w-[95%] md:h-[167px]  opacity-0 shadow-[8px_8px_2px_#000000]  card-info flex items-end flex-col transition duration-500 ease-in-out gap-[1em] bg-[#2f3338] rounded-lg p-[0.5em]">
                    <p className="  text-[#fff] overflow-hidden line-clamp-3 text-news-card-content flex-grow ">{description}</p>
                    <ArrowExpand onClick={(ev) => {expandP(ev,false, animation, cardRef, controlsP)}}
                                 className="w-[1em] h-[1em] rotate-[180deg] mb-[2px] mr-[2px] fill-[#fff]"/>
                </div>
            </div>
        </m.div>
    )
}

export default NewsCard