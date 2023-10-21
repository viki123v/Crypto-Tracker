import React, {useEffect, useState, memo } from 'react'
import Graph from "../Graph";
import apis from "../../apisConfig";
import {PricesSate, CoinDesc, fetchPrices, fetchDesc} from "./graphHelpers";
import Loading from "../../../error_loading/loadingPage.tsx";

interface PGraphDesk {
    idCoin: string
}


const isString = (item : any) :item is string => typeof item === 'string'
const GraphDesk: React.FC<PGraphDesk> = memo(({idCoin}) => {

    const [pricesDays, setPricesDays] = useState<PricesSate | null>({
        days: 3,
        prices: []
    })
    const [desc, setDesc] = useState<CoinDesc|null>(null)


    useEffect(() => {
        const handleInitalFetch = async () => {
            const prices = await fetchPrices(idCoin, 3)
            const desc = await fetchDesc(idCoin)
            if(isString(prices) || isString(desc) ) {
                setPricesDays(null);
                setDesc(null) ;
                return
            }
            setDesc(desc)
            setPricesDays({
                prices: prices,
                days: 3
            })
        }
        handleInitalFetch().then(_ => { })

    }, [idCoin]);



    if(!pricesDays || !desc  ) {
        return (
        <div className="w-full h-full flex justify-center ">
            <p className="text-text-desktop mt-[12em] text-active-nav-logos">There was an error </p>
        </div>
        )
    }

    return (
        <>
            <Graph
                isMobile={false}
                prices={pricesDays.prices} desc={desc} changePriceState={setPricesDays} id={idCoin}
                selectedDay={pricesDays.days}/>
        </>
    )
})

export default GraphDesk