import {giveDebounce} from "../crypto_price/search/Search";
import {memo, useEffect, useState} from "react";
import {setDoc, getDoc, doc} from 'firebase/firestore'
import {fireStore} from "../../firebaseConfig.ts";
import React from 'react'
import apis from "../crypto_price/apisConfig.ts";
import {GeneralContentObject} from "../crypto_price/apsContent/ApsContentSearch.tsx";
import {motion, AnimatePresence} from "framer-motion";
import {formatStringPrice} from "../crypto_price/Graph/GraphVersions/graphHelpers.ts";

const debounce = giveDebounce()

interface Ids {
    [K: string]: string
}

const getPricesForIds = async (enterCoinId: string, outCoinId: string): Promise<[number, number] | number> => {
    try {
        const coins = await fetch(apis.crypto.search(enterCoinId, outCoinId)).then(res => res.json()) as [GeneralContentObject, GeneralContentObject];
        console.log('this are the coins',coins,
            'this is the first coin', coins[0].current_price,
            'this is teh second coin', coins[1].current_price )
        if (coins[0] === coins[1]) {
            return coins[0].current_price
        }
        return [coins[0].current_price, coins[1].current_price];
    } catch (e) {
        return [0, 0]
    }
}
const getPricesForCoins = async (enterCoinName: string, outCoinName: string): Promise<[number, number] | number> => {
    const ids = await getDoc(doc(fireStore, 'search', 'refrence')).then(res => res.data()) as Ids;
    const [enterCoinId, outCoinId] = [ids[enterCoinName], ids[outCoinName]];
    return await getPricesForIds(enterCoinId, outCoinId)
}
const calculateFrom = (ammount: number,prices: [number, number] | number,setCalc: Function) => {
    if (!(Array.isArray(prices))) {
        return ammount
    }
    const [enterCoinPrice,outCoinPrice  ] = prices
    const price = (ammount * enterCoinPrice) / outCoinPrice
    if (Number.isNaN(price))
        setCalc('there is a problem');
    else {
        setCalc(price.toString());
    }
}
const calculate = async (ammount: string,setCalc: Function,enterCoin: string,outCoin: string) => {

    if (ammount === '') {
        setCalc('');
        return;
    }

    const floatAmmount = parseFloat(ammount);
    if (!floatAmmount || floatAmmount === 0)
        return
    const prices = await getPricesForCoins(enterCoin, outCoin);

    calculateFrom(floatAmmount, prices, setCalc)
}
let selected1: null | React.ReactElement = null
let selected2: null | React.ReactElement = null
const createRow = (selectValues: Array<[string, string]>, value: string, setValue: Function, enterCoinState: string, setEnterCoinState: Function, outCoin: string, setOutCoin: Function, isForSearch: boolean, setCalculate: Function,
                   setExpand: Function, expand: boolean) => {

    const createOption = (name: string, image: string, setState: Function, isForSearch: boolean) => {
        const el = (
            <div key={`${name}${image}`} data-img={image} data-value={name} onClick={(ev) => {
                ev.preventDefault()
                if (isForSearch) {
                    selected1 = el
                } else {
                    selected2 = el
                }
                setState(name)
                setExpand(false)
            }} className={`
                flex h-[2em]  items-center  justify-between  w-full max-w-[/ ke vidime /]
            relative gap-[1.2em] min-h-[min-content]
              text-active-nav-logos  text-graph-content  cursor-pointer`}>
                <img className={`h-[1em] w-[1em] rounded-[100%]`} src={image} alt={`image for ${name}`}/>
                <span className={`text-graph-content text-[#fff]  text-end break-words `}>{name}</span>
            </div>
        )

        return el
    }

    return (
        <>
            <div
                data-value={isForSearch ? enterCoinState : outCoin}
                id={isForSearch ? 'enter-coin-select' : 'out-coin-select'}
                className={`${value ? 'input-select' : 'out-select'} bg-[transparent] border-1 border-inactive-color focus-visible:outline-none focus-visible:border-none
                             text-active-nav-logos p-[1em] w-[50%]  -z-10  
                            border-none bg-[#1c1e21] min-h-[min-content] relative  border-b-1 border-b-active-nav-logos`}>

                <div onClick={ev => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    setExpand(!expand)
                }}
                     className={`w-full flex z-[2000] relative ${isForSearch ? '' : 'options-convert'}    overflow-y-scroll overflow-x-hidden scroll cursor-pointer justify-between items-center flex-row border-1 border-inactive-color rounded-[6px] p-[0.5em] h-[2em]`}
                >
                    {
                        !(selected2 || selected1) ?
                            (
                                <>
                                <span
                                    className={`text-graph-content z-[60] text-[#fff] `}> {isForSearch ? 'Select coin' : 'Convert to'}
                                </span>
                                </>
                            )
                            : (() => {
                                if (isForSearch && selected1) {
                                    return (
                                        <div className={`w-[fit-content] relative z-[60] h-fit min-h-[min-content]`}>
                                            {selected1}
                                        </div>
                                    )
                                } else {
                                    if (selected2) {
                                        return (
                                            <div className={`w-[fit-content] min-h-[min-content] h-fit z-[60] `}>
                                                {selected2}
                                            </div>
                                        )
                                    }
                                    return (
                                        <>
                                            <span
                                                className={`text-graph-content text-[#fff] z-[60] `}> {isForSearch ? 'Select coin' : 'Convert to'}
                                            </span>
                                        </>
                                    )
                                }
                            })()
                    }
                    {
                        expand ?
                            <img
                                style={{
                                    transform: 'rotate(180deg)'
                                }}
                                src={'../../../src/static assets/dropDownSelect.svg'}
                                className={'aspect-[1/1]  w-[0.7em] '} id={`down expand`}/>
                            :
                            <img
                                style={{
                                    transform: 'rotate(360deg)'
                                }}
                                src={'../../src/static assets/dropDownSelect.svg '}
                                className={`aspect-[1/1] w-[0.7em] rotate-[90deg]`} id={`up expnad`}/>
                    }
                </div>
                <AnimatePresence>
                    <motion.div
                        initial={{
                            opacity : 0
                        }}
                        animate={{
                            opacity : 1
                        }}
                        transition={{
                            type: 'easeIn',
                            duration: 1
                        }}
                        style={{
                            opacity: expand ? '100%' : '0',
                            display : expand ? 'flex' : 'none',
                            maxHeight: '30vh'
                        }}
                        onWheel={ev => {
                            ev.stopPropagation()
                        }}
                        className={`
                    absolute w-[120%] ${isForSearch ? 'options-enter' : 'options-convert'} overflow-x-hidden px-[1em] transition duration-500 ease-in-out  h-[30vh] gap-[1.5em] max-w-[/ke vidiime/]  flex flex-col items-center border-1 border-inactive-color   overflow-y-scroll scroll  z-30  left-0 top-[4em] rounded-[6px] bg-[#1c1e21] p-[0.5em]`}>
                        {
                            selectValues.map(option => {
                                return createOption(option[0], option[1], (isForSearch ? setEnterCoinState : setOutCoin), isForSearch)
                            })
                        }
                    </motion.div>
                </AnimatePresence>
            </div>
            {isForSearch ?
                <input
                    placeholder={`Enter ammount`}
                    type={"text"}
                    value={value}
                    onChange={event => {
                        event.stopPropagation()
                        event.preventDefault()
                        const target = event.target as HTMLInputElement
                        setValue(target.value)
                        debounce(calculate, 500, target.value, setCalculate, enterCoinState, outCoin)
                    }}
                    className={` bg-[transparent] text-graph-content text-[#fff] focus-visible:outline-none h-fit  focus-visible:border-active-nav-logos w-[50%] border-inactive-color border-b-1 `}
                />
                :
                <p
                    data-set={`${formatStringPrice(value,false)}`}
                    className={`
                    before:absolute relative before:p-[0.4em]
                    before:rounded-lg before:rounded-bl-none before:bg-nav-bar-pop
                    before:opacity-0 hover:before:opacity-100 
                    before:top-[-4ch] before:left-[30%]
                    before:z-[200]
                    before:transition before:duration-200 
                    before:ease-in-out before:text-sub-crypto
                    before:w-[max-content]
                    before:content-[attr(data-set)]
                  
                    w-[50%] h-[1.5em] text-graph-content overflow-visible border-inactive-color border-b-1 text-[#fff]`}>
                    <span

                    className={``}>
                    {value === 'there is a problem' || !value ? value : `${formatStringPrice(value, true )}`}
                    </span>
                </p>
            }
        </>
    )
}


