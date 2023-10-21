import Search from "../search/Search";
import {FilterValues} from "../Filter";
import React, {useState, useEffect, useRef} from 'react'
import apis from "../apisConfig.ts";
import {useLoaderData, useOutletContext} from "react-router-dom";
import {default as ErrorComponent} from "../../error_loading/errorComponent.tsx";
import CryptoCard from "../CryptoCard.tsx";
import Loading from "../../error_loading/loadingPage.tsx";
import {UserDoc} from "../../navigation/Navbar.tsx";
import type {LoaderContent} from "./loaderHook.tsx";
import WaclistLogoAnimated from "../../../static assets/WaclistLogoAnimated.tsx";
import {useLoading} from "../Graph/Graph.tsx";


const upContent = [
    'Image',
    'Name',
    'Price',
    'Change',
    'Add to wachlist'
] as const
export type valueKeysObject<T extends UserDoc, K extends keyof T> = T[K]
export type Wachlist = valueKeysObject<UserDoc, 'wachlist'>

interface TApsContentSearch {
    activeFilter: FilterValues,
    setActiveGraph: Function,
    loading :boolean
}

export interface TrendingApiContent {
    coins: Array<{ item: TrendingContetnObject }>
}

export interface CommonContentObject {
    name: string,
    price: number,
    id: string,
    image: string,
    change: number
}

export interface GeneralContentObject {
    name: string,
    id: string,
    image: string,
    price_change_percentage_24h: number,
    current_price: number
}

export interface TrendingContetnObject {
    name: string,
    id: string,
    small: string,
    price_btc: number
}

export type Coins = TrendingContetnObject [] | GeneralContentObject[] | CommonContentObject[]

export interface Content<T> {
    content: {
        coins: T[] | null
    },
    page: number
}

export const awaitng = async (url: string): Promise<GeneralContentObject[] | TrendingApiContent> => {
    const data = await (await fetch(url)).json() as (GeneralContentObject)[] | TrendingApiContent
    return data
}
export const generateCommonContent = (
    coins: TrendingContetnObject | GeneralContentObject | CommonContentObject,
    priceBTC?: number
): CommonContentObject => {

    if ('change' in coins) {
        return coins
    }

    let id: string,
        price: number,
        change: number,
        name: string,
        image: string
    if ('small' in coins) {
        const priceBTC2 = priceBTC ?? 2;
        console.log(priceBTC2) ;
        [id, price, change, name, image] = [coins.id, (coins.price_btc * priceBTC2), (coins.price_btc * priceBTC2), coins.name, coins.small]
    } else {
        [id, price, change, name, image] = [coins.id, coins.current_price, coins.price_change_percentage_24h, coins.name, coins.image]
    }
    return {id, price, change, name, image}
}

export const transformTrendingContent = (data: TrendingApiContent): Content<TrendingContetnObject> => {
    return {
        content: {
            coins: data.coins.map(coin => coin.item)
        },
        page: -1,
    }
}
export const getContent = async (
    activeFilter: FilterValues,
    setContent: Function,
    setError?: Function,
    wachlist?: string[]
): Promise<void> => {



    let fetchedContent: Content<GeneralContentObject | TrendingContetnObject> | null = null


    switch (activeFilter) {
        case 'Trending' :
            fetchedContent = transformTrendingContent(await awaitng(apis.crypto.trending()) as TrendingApiContent)
            break;
        case "Wachlist":
            if (!wachlist || wachlist.length === 0) {
                setContent({
                    content: {
                        coins: undefined
                    },
                    page: -1
                })
                return
            }
            try {
                const dataWachlistCoins = await awaitng(apis.crypto.search(...wachlist)) as GeneralContentObject[]
                setContent({
                    content: {
                        coins: dataWachlistCoins
                    },
                    page: -1
                })
            }catch(e) {
                setContent({
                    content: {
                        coins: undefined
                    },
                    page: -1
                })
                return
            }
            break;
    }
    if (fetchedContent) {
        setContent(fetchedContent)
    }
}
const decideLogo = (
    val: CommonContentObject,
    wachlist: {
        wachlist: string[] | undefined,
        changeWachlist: Function
    },
    changeContent: Function,
    activeFilter: FilterValues
): React.ReactElement => {
// true go imat veke / false go nemat

    return <WaclistLogoAnimated className="w-[2em] h-[2em]"
                                wachlist={wachlist.wachlist}
                                changeContent={changeContent}
                                id={val.id}
                                currentPrice={val.price}
                                activeFilter={activeFilter}
                                changeWachlist={wachlist.changeWachlist}/>
}

