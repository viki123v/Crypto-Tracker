/// <reference types="vite-plugin-svgr/client" />

import React, {useState, memo, useMemo} from 'react'
import type {Voptions, NewsContent, DataApiObject} from "../../News/News.tsx";
import {fetchPageData, options} from "../../News/News.tsx";
import {
    Content,
    GeneralContentObject,
    TrendingApiContent,
    TrendingContetnObject
} from '../apsContent/ApsContentSearch.tsx'
import apis from "../apisConfig.ts";
import {useLoaderData} from "react-router-dom";
import {ReactComponent as SearchIcon} from '../../../static assets/searchIcon.svg'
import {getDoc, doc} from 'firebase/firestore'
import {fireStore} from "../../../firebaseConfig.ts";
import {FilterValues} from "../Filter.tsx";
import {resetSearch} from "./useSearch.ts";
import {transformTrendingContent} from "../apsContent/ApsContentSearch.tsx";
import {getContent} from "../apsContent/ApsContentSearch.tsx";

type TFilter = 'All' | 'Wachlist' | 'Trending' | "News"

interface CryptoSearchProps {
    setContent: Function,
    filter: TFilter,
    wachlist?: string[]
    selectedOption?: Voptions,
}

const searchInApi = async (
    searchValue: string,
    setContent: Function,
    initalContent: {wrapper : Content<GeneralContentObject | TrendingContetnObject>},

) => {

    if (searchValue === '') {
        console.log(initalContent);

        setContent(initalContent.wrapper );
        return
    }

    const getMap = async () => {
        const searchDoc = (await getDoc(doc(fireStore, 'search', 'refrence'))).data()
        return searchDoc
    }


    let arrSearchIds: string[] = []
    const mapSearch = await getMap() as { [K: string]: string }

    for (let i in mapSearch) {
        if (i.toLowerCase().includes(searchValue.toLowerCase())) {
            arrSearchIds.unshift(mapSearch[i])
        }
    }
    const coinData = await (await fetch(apis.crypto.search(...arrSearchIds))).json()
    const content = {
        content: {
            coins: coinData
        },
        page: -1,
    }
    setContent(content)
}
const resetCryptoSearchInital = async (
    filter: TFilter,
    setContent: Function,
    wachlist: string[]
) => {
    const getFromCache = () => {
        const windowData = window.localStorage.getItem('data20');
        if (windowData) {
            const data = JSON.parse(windowData) as Content<GeneralContentObject>;
            return data
        }
    }

    if (filter === "All") {
        setContent(getFromCache());
    }else {
        await getContent(filter as FilterValues, setContent,()=>{},wachlist )
    }
}
const filterWachlistContent = async (
    filter: TFilter,
    searchValue: string,
    setContent: Function,
    wachlist: string[] | undefined
) => {
    if (searchValue === "" && wachlist) {
        await resetCryptoSearchInital(filter, setContent, wachlist);
        return
    }
    // reset ke trebat da udrime
    setContent((prev: Content<GeneralContentObject | TrendingContetnObject>) => {
        if (!prev.content || !prev.content.coins) {
            return
        }

        return {
            page: -1,
            content: {
                coins: prev.content.coins.flatMap(val => {
                    if (val.name.toLowerCase().includes(searchValue.toLowerCase())) {
                        return val
                    }
                    return []
                })
            }
        }
    })
}

export const giveDebounce = () => {
    let timer: NodeJS.Timeout

    return (
        funcCallBack: Function
        , delay: number
        , ...funcArgs: any
    ) => {
        if (timer)
            clearTimeout(timer)
        timer = setTimeout(() => {
            funcCallBack(...funcArgs)
        }, delay)
    }
}

