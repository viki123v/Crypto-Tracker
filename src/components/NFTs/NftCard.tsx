import React, {useCallback} from 'react'
import {NavLink} from "react-router-dom";
import {CollectionDataAlchemy, dealWithContactAndFetch} from "./NftPage.tsx";
import {getImage, handleErrorImage, WhichContent} from "../News/NewsCard.tsx";
import {formatStringPrice} from "../crypto_price/Graph/GraphVersions/graphHelpers.ts";

export enum LinkOrSupply {
    Link,
    Supply
}

interface FetchContentPropsPNftCard {
    isLast?: boolean,
    setContent?: Function,
    page?: number,
}

interface PNftCard {
    data : string ,
    name: string,
    price: string,
    fetchContentNeeds?: FetchContentPropsPNftCard,
    img: string,
    setLoading?: Function,
    linkOrSupply: LinkOrSupply
}

const getNextPage = async (page: number, setContent: Function, setLoading: Function) => {
    if (page + 1 === 11)
        return
    try {
        const data: CollectionDataAlchemy = await dealWithContactAndFetch(page);

        setLoading(false);

        setContent((prev: CollectionDataAlchemy): CollectionDataAlchemy => {
            const nftsArr = [...prev.nfts,...data.nfts, ]

            const page = prev.page + 1
            return {
                nfts: nftsArr,
                page: page
            }
        })

    } catch (e) {
    }
}

const styleH2 = `text-center break-all text-[max(17px,80%)] lg:text-[60%] text-[#fff]`
const stylesH3 = `text-inactive-color text-nft-card-sub-content`


const NftCard: React.FC<PNftCard> = (
    {
        data, img, name, price, setLoading, fetchContentNeeds, linkOrSupply
    }
) => {


    const interestingFetch = useCallback((node: HTMLElement | null) => {

        if (!fetchContentNeeds)
            return

        const {page, setContent, isLast} = fetchContentNeeds;

        if (!(page && setContent && isLast && node && setLoading))
            return

        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setLoading(true)
                getNextPage(page + 1, setContent, setLoading).then(_ =>{})
                observer.disconnect()
            }
        })
        observer.observe(node)

    }, [fetchContentNeeds?.isLast])

    return (
        <div
            ref={interestingFetch}
            className="flex mt-[1.5em] lg:shadow-nft-cards-large-neutral lg:hover:shadow-nft-cards-large-active w-[290.25px]
               shadow-nft-cards-neutral hover:shadow-nft-cards-active flex-col text-nft-card-content
                lg:w-[400px] rounded-[6px]">
            <img
                src={img} alt={`image for ${name}`}
                className="h-[40%] text-[transparent] aspect-[1/1] rounded-tl-[6px] rounded-tr-[6px] w-full"
            />
            <div
                className="bg-[#191921] gap-[1em] flex flex-col  p-[0.6em] rounded-bl-[6px] rounded-br-[6px] w-full h-[60%]  ">
                <div className="w-full grid-cols-2 grid-rows-[1fr,1fr] grid place-items-center  gap-y-[0.5em] h-[85px]">
                    <h3 className={`${stylesH3}`}>Name:</h3>
                    <h3 className={`${stylesH3}`}>Price:</h3>
                    <h2 className={`${styleH2}`}>{name}</h2>
                    <h2 className={`${styleH2}`}>
                        <span data-set={price} className="inline-block
                        before:absolute relative before:p-[0.4em]
                    before:rounded-lg before:rounded-bl-none before:bg-nav-bar-pop
                    before:opacity-0 hover:before:opacity-100
                    before:top-[-4ch] before:left-[80%]
                    before:w-[max-content]
                    before:transition before:duration-200
                    before:ease-in-out before:text-sub-crypto
                    before:content-[attr(data-set)]
                        ">{formatStringPrice(price.toString(),true)}</span>
                        <img
                            className={`
                            w-[1em] h-[1em] ml-[5px] inline-block relative bottom-[0.1em]
                        `} src={"../../../src/static%20assets/eth.png"} alt="etherium image"
                        />
                    </h2>
                </div>
                {linkOrSupply === LinkOrSupply.Link ?
                    <div className="w-full grid place-content-center ">
                        <NavLink className={`${styleH2} text-active-nav-logos cursor-pointer`}
                                 onClick={(ev) => {
                                     const root = document.querySelector('#root');
                                     if(!root)
                                         return
                                     root.scrollIntoView();
                                 }}
                                 to={`/user/collection/${data}`}>See collection</NavLink>
                    </div>
                    : null

                }
            </div>
        </div>
    )
}

export default NftCard;