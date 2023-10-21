import ApsContentSearch from "./apsContent/ApsContentSearch.tsx";
import React, {useEffect, useState} from "react";
import {createContext} from 'react'
import GraphDesk from "./Graph/GraphVersions/GraphDesk.tsx";

interface FilterProps {
    isMobile: boolean
}

export const ContextMobile = createContext<boolean | null>(null)

export const filters = [
    'All',
    'Wachlist',
    'Trending'
] as const
type getValuesArray<T extends Array<any> | readonly string[]> = T[number]

export type FilterValues = getValuesArray<typeof filters>
let timer: NodeJS.Timeout
const clickAnimations = (
    ev: React.MouseEvent<HTMLButtonElement>,
    filter : FilterValues,
    setFilter : Function,
    val :FilterValues,
    setLoading : Function
) => {
    ev.stopPropagation();
    const target  = ev.target;
    if(!target)
        return
    const el = target as HTMLElement
    el.animate([
        {transform: 'scale(1)'},
        {transform: 'scale(0.8)'},
        {transform: 'scale(1)'}
    ], {
        easing: 'ease-in-out',
        duration: 300,
    })
    if (filter === val) {
        return
    }
    setFilter(val)
    setLoading(true)
    if(timer)
        clearTimeout(timer)

    timer = setTimeout(() => {
        setLoading(false)
    }, 500 )
}
const Filter: React.FC<FilterProps> = ({isMobile}) => {

    const [filter, setFilter] = useState<FilterValues>('All')
    const [activeGraphContent, setActiveGraphContent] = useState<string>('bitcoin')
    const [width, setWidth] = useState<boolean>(window.innerWidth > 1000 )
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const func = (ev: Event) => {
            ev.stopPropagation();
            setWidth(window.innerWidth > 1000)
        }
        window.addEventListener('resize', func )
        return ( ) => {
            window.removeEventListener('resize',func)
        }
    }, []);

    return (
        <ContextMobile.Provider value={isMobile}>
            <section className="w-screen mt-[9em] lg:mt-0  h-screen lg:grid lg:grid-cols-[50vw,50vw]  ">
                <section className="grid z-0 relative grid-cols-1 lg:mt-[11em]  mt-[15vh] lg:gap-y-[1em] lg:justify-start lg:grid-rows-[repeat(3,min-content)]  gap-y-[2em] place-items-center bg-background-color  ">
                    <section className="text-content  text-[#fff] grid place-content-center w-full ">
                        <div className="grid grid-cols-3 gap-x-[1.2em] justify-between place-items-center">
                            {
                                filters.map((val) =>
                                    (
                                        <button
                                            key={val}
                                            className={`
                                            border-none text-[#fff] 
                                            change_filter_buttons text-fiter-text
                                            hover:opacity-100 rounded-2xl  w-[5em]
                                            h-[2em] py-[0.2em] px-[0.1em] cursor-pointer
                                            hover:bg-active-filter-color lg:text-text-desktop
                                            ${filter === val ? 'bg-active-filter-color opacity-100'
                                                    : 'bg-inactive-filter-color opacity-70'}
                                        `}
                                            onClick={(ev) => {clickAnimations(ev, filter, setFilter, val, setLoading  )} }
                                        >{val}
                                        </button>
                                    ))
                            }
                        </div>
                    </section>
                    <ApsContentSearch setActiveGraph={setActiveGraphContent} loading={loading} activeFilter={filter}/>
                </section>
                {width &&
                    (
                        <section>
                            <GraphDesk idCoin={activeGraphContent}/>
                        </section>
                    )
                }
            </section>
        </ContextMobile.Provider>

    )

}

export default Filter