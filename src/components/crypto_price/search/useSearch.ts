import {FilterValues} from "../Filter";
import apis from '../apisConfig.ts'
import { useLocation} from "react-router-dom";
import {GeneralContentObject} from "../apsContent/ApsContentSearch.tsx";


export const getItemFromStorage = (item :string) => {
    return window.localStorage.getItem(`${item}`)
}
const cacheData = (
    nameForData : string ,
    data : any
) => {
    if(typeof data === "object" || Array.isArray(data)){
        window.localStorage.setItem(`${nameForData}`,JSON.stringify(data))
    }else{
        window.localStorage.setItem(`${nameForData}`, `${data}`);
    }
}
const fechCryptoPage = async(

) => {
    let data = await fetch(apis.crypto.getPage())
    data = await data.json()
    return data
}
 export const getDataFromUrl = async (
    url :string,
    changeContent : Function
) => {
    let data = await fetch(url)
    data = await data.json()
    changeContent(data)
}

const makeTimerToInvalidData =  (changeContent :Function ) => {
    const calculateCurrentDayMinutes = ( ) => {
        const minutes = (new Date()).getMinutes()
        const hoursInMinutes = (new Date()).getHours() * 60
        return minutes + hoursInMinutes
    }
    const checkIfUserIsOnCryptoPage = ( ) => {
        const cleanLocalStorage = ( ) => { window.localStorage.clear()}

        const userLocationInWebSite = useLocation()
        cleanLocalStorage()
        if(userLocationInWebSite.pathname.toString().includes('market')){
            return resetSearch
        }
        return null
    }

    const currentMinutes = calculateCurrentDayMinutes()
    const fullDatMinutes = 24 * 60

    setTimeout( async () => {
        const resultCheck = checkIfUserIsOnCryptoPage()
        if(resultCheck !== null){
            await resultCheck(changeContent)
        }

    },(fullDatMinutes - currentMinutes))
}
export const resetSearch = async (
    changeContent : Function,
) => {
    const shouldRefech = (currentDate : number ) => {
        let item:string|number|null = getItemFromStorage('insertedDate')
        return item === null ? true : parseInt(item.toString()) - currentDate !== 0
    }
    const putBitcoinPrice = (content:GeneralContentObject[]) => {
        for(let coins of content ) {
            if(coins.id === 'bitcoin'){
                cacheData('btcPrice',coins.current_price)
                break;
            }
        }
    }

    const currentDate = (new Date()).getDate()
    let content: object

     if(shouldRefech(currentDate)) {
        content = await fechCryptoPage()
        cacheData('coinData',content as GeneralContentObject[])
        !getItemFromStorage('btcPrice') && putBitcoinPrice(content as GeneralContentObject[])
        makeTimerToInvalidData(changeContent)
    }else{
        content = await JSON.parse(getItemFromStorage('data') as string)
    }
    changeContent(content)
}

export const search = async (
    filter : FilterValues,
    changeContent : Function,
    watchList : string[],
) => {

    switch (filter) {
        case 'All' :
            await resetSearch(changeContent );
            break;
        case 'Trending' :
            await getDataFromUrl(apis.crypto.trending(), changeContent);
            break;
        case 'Wachlist' :
            await getDataFromUrl(apis.crypto.search(...watchList), changeContent);
            break;
    }
}