const reset = async (setContent: Function, selected?: Voptions) => {

    if (selected) {
        const data = await fetchPageData(1, selected, 20)
        setContent((prev: NewsContent) => {
            return {
                ...prev,
                [selected]: {
                    content: data.articles,
                    page: -1,
                }
            }
        })
    } else {
        let data: Array<DataApiObject[]> = [[]]
        for (let opt of options) {
            const dataApi = await fetchPageData(1, opt, 20)
            data.push(dataApi.articles)
        }
        setContent({
            defi: {
                page: -1,
                content: data[0]
            },
            nfts: {
                page: -1,
                content: data[1]
            },
            web3: {
                page: -1,
                content: data[2]
            }
        })
    }
}
const desktopSearch = async (setContent: Function, searchValue: string) => {
    let data: Array<DataApiObject[]> = []
    for (let selected of options) {
        const dataApi = await fetchPageData(1, selected, 100)
        const fitleredData = dataApi.articles.filter(val => val.title.includes(searchValue))
        data.push(fitleredData)
    }
    setContent((prev: NewsContent) => {
        const page = -1
        return {
            nfts: {
                content: data[0],
                page
            },
            web3: {
                content: data[1],
                page
            },
            defi: {
                content: data[2],
                page
            }
        }
    })
}
const mobileSearch = async (selectedOpt: Voptions, searchValue: string, setContent: Function) => {
    const dataApi = await fetchPageData(1, selectedOpt, 100)
    let filteredData = dataApi.articles.filter(val => val.title.includes(searchValue))
    // ova vo search da ojt a reset so fetchPageData
    console.log(searchValue)
    setContent((prev: NewsContent) => {
        return {
            ...prev,
            [selectedOpt]: {
                content: filteredData,
                page: -1
            }
        }
    })
}
const dealWithChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
    filter: TFilter,
    inputObj: { val: string, func: Function },
    initalContent: Content<GeneralContentObject>,
    selectedOption: Voptions | undefined,
    setContent: Function,
    wachlist: string[] | undefined
) => {
    const input = ev.target as HTMLInputElement
    inputObj.func(input.value)
    if (filter === 'News') {
        debounceFunc(decideNewsSearch, 500, selectedOption, input.value, setContent)
    } else if (filter !== 'All') {
        debounceFunc(filterWachlistContent, 500, filter, input.value, setContent, wachlist)
    } else {
        // searchValue: string,
        //     setContent: Function,
        //     initalContent: Content<GeneralContentObject | TrendingContetnObject>,
        //
        debounceFunc(searchInApi, 500, input.value,setContent , initalContent  )
    }
}
const decideNewsSearch = async (selectedOpt: Voptions | undefined, searchValue: string, setContent: Function) => {
    if (searchValue == '')
        await reset(setContent, selectedOpt)
    else if (selectedOpt)
        await mobileSearch(selectedOpt, searchValue, setContent)
    else
        await desktopSearch(setContent, searchValue)
}

const debounceFunc = giveDebounce();
const CryptoSearch: React.FC<CryptoSearchProps> = memo(({setContent, filter, wachlist, selectedOption}) => {
    const [searchValues, setSearchValues] = useState<string>('')
    const initalContent = useLoaderData() as Content<GeneralContentObject>
    

    return (
        <>
            <section
                className='lg:self-end text-content relative order-1 lg:text-text-desktop grid grid-placement  w-[60%] sm:w-[40%] max-w-[270px]'>
                <input
                    className="bg-back-col border-1
                        w-full h-full peer/input-search
                        focus-visible:outline-none lg:text-text-desktop
                        text-fiter-text border-inactive-color focus-visible:border-logo
                         text-[#fff] rounded-xl  pl-[2.3em] p-[0.5em]"
                    type="text"
                    value={searchValues}
                    onChange={(ev) => {
                        dealWithChange(ev, filter, {val: searchValues, func: setSearchValues}, initalContent, selectedOption, setContent, wachlist)
                    }}
                />
                <div className="w-[2em] h-full  flex justify-center items-center absolute ">
                    <div className="pr-[0.1em] border-r-1 border-active-nav-logos  ">
                        <SearchIcon className="w-[1em] h-[1em] "/>
                    </div>
                </div>
            </section>
        </>
    )
})
export default CryptoSearch
