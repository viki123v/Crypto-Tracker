import {memo, PureComponent, useEffect, useMemo, useState} from "react";
import Loading from "../../error_loading/loadingPage.tsx";
import {XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart, CartesianGrid, Text} from "recharts";
import {motion} from 'framer-motion'
import React from 'react'
import {formatStringPrice, PriceData, CoinDesc, days, PricesSate, fetchPrices} from "./GraphVersions/graphHelpers.ts";
import {avaibleDays} from "./GraphVersions/graphHelpers.ts";

const styleH2 = 'text-active-nav-logos group-hover/tatko:opacity-100 max-content text-graph-content lg:text-[clamp(1.063rem,0.375vw+0.781rem,1.25rem)] text-center  opacity-50 '
const styleP = ' text-[#fff] max-content text-center text-sub-headers-graph'
const styleDivs = 'border-[#9b42b2] group/tatko px-[0.3em] mx-[0.2] hover:border-b-active-nav-logos flex   justify-between border-b-1 border-active-nav-logos'

interface CustomTooltipProps {
    active: boolean,
    payload: Array<{
        payload: PriceData
    }>
}

interface PGraph {
    isMobile:boolean,
    prices: PriceData[],
    desc: CoinDesc,
    changePriceState: Function,
    id: string,
    selectedDay: avaibleDays
}

type ArrayValuesOfMarketData<T extends marketDataObject<CoinDesc>> = Array<keyof T>
type marketDataObject<T extends CoinDesc> = T extends { market_data: infer U } ? U : T


const CustomTooltip = <T extends CustomTooltipProps, >(prop: T) => {
    if (prop.active) {
        const valueArr = prop.payload[0]
        return (
            <div className={'text-graph-content p-[1em] bg-nav-bar-pop rounded-xl '}>
                <p className="text-graph-content text-[#fff]">{valueArr.payload.x}</p>
                <p className="text-graph-content text-[#fff] mt-[20px]">
                    <span className="text-active-nav-logos">Price: &nbsp;</span>
                    {formatStringPrice(valueArr.payload.y.toString(), false)}$</p>
            </div>
        )
    }
    return <Loading/>
};

