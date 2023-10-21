import apis from "../../apisConfig.ts";
export const days = [1,3,7,14,31] as const
export type MarketCharJsonData = [number,number]
export type avaibleDays = (typeof days)[number]

export interface PriceData {
    x : string,
    y : number
}
export interface PricesSate{
    prices : PriceData[],
    days : avaibleDays
}
interface PricesFromApi  {
    prices :Array<[number, number]>
}
export interface CoinDesc {
    name :string,
    id: string ,
    market_data : {
        market_cap_rank : number,
        total_volume : {
            usd : number
        }
        market_cap  : {
            usd : number
        }
        circulating_supply :number
        total_supply : number
    }
    coingecko_rank : number,
    description : {
        en : string
    },
    image : {
        large : string
    }
}

export const convertToGraphPrices = (val :MarketCharJsonData) => {
    const [date, price] = [(new Date(val[0])).toLocaleDateString('en-GB'),val[1]]
    return {
        x: date,
        y: price
    }
}

export const fetchDesc = async (id: string ) :Promise<CoinDesc| string  >  => {
    try {
        const coinDesc = await (await fetch(apis.crypto.desc(id))).json() as CoinDesc
        return coinDesc
    }catch (e) {
        return 'There was an error'
    }
}
export const fetchPrices = async (id: string ,days: number):Promise<PriceData[] | string > => {
    try {
        const prices = await (await fetch(apis.crypto.marketChart(id, days))).json() as PricesFromApi
        const formatedPrices = prices.prices.map(val => convertToGraphPrices(val))
        return formatedPrices
    }catch (e) {
        return 'There was an error'
    }
}
export const formatStringPrice = (price: string, shouldSlice : boolean  ) => {




    try {
        let partsNumber = price.match(/\w+(?=\.)?/gm) as Array<string | undefined> | undefined

        if (partsNumber) {
            const formatPrice = (partsNumber[0] ?? '').split('').reverse().reduce((acc, val, indx) => {
                if (indx % 3 === 0 && indx !== 0) {
                    return `${val},${acc}`
                }
                return `${val}${acc}`
            }, '')
            const demcialPart = `${partsNumber[1] ? '.' : ''}${partsNumber[1] ?? ''}`
            return `${formatPrice}${shouldSlice ? demcialPart.slice(0, 3) : demcialPart}`
        }
    }catch(e) {
        return ''
    }
}
fetchDesc('bitcoin').then(_ =>{})

