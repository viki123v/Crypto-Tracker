import {useLoaderData, useParams} from "react-router-dom";
import {LoaderFunctionArgs} from "@remix-run/router/utils";
import Graph from "../Graph";
import {CoinDesc, fetchDesc, fetchPrices, PriceData, PricesSate} from "./graphHelpers";
import React,{useState, memo } from "react";

interface ReturnLoader {
    desc: CoinDesc,
    prices: PricesSate,
    idCoin: string
}

export const loaderGraphMobile = async ({request, params }: LoaderFunctionArgs): Promise<ReturnLoader | string > => {

    const {id: idCoin} = params as  {id: string }

    const prices: PriceData[]| string  = await fetchPrices(idCoin, 3)
    const desc: CoinDesc | string  = await fetchDesc(idCoin)

    if(
        typeof prices === 'string' || typeof desc === 'string'
    )  {
        return "There is an error"
    }

    return {
        desc ,
        prices: {
            prices: prices,
            days: 3
        },
        idCoin
    }
}

const GraphMobile = memo(() => {

    const loaderRezult = useLoaderData() as ReturnLoader| string
    const isString = typeof loaderRezult === 'string'
    const [Sdesc, _] = useState<CoinDesc|null>(isString ? null : loaderRezult.desc)
    const [SpricesDays, setPricesDays] = useState<PricesSate|null>(isString ? null : loaderRezult.prices)

    if(isString || !(Sdesc && SpricesDays)){
        return <p className="text-active-nav-logos text-graph-content">There is an error </p>
    }

    return (
        <>
            <Graph isMobile={true}
                prices={SpricesDays.prices} desc={Sdesc} changePriceState={setPricesDays} id={loaderRezult.idCoin}
                   selectedDay={SpricesDays.days}/>
        </>
    )
})

export default GraphMobile