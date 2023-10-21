import React, {useState} from "react";
import {TAlertsContent} from "./UserIcon";
import {giveDebounce} from "../crypto_price/search/Search";
import {fireStore} from "../../firebaseConfig.ts";
import {getDoc, setDoc, doc} from 'firebase/firestore'
import {UserDoc} from "./Navbar.tsx";
import {motion as m, AnimatePresence} from 'framer-motion'
import {formatStringPrice} from "../crypto_price/Graph/GraphVersions/graphHelpers.ts";

const variants = {
    button: {
        inital: {
            y: '-2em',
            opacity: 0
        },
        animate: {
            y: 0,
            opacity: 1
        },
        exit: {
            y: '-2em',
            opacity: 0
        },
        transition: {
            duration: 2,
            type: 'easeInOut',
        }
    }
}
const h3Styles = `break-words text-[clamp(0.875rem,0.946vw+0.63rem,1.813rem)]`
const changePercentageForCoin = async (
    newPercentage: string,
    email: string,
    idCoin: string,
    setClickedButton: Function,
    setAlerts:Function
) => {
    const percentage = parseFloat(newPercentage)
    if (!percentage || percentage === 0)
        return
    try {
        const userDoc = await  getDoc(doc(fireStore, 'users', email)).then(data => data.data()) as UserDoc
        if (!userDoc.wachlist)
            return
        userDoc.wachlist[idCoin][1] = percentage / 100
        let walidCoins :TAlertsContent[] = []
        setAlerts((prev :TAlertsContent[]) => {
            return prev.filter(coin => {
                if(coin.id !== idCoin){
                    walidCoins.push(coin)
                    return true
                }else {
                    if(coin.percentageChange >= percentage){
                        walidCoins.push(coin)
                        return true;
                    }
                }
            })
        })
        window.sessionStorage.setItem('alertsContent',JSON.stringify(walidCoins));
        setClickedButton(false)
        await setDoc(doc(fireStore, 'users', email), userDoc)
    } catch (e) {
        setClickedButton(false)
    }
}
const debounce = giveDebounce()
const AlertsCard: React.FC<{ content: TAlertsContent , setAlertsContent :Function }> = (
    {content, setAlertsContent}
) => {

    const [searchValue, setSearchValue] = useState<string>('')
    const [clickedButton, setClickedButton] = useState<boolean>(false)

    return (
        <div className="text-content text-[#fff] grid grid-cols-[repeat(6,1fr)]  gap-x-[0.6em] alerts-card-b  grid-rows-[max-content] justify-items-center items-center">
            <div className="w-full h-full grid-cell-image grid place-items-center ">
                <div className=" relative p-[1.5em] w-[2em] h-[2em] rounded-[100%] bg-background-color">
                    <img className={'w-[2em] rounded-[100%] h-[2em] absolute left-[0.5em] top-[0.5em]'} alt={`image for ${name}`} src={content.imgUrl}/>
                </div>
            </div>
            <h2 className={`${h3Styles}`}>{content.name}</h2>
            <h2
                data-set={`${formatStringPrice(content.prevPrice.toString(), false)}$`}
                className={`${h3Styles}
                    text-center 
                    before:absolute relative before:p-[0.4em]
                    before:rounded-lg before:rounded-bl-none before:bg-nav-bar-pop
                    before:opacity-0 hover:before:opacity-100 
                    before:top-[-4ch] before:left-[80%]
                    before:transition before:duration-200 
                    before:ease-in-out before:text-sub-crypto
                    before:content-[attr(data-set)] ` } >
                {formatStringPrice(content.prevPrice.toString(), true)}$
            </h2>
            <h2
                data-set={`${formatStringPrice(content.currentPrice.toString(), false)}$`}
                className={`${h3Styles}
                    text-center 
                    before:absolute relative before:p-[0.4em]
                    before:rounded-lg before:rounded-bl-none before:bg-nav-bar-pop
                    before:opacity-0 hover:before:opacity-100 
                    before:top-[-4ch] before:left-[80%]
                    before:transition before:duration-200 
                    before:ease-in-out before:text-sub-crypto
                    before:content-[attr(data-set)] 
            `}>
                {formatStringPrice(content.currentPrice.toString(), true )}$
            </h2>
            <h2
                data-set={`${formatStringPrice(content.percentageChange.toString(), false)}%`}
                className={`${h3Styles}
                    text-center 
                    before:absolute relative before:p-[0.4em]
                    before:rounded-lg before:rounded-bl-none before:bg-nav-bar-pop
                    before:opacity-0 hover:before:opacity-100 
                    before:top-[-4ch] before:left-[80%]
                    before:transition before:duration-200 
                    before:ease-in-out before:text-sub-crypto
                    before:content-[attr(data-set)]
                    ${content.percentageChange < 0 ? 'text-red opacity-80' : 'text-[#fff]'}  `}
                >
                {formatStringPrice(content.percentageChange.toString(), true)}%
            </h2>
            <div className={`${clickedButton ? 'w-[80%] mr-[20%]' : ''}`}>
                <AnimatePresence>
                    {
                        !clickedButton ?
                            <m.button
                                variants={variants.button}
                                initial="inital"
                                animate="animate"
                                exit="exit"
                                transition={variants.button.transition}
                                onClick={(ev) => {
                                    setClickedButton(true)
                                }}
                                className={` p-[0.4em] break-words  rounded-lg bg-active-nav-logos text-[#fff]
                                text-[clamp(0.575rem,0.446vw+0.63rem,1.813rem)] 
                                cursor-pointer 
                                md:text-[clamp(0.875rem,0.946vw+0.63rem,1.813rem)]
                                `}
                            >
                                Change
                            </m.button>
                            :
                            <m.input
                                placeholder={`${(content.procentageUser * 100).toString()}`}
                                className={`
                                bg-[transparent] w-full h-full 
                                text-[clamp(0.575rem,0.446vw+0.63rem,1.813rem)] 
                                cursor-pointer 
                                focus-visible:outline-none
                                border-b-1 border-active-nav-logos 
                                md:text-[clamp(0.875rem,0.946vw+0.63rem,1.813rem)]`}
                                variants={variants.button}
                                initial="inital"
                                animate="animate"
                                exit="exit"
                                transition={variants.button.transition}
                                type={"text"}
                                value={searchValue}
                                onChange={(ev) => {
                                    ev.stopPropagation();
                                    const target = ev.target
                                    if (!target)
                                        return
                                    setSearchValue(target.value)
                                    debounce(changePercentageForCoin, 500, target.value, window.localStorage.getItem('email'), content.id, setClickedButton,setAlertsContent)
                                }}/>
                    }
                </AnimatePresence>
            </div>
        </div>
    )
}
export default AlertsCard