type TExpandObj = {
    shouldExpand: boolean,
    setShouldExpand: Function
}
const animateSpan = (
    ev: React.MouseEvent<HTMLElement>,
    setExpand: Function,
    expand: boolean
) => {
    // maxHeight: !shouldExpand ? '9ch' : 'fit-content'

    const ainmations = [
        {
            maxHeight: '9ch'
        },
        {
            maxHeight: 'fit-content'
        }
    ]
    const options: KeyframeAnimationOptions = {
        duration: 2,
        easing: 'ease-in-out',
        fill: 'forwards',
        direction: expand ? 'normal' : 'reverse'
    }

    if (!ev.target)
        return
    const target: HTMLElement & EventTarget = ev.currentTarget;
    target.animate(ainmations, options)
    setExpand(expand);
}
export const makeData = (
    coinDesc: CoinDesc,
    expandObject: TExpandObj,
    isMobile: boolean
): React.ReactElement | undefined => {
    if (coinDesc === null) {
        return
    }
    let filteredDesc = coinDesc.description.en.replace(/<a.+?>/gm, '')
    filteredDesc = filteredDesc.replace(/<\/a>/gm, '')

    const {shouldExpand, setShouldExpand} = expandObject
    const retriveDatFromMarketData = (market_data: marketDataObject<CoinDesc>) => {

        const infoThatWeNeed: ArrayValuesOfMarketData<typeof market_data> = [
            'market_cap_rank',
            'total_volume',
            'market_cap',
            'circulating_supply',
            'total_supply'
        ]

        const createElement = () => {
            if (market_data[i] instanceof Object) {
                return (market_data[i] as { usd: number }).usd
            } else {
                return market_data[i] as number
            }
        }
        const crateRealHeading = (heading: string): string => {
            let formatedStr = heading.split('_').map(val => {
                let strArr = [...val]
                strArr[0] = strArr[0].toUpperCase()
                return strArr.reduce((a, val) => `${a}${val}`, '')
            }).join(' ')
            return formatedStr;
        }
        const decideIfDollars = (i: (typeof infoThatWeNeed)[number]): string | undefined => {
            const boolDoll = i === 'market_cap' || i === 'total_volume'
            if (boolDoll) {
                return '$'
            }
            return undefined
        }


        let arr: Array<JSX.Element> = []
        let i: keyof typeof market_data;
        let current: number = 0

        for (i of infoThatWeNeed) {
            let element: number
            element = createElement()
            if (element !== null) {
                arr.push(
                    <div key={`info_${current}`}
                         className={`${styleDivs} w-full h-fit  border-[#572e62] flex justify-center border-b-1  text-sub-headers-graph `}>
                        <div
                            className=" flex justify-between lg:content-end w-[80%] flex-grow mb-[0.3em] lg:mb-0 px-[0.8em]">
                            <h2 className={`${styleH2} text-graph-content  relative `}>{crateRealHeading(i)}</h2>
                            <p className={`${styleP} relative `}>{decideIfDollars(i)}{formatStringPrice(element.toString(), false)}</p>
                        </div>
                    </div>
                )
            }
            current++
        }
        return arr
    }

    return (
        <>
            <div
                className="   gap-y-[1.8em] pt-[1em] grid grid-cols-1 justify-center">
                <div
                    className={`${styleDivs}  w-full h-fit border-[#572e62] flex justify-center  border-b-1 px-[0.3em] mx-[0.2]`}>
                    <div
                        className=" flex justify-between lg:mb-[0]  lg:mx-[0.8em] flex-grow w-[80%] px-[0.8em] mb-[0.3em]">
                        <h2 className={`${styleH2}`}>Rank</h2>
                        <p className={`${styleP}`}>{coinDesc.coingecko_rank}</p>
                    </div>
                </div>
                {retriveDatFromMarketData(coinDesc.market_data)}
            </div>
            <div className={'px-[1em] '}>
                <h2 className={`${styleH2} mb-[1em]`}>Description for Coin</h2>
                <motion.p
                    className={`indent-2 px-[1em] mt-[1em] mb-[1.5em] text-sub-headers-graph text-[#fff] `}
                    layout
                >
                    <span
                        style={{
                            opacity: !isMobile ? '100%' : !shouldExpand ? '60%' : '100%',
                            overflow: isMobile ? "hidden" : "scroll",
                            maxHeight: !isMobile ? '300px' : !shouldExpand ? '9ch' : 'fit-content'
                        }}
                        className="leading-[1.5em] inline-block scroll "
                    >{filteredDesc}
                    </span>
                    {isMobile &&
                        <motion.span
                            layout
                            transition={{
                                type: 'easeInOut',
                                duration: 1
                            }}
                            className=" cursor-pointer overflow-y-scroll px-[0.7em] border-b-1 border-[#9b42b2] mt-[20px] text-active-nav-logos "
                            onClick={(ev) => {
                                ev.stopPropagation();
                                ev.preventDefault();
                                animateSpan(ev, setShouldExpand, !shouldExpand);
                            }}>{!shouldExpand ? 'View more' : "Show less"}
                        </motion.span>}
                </motion.p>
            </div>
        </>
    )
}
const handleChangeDays = async (day: avaibleDays, id: string, changePriceState: Function): Promise<void> => {
    const prices = await fetchPrices(id, day)

    changePriceState({
        prices: prices,
        days: day
    })
}
export const useLoading =() => {
    const [loading , setLoading] = useState<boolean>(true)
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 600 )
    }, []);
    return {loading , setLoading }
}
let timer:NodeJS.Timeout
const Graph: React.FC<PGraph> = memo(({prices, isMobile, desc, changePriceState, id, selectedDay}) => {


    const [shouldExpand, setShouldExpand] = useState<boolean>(false)
    const [mobile, setMobile] = useState<boolean>(window.innerWidth < 1000)
    const {loading, setLoading} = useLoading( )


    useEffect(() => {
        const resize = () => {
            setMobile(window.innerWidth < 1000)
        }
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        }
    }, []);
    useEffect(() => {
        setLoading(true)
        if(timer)
            clearTimeout(timer)

        timer = setTimeout(() => {
            setLoading(false)
        }, 500 )

    }, [prices]);

    if(loading && !isMobile ) {
        return (
            <section className="text-text-desktop mt-[15vh] w-full h-full lg:mt-[11em]">
                <Loading />
            </section>
        )
    }


    return (
        <section className="lg:w-[50vw] mt-[5em] lg:mt-[9em] w-screen  lg:px-[3em] lg:grid lg:grid-rows-2 lg:h-[100vh]">
            <div className="w-full h-fit ">
                <motion.section className="text-sub-headers-graph w-full lg:mb-[2em]">
                    <div className="w-full h-fit flex justify-end mb-[2em] ">
                        <div className="flex flex-col w-fit    items-center  mr-[1em]">
                            <h2 className='w-[max-content] opacity-70 text-sub-headers-graph text-active-nav-logos mb-[0.3em]'>Select
                                days</h2>
                            <ol className={`list-none  px-[0.5em]  change_days   rounded-lg bg-[#23262a]  m-0  gap-[0.5em] flex  justify-between text-sub-headers-graph text-[#fff]`}>
                                {
                                    days.map(val => (
                                    <li
                                        style={{
                                            opacity: val === selectedDay ? 'opacity-100' : 'opacity-50',
                                            background: val === selectedDay ? '#38404b' : 'none'
                                        }}
                                        className={`opacity-70 text-[clamp(0.875rem,0.378vw+0.777rem,1.25rem)] rounded-[4px] px-[1.5px] cursor-pointer text-active-nav-logos my-[5px] `}
                                        key={val}
                                        onClick={() => {
                                            console.log(selectedDay)
                                            if (val !== selectedDay) {
                                                handleChangeDays(val, id, changePriceState)
                                            }
                                        }}
                                    >
                                        {val}D
                                    </li>
                                    ))
                                }
                            </ol>
                        </div>
                    </div>
                    <section className="w-screen h-fit lg:w-full lg:h-full flex justify-center items-center ">
                        <div className="w-[90vw] lg:w-[80%] h-[30vh] lg:h-[400px] relative right-[1em]">
                            <ResponsiveContainer
                                width= '100%'
                                height="100%"
                            >
                                <AreaChart width={1000} height={1000} data={prices}>

                                    <defs>
                                        <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#c685d6" stopOpacity={0.5}/>
                                            <stop offset='80%' stopColor="#c685d6" stopOpacity={0.1}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid opacity={0.1} horizontal={false} x={3} strokeDasharray={''}
                                                   vertical={false}/>
                                    <XAxis dataKey='x' style={{color: 'red'}} tickCount={4} tickLine={false}/>
                                    <YAxis type="number" domain={[0, (dataMax: number) => dataMax + 1000]}
                                           axisLine={false}
                                           tickLine={false}
                                           tickFormatter={(val) => ''}/>
                                    {/*@ts-ignore*/}
                                    <Tooltip content={<CustomTooltip/>} allowEscapeViewBox={{x: false, y: false}}/>
                                    <Area dot={false} stroke="#c685d6" dataKey='y' fill={'url(#gradient)'}
                                          activeDot={{r: 2}} type="monotone"/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                </motion.section>
                <section
                    className='mt-[2em] pt-[1.5em] description lg:h-fit  h-[50%] bg-[#23262a] grid grid-rows-[min-content,min-content] gap-y-[2em]'>
                    {makeData(desc, {shouldExpand: shouldExpand, setShouldExpand,}, mobile)}
                </section>
            </div>
        </section>
    )
})

export default Graph