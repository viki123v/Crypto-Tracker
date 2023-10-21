import React, {useState, memo, useEffect, WheelEventHandler, WheelEvent, useRef} from 'react'
import apis from "../crypto_price/apisConfig.ts";
import {useLoaderData} from "react-router-dom";
import Search from "../crypto_price/search/Search.tsx";
import NewsCard from "./NewsCard.tsx";
import {AnimationControls, motion as m, useAnimation} from 'framer-motion'


export const options = [
    'defi',
    'nfts',
    'web3',
] as const
const styleDeskH = 'text-active-nav-logos border-active-nav-logos border-b-1  text-news-header mb-[0.5em]  ml-[2em] mt-[1em]'
const styleDivs = 'h-full  w-full z-1 relative flex'
const styleSec = 'overflow-x-scroll   px-[1em] scroll h-[300px] w-full justify-center z-10  transition duration-200 min-h-[fit-content] items-center '
const variantsS = {
    initial: {
        height: 300
    },
    animate: {
        height: 500,
        transition: {
            duration: 1,
            delayChildren: 2,
            type: 'linear'
        }
    }
}

export interface DataApiObject {
    title: string,
    urlToImage: string,
    url: string,
    author: string,
    description: string

}

export type Voptions = (typeof options)[number]
export type NewsContent = {
    [K in Voptions]: {
        content: Array<DataApiObject> | null,
        page: number
    }
} & {
    error: boolean
}

interface PNews {
}

interface DataApiFetch {
    articles: Array<DataApiObject>
}

type Keys = {
    content: DataApiObject[] | null,
    page: number
}
type StartingContent = {
    [K in keyof Pick<NewsContent, 'defi' | 'web3' | 'nfts'>]: Keys | null
}
const makeContent = (
    error: boolean,
    content: (DataApiFetch | null)[],
    pages: number[]
): NewsContent => {

    const keys: Array<keyof Pick<NewsContent, 'defi' | 'web3' | 'nfts'>> = ['defi', 'nfts', 'web3']
    let obj: StartingContent = {
        defi: null,
        web3: null,
        nfts: null
    }

    for (let i = 0; i < 3; i++) {
        obj[keys[i]] = {
            content: content[i]?.articles ?? null,
            page: pages[i]
        }
    }
    return obj as NewsContent

}
export const initalLoadNews = async (): Promise<NewsContent | undefined> => {
    const mobile: boolean = window.innerWidth < 1000
    let urls: string | string[]
    const error = {
        page: [0, 0, 0],
        error: true,
        arr: [null, null, null]
    }
    if (mobile) {
        try {
            urls = apis.news.getContent('defi', 1, 20)
            const dataApi = await (await fetch(urls)).json() as DataApiFetch
            return makeContent(false, [dataApi, null, null], [1, 0, 0])
        } catch (err) {
            return makeContent(error.error, error.arr, error.page);
        }
    } else {
        try {
            urls = options.map(val => apis.news.getContent(val, 1, 20))
            let dataArr: DataApiFetch[] = []
            for (let url of urls) {
                const dataAPi = await (await fetch(url)).json()
                dataArr.push(dataAPi)
            }
            let page = 1
            return makeContent(false, dataArr, [page, page, page]);
        } catch (e) {
            return makeContent(error.error, error.arr, error.page);
        }
    }
}
export const fetchPageData = async (page: number, selected: Voptions, perPage: number): Promise<DataApiFetch> => {
    const dataApi = await (await fetch(apis.news.getContent(selected, page, perPage))).json()
    return dataApi
}
const changeSelectOptions = async (
    changeToSelectedUpercase: Voptions,
    prevContent: NewsContent,
    changeSelected: Function,
    changeContent: Function,
) => {

    const changeToSelected: Voptions = changeToSelectedUpercase.toLowerCase() as Voptions

    let prevContentObject = prevContent[changeToSelected]

    if (prevContentObject.page !== 0) {
        changeSelected(changeToSelected)
        return
    }
    const dataApi = await fetchPageData(1, changeToSelected, 20)
    changeSelected(changeToSelected)
    changeContent((prev: NewsContent) => {
        return {
            ...prev,
            [changeToSelected]: {
                page: 1,
                content: dataApi.articles
            }
        }
    })

}


function makeCards(
    content: NewsContent['defi'],
    setContent: Function,
    selectedValue: Voptions,
    desk: boolean,
    animationC?: AnimationControls
) {
    if (content.content?.length === 0 || !content.content) {
        return <p className="text-graph-content text-active-nav-logos ml-[2em]">No content</p>
    }
    return content.content.map((contentItem, indx) => {
        const {content: contentList} = content
        let isLast = false
        let length = contentList?.length
        if (length && indx === length - 1)
            isLast = true
        if (desk) {
            return (
                <m.div
                    key={`${selectedValue} ${indx}`}
                    transition={{
                        duration: 1,
                        delayChildren: 2,
                        type: 'linear'
                    }}
                    variants={variantsS}
                    animate={animationC}
                    className="min-w-[400px] basis-[400px]  mr-[2em] news-cards animate-cards_opacity">
                    <NewsCard
                        isLast={isLast}
                        content={contentItem}
                        changeContent={setContent}
                        selectedValue={selectedValue}
                        page={content.page}
                        controlsP={animationC}
                    />
                </m.div>
            )
        } else {
            return <NewsCard isLast={isLast} key={`${selectedValue}${indx}`} content={contentItem}
                             changeContent={setContent}
                             selectedValue={selectedValue} page={content.page}/>
        }
    })
}

