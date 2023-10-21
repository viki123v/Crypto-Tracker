import {LoaderFunctionArgs} from "@remix-run/router/utils";
import {redirect, useLoaderData} from "react-router-dom";
import {alchemy} from "../crypto_price/apisConfig.ts";
import React, {useEffect, useState} from 'react'
import NftCard, {LinkOrSupply} from "./NftCard.tsx";
import {NftContractNftsResponse} from "alchemy-sdk";
import {NftAlchemyData} from "./NftPage.tsx";
import {motion} from "framer-motion";

interface TData {
    nfts : NftAlchemyData[]
}

const checkRes = async <T,>(res : T) => {
    if(typeof res === 'string' )
        return await  JSON.parse(res)
    return res

}
export const loadingCollection = async ({request, params } : LoaderFunctionArgs ) :Promise<TData|Response| null> =>{
    const {collectionSlug} = params

    if(!collectionSlug)
        return redirect('/user/nft');


    try {
        const url = new URL(`https://eth-mainnet.g.alchemy.com/nft/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_APIKEY}/getNFTsForCollection?collectionSlug=${collectionSlug}&withMetadata=true`)
        const data = await fetch(url).then(res => res.json()) ;
        console.log(data);
        return data;
    }catch(e) {
        return redirect('/user/nft')
    }
}

const NftCollection = ( ) => {

    const collection = useLoaderData() as TData | null ;
    const [shouldExpand, setShouldExpand] = useState<boolean>(false)
    if(!collection)
        return <span className={`mt-[8em] lg:mt-[11em] text-content text-active-nav-logos`}>No info</span>

    useEffect(() => {
        const root = document.querySelector('#root');
        if(!root)
            return
        root.scrollTo()
    }, []);

    return (
        <section className={`mt-[6em] flex flex-col `}>
            <section className={`mx-[2em] lg:mx-[4em] relative z-0 w-screen border-b-1 border-inactive-color mb-[2em]`}>
                <div className={`relative gap-[1em] z-20 top-[50px] flex lg:top-[50px] left-[1em]`}>
                    <img
                        className="aspect-[2/3] bg-[#1c1e21]  w-[100px] lg:w-[140px] border-2 border-inactive-color rounded-[6px]"
                        src={`${collection.nfts[0].contractMetadata.openSea.imageUrl}`} alt={`image for collection`}/>
                    <div className={` h-[146px] lg:h-[206px]  w-[50vw] flex justify-start items-center  `}>
                        <p className={`text-center  relative  text-active-nav-logos  text-sub-header-footer`}>{collection.nfts[0].contractMetadata.openSea.collectionName}</p>
                    </div>
                </div>
            </section>
            <section className={'mx-[2em] lg:mx-[4em] mt-[4em]'}>
                <motion.p
                    layout
                    className={`text-[#fff] text-sub-headers-graph`}>
                    <span
                        style={{
                            maxHeight : shouldExpand ? 'fit-content' : '10vh'
                        }}
                        className={`   transition duration-500 ease-in-out inline-block overflow-hidden`}
                    >{collection.nfts[0].contractMetadata.openSea.description}</span>
                    <span
                        onClick={(ev) => {
                            ev.stopPropagation()
                            ev.preventDefault()
                            const value = !shouldExpand;
                            setShouldExpand(value)
                        }}
                        className={`text-active-nav-logos block cursor-pointer`}>{shouldExpand ? 'Show less' : 'Expand'  }</span>
                </motion.p>
            </section>
            <motion.section layout  className={`pt-[2em] w-screen flex flex-row flex-wrap gap-[1.4em] justify-center items-center  h-full `}>
                {
                    collection.nfts.map((nft, i) => {

                        if(!i)
                            return

                        return <NftCard
                            key={`${nft.contractMetadata.openSea.collectionName}_${i}`}
                            data={nft.contractMetadata.totalSupply}
                            name={`${nft.metadata.name}`}
                            price={nft.contractMetadata.openSea.floorPrice}
                            img={nft.media[0].thumbnail}
                            linkOrSupply={LinkOrSupply.Supply} />
                    })
                }
            </motion.section>
        </section>
    )
}

export default NftCollection