const mapContent = (
    content : Content<TrendingContetnObject | GeneralContentObject> | null ,
    loadingData : LoaderContent |string,
    activeFilter : FilterValues,
    wachlistObj : {func: Function, value : string [] | undefined },
    setContent : Function,
    setActiveGraph : Function
) => {
    if(!content || !content.content || !content.content.coins || typeof loadingData === 'string') {
        return <p className="text-content text-[#fff] p-[2em]">There is no content </p>
    }
    return  content.content.coins.map((val: GeneralContentObject | TrendingContetnObject, indx: number) => {
        const commonContent = generateCommonContent(val, loadingData.btcPrice  )
        const shouldAddItemRef = !(activeFilter === 'All') ? false : !content.content.coins ? false : content.content.coins.length === 0 ? false :
            indx === content.content.coins.length - 1
        return (
            <CryptoCard
                page={content.page}
                lastItem={shouldAddItemRef}
                logo={decideLogo(commonContent, {
                    wachlist: wachlistObj.value,
                    changeWachlist: wachlistObj.func
                }, setContent, activeFilter)}
                key={val.id}
                content={commonContent}
                func={{setContent: setContent, setActiveGraph: setActiveGraph}}/>
        )
    })
}
const LoadingComponent = ( ) => {
    return (
        <div className='w-full h-full mt-[2em]'>
            <Loading />
        </div>
    )
}
const ApsContentSearch: React.FC<TApsContentSearch> = ({activeFilter, setActiveGraph, loading :fitlerHasChanged }) => {

    // samo da go najsh zasho ne go klajsh tuka contentot
    const loaderData = useLoaderData() as LoaderContent|string
    const wachlistContext = useOutletContext() as { wachlist : string[]|undefined , set : Function  }

    const [content, setContent] = useState<Content<GeneralContentObject | TrendingContetnObject>|null>(typeof loaderData === 'string' ? null : loaderData.wrapper)
    const [error, setError] = useState<string | null>(null)
    const {loading, setLoading } = useLoading()


    useEffect(() => {
        if (activeFilter !== 'All') {
            getContent(activeFilter, setContent, setError, wachlistContext.wachlist).then(_ => {}) ;
        } else if(typeof loaderData !== 'string'){
            setContent(loaderData.wrapper)
        }
    }, [activeFilter])


    return (
        <>
            <Search setContent={setContent} wachlist={wachlistContext.wachlist} filter={activeFilter}/>
            <section
                className=" md:overflow-y-scroll scroll relative mt-[2em] w-full   sm:px-[1em] py-[1em] bg-nijansa-nav-bar grid grid-cols-1 gap-y-[1em] sm:w-[90%] mb-[2em]">
                <section className='w-full  hover:border-active-nav-logs mb-[1em]'>
                    <ul className='grid grid-cols-5 place-items-center  border-b-1 border-inactive-color
                     hover:border-active-nav-logos group/ul pb-[0.5em] list-none px-0'>
                        {
                            upContent.map(val => {
                                return (
                                    <li
                                        key={val}
                                        className="text-sub-content   text-active-nav-logos break-words text-center"
                                    >
                                        {val}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </section>
                <section className='w-full gap-y-[2em] items-start auto-rows-min lg:max-h-[1238px]  grid gird-cols-1  lg:overflow-y-scroll scroll h-[fit-content]'>
                    {
                        error !== null  ?
                        <ErrorComponent message={error} isError={true}/>
                            :(loading || fitlerHasChanged )?
                            <LoadingComponent />
                            : (content?.content && content.content.coins && content.content.coins.length === 0) ?
                                     <p className="text-content text-active-nav-logos">There is no content </p>
                                :
                                    mapContent(content, loaderData, activeFilter, {value : wachlistContext.wachlist, func : wachlistContext.set }, setContent, setActiveGraph)
                    }
                </section>
            </section>
        </>
    )
}

export default ApsContentSearch