interface Object {
    [K: string]: string
}

// image, id

const getOptions = async (setOptions: Function) => {
    let options: Array<[string, string]> = []
    const docs = await getDoc(doc(fireStore, 'search', 'images')).then(res => res.data()) as Object

    for (let name in docs) {
        options.push([name, docs[name]])
    }
    setOptions(options)
    return options
}
const CalculatorCom = memo(() => {

    const [options, setOptions] = useState<Array<[string, string]> | null>(null)
    const [search, setSearch] = useState<string>('')
    const [calculate, setCalculate] = useState<string>('')
    const [enterCoin, setEnterCoin] = useState<string>('')
    const [convertCoin, setOutCoin] = useState<string>('')
    const [expand1, setExpand1] = useState<boolean>(false)
    const [expand2, setExpand2] = useState<boolean>(false)

    useEffect(() => {
        getOptions(setOptions).then(newOptions => {
            setEnterCoin(newOptions[0][0])
            setOutCoin(newOptions[0][0])
        })
    }, []);

    useEffect(() => {

        const el = document.querySelector('.options-convert') as HTMLElement|null

        if(!el){
            return
        }

        if(expand1) {
            el.style.zIndex = '50'
        }else{
            el.style.zIndex = '2000'
        }

    }, [expand1, expand2]);


    if (!options)
        return

    return (
        <>
            <div className={`flex relative -z-10 flex-row w-full  items-center justify-center`}>
                {createRow(options, search, setSearch, enterCoin, setEnterCoin, convertCoin, setOutCoin, true, setCalculate, setExpand1, expand1,)}
            </div>
            <div className={`flex flex-row w-full  relative -z-30 items-center justify-center `}>
                {createRow(options, calculate, setSearch, enterCoin, setEnterCoin, convertCoin, setOutCoin, false, setCalculate, setExpand2, expand2)}
            </div>
        </>
    )
})

export default CalculatorCom