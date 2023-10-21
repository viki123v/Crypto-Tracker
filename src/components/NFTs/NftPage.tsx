import {LoaderFunctionArgs} from "@remix-run/router/utils";
import React, {useState} from "react";
import apis, {alchemy} from "../crypto_price/apisConfig.ts";
import {redirect, useLoaderData} from "react-router-dom";
import NftCard from "./NftCard.tsx";
import Loading from "../error_loading/loadingPage.tsx";
import {LinkOrSupply} from "./NftCard";

export interface NftAlchemyData {
    contractMetadata :
        {
            name: string,
            openSea: {
                floorPrice: string,
                imageUrl: string,
                collectionSlug : string,
                collectionName : string,
                description : string
            },
            totalSupply : string
        },
    media : [
        { thumbnail: string }
    ],
    metadata : {
        name : string
    }

}

export interface CollectionDataAlchemy {
    nfts: NftAlchemyData[],
    page: number
}
interface NftCoingeko {
    contract_address : string
}

export const makeAdressesIntoHeader =(
    addresses : string[]
) => {
    return {
      method:"POST",
      body :JSON.stringify({
          contractAddresses : addresses
      })
    }
}
const getContractAdresses = async (
    page : number
) => {
    const nftsCollection: NftCoingeko[] = await fetch(apis.nft.getPage(page)).then(res => res.json());
    const contactAdresses = nftsCollection.map(nft => nft.contract_address);
    return contactAdresses
}
export const dealWithContactAndFetch = async (page: number): Promise<CollectionDataAlchemy> => {
    const data: unknown  = await fetch(`https://eth-mainnet.g.alchemy.com/nft/v2/${import.meta.env.VITE_REACT_APP_ALCHEMY_APIKEY}/getContractMetadataBatch`
    ,makeAdressesIntoHeader(await getContractAdresses(1)))
        .then(res => res.json() ) ;

    return {
        nfts : data as NftAlchemyData[],
        page : 1
    }
}
export const loaderNFTsPage = async ({}: LoaderFunctionArgs): Promise<CollectionDataAlchemy | Response> => {
    try {
        const returnData = await dealWithContactAndFetch(1);
        console.log(returnData)
        return returnData
    } catch (e) {
        return redirect('/')
    }
}

const NftPage: React.FC<{}> = () => {

    const collections = useLoaderData() as CollectionDataAlchemy;
    const [nftData, setNftData] = useState<CollectionDataAlchemy>(collections);
    const [loading, setLoading] = useState<boolean>(false)


    return (
        <section className="mt-[6em] flex flex-row flex-wrap gap-[1.4em] lg:gap-[5em]  items-center justify-center
             w-screen h-full
        ">
            {
                nftData.nfts.map((nft, i) => {
                    console.log(nft )
                    return <NftCard
                        linkOrSupply={LinkOrSupply.Link}
                        setLoading={setLoading}
                        key={`${nft.contractMetadata.name ?? ''}_${i}`}
                        fetchContentNeeds={{
                            isLast: nftData.nfts.length - 1 === i,
                            setContent: setNftData,
                            page: nftData.page
                        }}
                        data={nft.contractMetadata.openSea.collectionSlug ?? ''}
                        name={nft.contractMetadata.name ?? ''}
                        price={nft.contractMetadata.openSea.floorPrice ?? ''}
                        img={nft.contractMetadata.openSea.imageUrl ?? ''}
                    />
                })
            }
            {
                loading &&
                <div className={`w-full p-[4em] h-[calc(fit-content+50px)]`}>
                    <Loading/>
                </div>
            }
        </section>
    )
}

export default NftPage