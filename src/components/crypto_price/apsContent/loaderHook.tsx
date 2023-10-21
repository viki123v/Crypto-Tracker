import apis from "../apisConfig";
import {Content, GeneralContentObject} from "./ApsContentSearch";

export type LoaderContent = {
    wrapper : Content<GeneralContentObject>,
    btcPrice : number,
}
export const initalLoad = async (): Promise<LoaderContent | string  > => {

    const findPriceBTc = (data: Content<GeneralContentObject> | undefined): number | undefined => {
        if (data == undefined || !data.content || !data.content?.coins) {
            return
        }
        let btcData = data.content.coins.flatMap(coin => coin.id === 'bitcoin' ? coin : [] )
        return btcData[0].current_price
    }
    const cache = async (): Promise<Content<GeneralContentObject> | undefined> => {

        const currentDate = (new Date()).getDate()
        let insertedDate = window.localStorage.getItem('datePrevFetch')

        if(!insertedDate)
        {
            window.localStorage.setItem('datePrevFetch', currentDate.toString() )
            return ;
        }

        if (insertedDate && parseInt(insertedDate) - currentDate === 0) {
            const data = (await JSON.parse(window.localStorage.getItem('data20') as string)) as Content<GeneralContentObject>
            return data
        } else {
            window.localStorage.setItem('datePrevFetch', currentDate.toString() )
            return
        }

    }
    const data = await cache()
    const priceBTC = findPriceBTc(data)

    if (data && priceBTC) {
        return {
            wrapper : data,
            btcPrice : priceBTC
        }
    }
    try {
        //TODO: vidi sho se deshavat so storagot

        const realData = await (await fetch(apis.crypto.getPage())).json()
        window.localStorage.setItem('data20', JSON.stringify({content: {coins: realData}, page: 1}))
        return {
            wrapper: {
                content: {
                    coins: realData
                },
                page: 1
            },
            btcPrice : findPriceBTc(realData) as number
        }
    }catch(e) {
        return 'There is an error with the api'
    }

}

