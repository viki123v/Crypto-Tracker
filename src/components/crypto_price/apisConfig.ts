import {Network, Alchemy} from 'alchemy-sdk'

const options = [
    'nfts',
    'web3',
    'defi'
] as const


const apis = {
    crypto: {
        getPage:  (page: number  = 1  ) => {
            const baseEntry = new URL(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&`)
            return `${baseEntry}page=${page}&sparkline=false&price_change_percentage=24h&locale=en`
        },
        search: (...ids: string[]) => {
            let firstUrl = new URL('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&')
            let secondHalf = '&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en'
            firstUrl.searchParams.set('ids',`${ids}`) ;
            return `${firstUrl}${secondHalf}`
        },
        trending(){
            return "https://api.coingecko.com/api/v3/search/trending"
        },
        desc (id :string){
           return  `https://api.coingecko.com/api/v3/coins/${id}?market_data=true&community_data=true`
        },
        marketChart(id : string ,days : number){
            return `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days.toString()}&precision=2`
        },
    },
     news : {
        apiKey : import.meta.env.VITE_REACT_APP_NEWS_APIKEY,
         baseEntry :'https://newsapi.org/v2/everything',
         getContent(selectedOp: (typeof options)[number], page:number = 1, perPage: number ) :string{
            return `${this.baseEntry}?apiKey=${this.apiKey}&q=${selectedOp}&searchln=title&language=en&pageSize=${perPage}&page=${page}`
         }
     },
    nft : {
        getPage(page: number =1 ) {
            return `https://api.coingecko.com/api/v3/nfts/list?order=h24_volume_native_asc&asset_platform_id=ethereum&per_page=20&page=${page}`
        }
    }
}
const setting = {
    apiKey : import.meta.env.VITE_REACT_APP_ALCHEMY_APIKEY,
    network : Network.ETH_MAINNET
}
export const alchemy = new Alchemy(setting);


export default apis