const setSearchSelect = (selected: Voptions): undefined | Voptions => {
    if (window.innerWidth < 1000) {
        return selected
    } else {
        return
    }
}

// treba da se skewnit se dur ne se pominat 500ms
const skew = (): (ev: WheelEvent) => void => {
    let timer: NodeJS.Timeout | undefined;
    let skewed: boolean = false
    return (ev: WheelEvent) => {
        const target = ev.currentTarget as HTMLElement
        const children = [...target.children] as HTMLElement[]

        if (!skewed) {
            children.forEach(child => {
                child.style.transform = 'skew(-5deg)'
            })
            skewed = true
        }
        if (timer)
            clearTimeout(timer)

        timer = setTimeout(() => {
            children.forEach(child => {
                child.style.transform = 'skew(0)'
            })
            skewed = false
            clearTimeout(timer)
            timer = undefined
        }, 300)
    }
}


const News: React.FC<PNews> = memo(() => {

    const initalContent = useLoaderData() as NewsContent
    const [isMobile, setMobile] = useState(window.innerWidth < 1000)
    const [content, setContent] = useState<NewsContent>(initalContent)
    const [selectOptions, setSelectOptions] = useState<Voptions>('defi')

    const animationDefi = useAnimation()
    const animationNfts = useAnimation()
    const animationWeb3 = useAnimation()

    const section1 = useRef<HTMLDivElement>(null)
    const section2 = useRef<HTMLDivElement>(null)
    const section3 = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const func = (ev: Event) => {
            ev.stopPropagation();
            ev.preventDefault()
            if (isMobile && window.innerWidth > 1000) {
                window.location.reload()
            }
            setMobile(window.innerWidth < 1000)
        }
        window.addEventListener('resize', func)
        return () => {
            window.removeEventListener('resize', func)
        }

    }, []);

    useEffect(() => {
        const skews = [skew(), skew(), skew()]
        const el = [section1, section2, section3]
        el.forEach((sec, i) => {
            if (!sec.current)
                return
            const func = skews[i] as WheelEventHandler;
            //@ts-ignore
            sec.current.addEventListener('wheel', func, {passive: false})
        })
    }, []);

    return (
        <article className="grid grid-cols-1 mt-[7em] md:mt-[12em] place-items-center ">
            <div className='w-[80vw]  flex justify-center items-center '>
                <Search setContent={setContent} filter={'News'} selectedOption={setSearchSelect(selectOptions)}/>
            </div>
            {isMobile &&
                <section className="mt-[1em] w-screen flex justify-center ">
                    <div className="w-[90vw] flex justify-end  ">
                        <select
                            className="
                            focus-visible:outline-none focus-visible:border-none
                            text-active-nav-logos p-[1em]
                            border-none bg-[#1c1e21]  border-b-1 border-b-active-nav-logos"
                            onChange={(ev) => {
                                ev.stopPropagation()
                                ev.preventDefault()
                                if (!ev.target || ev.target.value === selectOptions) {
                                    return
                                }
                                changeSelectOptions(ev.target.value as Voptions, content, setSelectOptions, setContent).then(_ => { })
                            }}>
                            {options.map((val, i) => (
                                <option
                                    className='bg-[transparent] text-graph-content text-active-nav-logos'
                                    key={val}>{val.toUpperCase()}</option>
                            ))}
                        </select>
                    </div>
                </section>
            }
            {isMobile ?
                (
                    <m.section className="w-screen flex justify-center mt-[2.5em]   ">
                        <div
                            className={`w-[90vw] sm:w-[70vw]   grid grid-cols-1 gap-y-[2em] lg:gap-y-[2em] md:gap-y-[9em] text-graph-content `}>
                            {makeCards(content[selectOptions], setContent, selectOptions, !isMobile)}
                        </div>
                    </m.section>
                ) :
                (
                    <section
                        className={`grid grid-cols-1  w-[95vw] px-[10vh] gap-y-[3em]  text-graph-content h-auto mb-[1em]`}>
                        <h1 className={styleDeskH}>Nfts news</h1>
                        <m.section
                            transition={{
                                duration: 1,
                                delayChildren: 2,
                                type: 'linear'
                            }}
                            variants={variantsS}
                            animate={animationNfts}
                            className={styleSec}>
                            <m.div
                                ref={section1}
                                layout className={`${styleDivs} scrollable`}>
                                {makeCards(content['nfts'], setContent, 'nfts', !isMobile, animationNfts)}
                            </m.div>
                        </m.section>
                        <h1 className={styleDeskH}>Web3 news</h1>
                            <m.section
                                transition={{
                                    duration: 1,
                                    delayChildren: 2,
                                    type: 'linear'
                                }}
                                variants={variantsS}
                                animate={animationWeb3}
                                className={styleSec}>
                                <m.div
                                    ref={section2}
                                    layout className={`${styleDivs} scrollable`}>
                                    {makeCards(content['web3'], setContent, 'web3', !isMobile, animationWeb3)}
                                </m.div>
                            </m.section>
                        <h1 className={styleDeskH}>Defi news</h1>
                        <m.section
                            transition={{
                                duration: 1,
                                delayChildren: 2,
                                type: 'linear'
                            }}
                            variants={variantsS}
                            animate={animationDefi}
                            className={`${styleSec} mb-[5em]`}>
                            <m.div
                                ref={section3}
                                onWheel={skew()}
                                layout className={`${styleDivs} scrollable `}>
                                {makeCards(content['defi'], setContent, 'defi', !isMobile, animationDefi)}
                            </m.div>
                        </m.section>
                    </ section>
                )}
        </article>
    )
})

export default News