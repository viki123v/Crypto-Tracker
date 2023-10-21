/// <reference types="vite-plugin-svgr/client" />
import {AnimatePresence, motion} from "framer-motion";
import React, {useState, memo, useMemo, EventHandler, useEffect, ReactElement} from 'react'
import {ReactComponent as AnonyMusUserCover} from "../../static assets/register_img/anonymusUser.svg";
import {ReactComponent as SignOut} from "../../static assets/LogoutSvg.svg";
import {fireAuth, fireStore} from "../../firebaseConfig.ts";
import {signOut} from 'firebase/auth'
import {useLocation, useNavigate} from "react-router-dom";
import apis from "../crypto_price/apisConfig.ts";
import {ReactComponent as AlertsIcon} from "../../static assets/alertsLogo.svg";
import {GeneralContentObject} from "../crypto_price/apsContent/ApsContentSearch.tsx";
import AlertsCard from "./AlertsCard.tsx";
import {UserDoc} from "./Navbar.tsx";
import {getDoc, setDoc, doc} from 'firebase/firestore'
import {ReactComponent as ArrowBackHamburger} from '../../static assets/navigation_logos/navigation_hamburger_back.svg'
import {ReactComponent as Calculator} from "../../../src/static assets/calculator.svg"
import CalculatorCom from "./CalculatorCom.tsx";

const divCoinsNames = ['Image', 'Previous Price', "Current Price", 'Change']
const headersStyles = 'text-[#e776ff] text-center text-[clamp(0.5rem,0.5vw+0.6rem,2rem)] word-break '

export type TUserWachlist = {
    [K: string]: [number, number]
}

enum AnimationsDirections {
    left,
    right
}

interface PUserIcon {
    userName: string | undefined,
    imgUrl: string | undefined,
    isMobile: 0 | 1,
    wachlsit: string[] | undefined
}

export interface TAlertsContent {
    imgUrl: string,
    prevPrice: number,
    currentPrice: number,
    percentageChange: number,
    name: string,
    id: string,
    procentageUser: number
}

const clickEvent = (setHover: Function) => {
    let wasClicked = false
    // true - izlezi /  false - sedi
    return (ev: React.MouseEvent) => {
        setHover(!wasClicked)
        wasClicked = !wasClicked
    }
}
// 0 - desk 1 - mobile

// ushte da mozit da smenit neshto
// 0 -> prevValue , 1 -> change
type TthingForAnimating = {
    keyframes: Keyframe[],
    options: KeyframeAnimationOptions,
    keyframesFinish: Keyframe[],
    options2: KeyframeAnimationOptions
}


const clickedSignOut = async (ev: React.MouseEvent<HTMLElement>, navigate: Function) => {
    ev.stopPropagation()
    await signOut(fireAuth)
    window.localStorage.clear()
    window.sessionStorage.clear();
    navigate('/home')
}

const shouldAlertUser = (prevPrice: number,priceChangeUser: number,currentPrice: number): [boolean, number] => {
    if(prevPrice === 0)
        return  [false, 0];
    const diff = (currentPrice - prevPrice) * -1;
    const percentDif = (diff * 100) / prevPrice
    return [(priceChangeUser*100) <= Math.abs(percentDif), percentDif]
}
const animatingAlertsIcon = () => {
    const alertsIcon = document.querySelector('.alerts-icon') as SVGElement
    const thingsForAnimating: TthingForAnimating = {
        keyframes: [
            {transform: "rotate(-30deg)"},
            {transform: 'rotate(30deg)'},
        ],
        options: {
            duration: 600,
            easing: 'linear',
            direction: 'alternate',
            iterations: 3,
            fill: "forwards"
        },
        keyframesFinish: [
            {transform: 'rotate(0)'}
        ],
        options2: {
            duration: 600,
            fill: 'forwards',
            iterations: 1,
            easing: 'linear',
            delay: 1800
        }
    }
    alertsIcon.animate(thingsForAnimating.keyframes, thingsForAnimating.options)
    alertsIcon.animate(thingsForAnimating.keyframesFinish, thingsForAnimating.options2)
}
const generateAlertsContent = (
    {name, image, current_price, id}: GeneralContentObject,
    currentPerDif: number,
    prevPrice: number,
    percentage: number
): TAlertsContent => {
    return {
        imgUrl: image,
        prevPrice: prevPrice,
        currentPrice: current_price,
        percentageChange: currentPerDif,
        name: name,
        id: id,
        procentageUser: percentage
    }
}
type TupdatePrices = {
    id: string,
    newPrice: number
} []


const checkAlerts = async (wachlistState: string[] | undefined,setAlertsContent: Function,): Promise<void> => {

    const getUsersWachlist = async (): Promise<undefined | [UserDoc, Function]> => {
        const email = window.localStorage.getItem('email');
        if (!email)
            return
        const userDoc = await getDoc(doc(fireStore, 'users', email)).then(res => res.data()) as UserDoc;
        return [userDoc, async (prices: TupdatePrices, wachlist: TUserWachlist) => {
            prices.forEach(coin => {
                wachlist[coin.id][0] = coin.newPrice
            });
            await getDoc(doc(fireStore, 'users', email))
                .then(res => res.data() as UserDoc)
                .then(res => ({...res, wachlist : {...res.wachlist, ...wachlist}}))
                .then(res => {setDoc(doc(fireStore, 'users', email), res)})
        }]
    }
    const areArrSame = (arr1: string[], arr2: string[] | undefined): boolean => {
        return arr1.length !== 0 && (Array.isArray(arr2) && arr2.length !== 0) && arr1.filter((val, i) => val !== arr2[i]).length == 0 ;
    }
    const isInSessionStorage = async (setAlerts: Function,animate: Function,wachlist: TUserWachlist | undefined, wachlistState :string[]|undefined): Promise<boolean>  => {
        const data:string|null|TAlertsContent[] = window.sessionStorage.getItem('alertsContent')
        if(!data || !wachlistState || areArrSame(wachlistState, JSON.parse(data)))
        {
            return false ;
        }

        setAlerts(JSON.parse(data)) ;
        return true ;
    }

    const [user, update] = (await getUsersWachlist()) ?? [null, null];
    if (!user || wachlistState?.length === 0 || !user.wachlist ) {
        setAlertsContent(null)
        return;
    }else if(   await isInSessionStorage(setAlertsContent,animatingAlertsIcon, user.wachlist, wachlistState)) {

        return;
    }

    try {
        const ids = Object.keys(user.wachlist);
        const dataCoins: GeneralContentObject[] = await fetch(apis.crypto.search(...ids)).then(rez => rez.json());
        let arrCoinsForAlertingUser: TAlertsContent[] = [],
            currentPrices: TupdatePrices = []
        dataCoins.forEach(coin => {
            //@ts-ignore
            const [prevPrice, usersChangePercentage] = user.wachlist[coin.id];
            const [shouldAlert, currentDifferenceInPer] = shouldAlertUser(prevPrice, usersChangePercentage, coin.current_price)
            if (shouldAlert) {
                currentPrices.push({id: coin.id, newPrice: coin.current_price})
                arrCoinsForAlertingUser.push(generateAlertsContent(coin, currentDifferenceInPer, prevPrice, usersChangePercentage))
            }
        })
        if (arrCoinsForAlertingUser.length !== 0) {
            animatingAlertsIcon()
            window.sessionStorage.setItem('alertsContent', JSON.stringify(arrCoinsForAlertingUser))
            setAlertsContent(arrCoinsForAlertingUser)
            await update(currentPrices, user.wachlist );
        } else {
            setAlertsContent(null)
        }
    } catch (e) {
        setAlertsContent(null);
    }

}

enum Which {
    Calculator,
    Alerts
}

let wasClicked = false
const animateTheOtherFirst = (
    which: Which,
    setTheOther: Function
): Promise<void> => {
    if (which === Which.Calculator) {
        const iconDiv = document.querySelector('.alerts-icon-div') as HTMLElement
        const calculator = document.querySelector('.calculator') as HTMLElement;
        iconDiv.style.transform = `translateX(0)`
        calculator.style.transform = `translateX(100vw)`
    } else {
        const section = document.querySelector('.alerts-section') as HTMLElement;
        const alertsIcon = document.querySelector('.alerts-icon-div') as HTMLElement;
        const root = document.querySelector('#root') as HTMLElement;
        section.style.transform = 'translateX(100vw)'
        alertsIcon.style.transform = 'translateX(0vw)'
        root.style.overflow = 'visible'
    }
    wasClicked = false
    setTheOther(null)
    return new Promise(res => {
        setTimeout(() => {
            res()
        }, 500)
    })
}

const animations = async (
    ev: React.MouseEvent<SVGElement>,
    dir: AnimationsDirections,
    isTheOtherClicked?: string | null,
    setIsTheOtherClicked?: Function,
) => {
    ev.stopPropagation()
    ev.preventDefault();

    const valuesTranslate = {
        section: [
            '0vw',
            '100vw'
        ],
        icon: [
            '-100vw',
            '0'
        ],
        root: [
            'hidden',
            'visible'
        ]
    }

    const section = document.querySelector('.alerts-section') as HTMLElement;
    const alertsIcon = document.querySelector('.alerts-icon-div') as HTMLElement;
    const root = document.querySelector('#root') as HTMLElement;

    if (isTheOtherClicked === 'Calc' && setIsTheOtherClicked) {
        await animateTheOtherFirst(Which.Calculator, setIsTheOtherClicked)
    }

    const bit = dir === AnimationsDirections.left ? 0 : 1

    section.style.transform = `translateX(${valuesTranslate.section[bit]})`
    alertsIcon.style.transform = `translateX(${valuesTranslate.icon[bit]})`
    root.style.overflow = valuesTranslate.root[bit]

    if (setIsTheOtherClicked)
        setIsTheOtherClicked(dir ? "Alerts" : null)
}
const giveContent = (
    alertsContent: TAlertsContent[] | null,
    setAlertsContent: Function,
    setPrev: Function
) => {

    if (alertsContent && alertsContent.length !== 0) {
        return (
            <div
                className="overflow-hidden scroll lg:px-[3em] text-content w-full flex-grow gap-[2em] pt-[1em] flex-col  h-[80vh] overflow-y-scroll flex  pb-[5vh] ">
                <div className="w-full flex justify-end">
                    <ArrowBackHamburger onClick={(ev) => {
                        animations(ev, AnimationsDirections.right, null, setPrev)
                            .then(_ => {
                            })
                    }}
                                        className="w-[3em] cursor-pointer h-[3em] mr-[10px]"/>
                </div>
                <div>
                    <div
                        className="grid grid-cols-6 pb-[1em] border-b-1 border-active-nav-logos place-items-center ">
                        <h3 className={headersStyles}>Image</h3>
                        <h3 className={headersStyles}>Name</h3>
                        <h3 className={headersStyles}>Previous Price</h3>
                        <h3 className={headersStyles}>Current Price</h3>
                        <h3 className={headersStyles}>Percentage</h3>
                        <h3 className={headersStyles}>Change Percentage</h3>
                    </div>
                    <div className="grid grid-cols-1 pt-[1em] gap-y-[1em] ]">
                        {
                            alertsContent.map((content, i) => {
                                return <AlertsCard key={`${content.name}${i}`} content={content} setAlertsContent={setAlertsContent}/>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="w-[100vw] pl-[2em] flex flex-col  pt-[5vh]">
            <ArrowBackHamburger onClick={(ev) => {
                animations(ev, AnimationsDirections.right).then(_ => {
                })
            }}
                                className="w-[3em] self-end  cursor-pointer h-[3em] mr-[10px]"/>
            <p className={`text-content text-active-nav-logos`}>There are no alerts!</p>
        </div>
    )
}


const handleCalculator = (width: boolean, isTheOtherClicked: string | null, setIsTheOtherClicked: Function) => {

    const animations = {
        icons: [
            '0',
            (width ? '-80vw' : '-40vw')

        ],
        calculator: [
            '100vw',
            (width ? '20vw' : '60vw')
        ]
    }

    const getElements = (classNames: string[]) => {
        let elements: Element [] = []
        classNames.forEach(className => {
            const element = document.querySelector(`.${className}`);
            if (element)
                elements.push(element)
        })
        return elements
    }
    const giveStyle = (value: string, element: Element) => {
        const el = element as HTMLElement
        el.style.transform = `translateX(${value})`
    }
    const decideValue = (el: Element, direction: 0 | 1) => {
        const key: keyof typeof animations = [...el.classList].join().includes('icon') ? 'icons' : 'calculator'
        return animations[key][direction]
    }


    return async (ev: React.MouseEvent<SVGElement>) => {
        ev.stopPropagation();
        ev.preventDefault();

        const elements = getElements(['alerts-icon-div', 'calculator'])

        if (isTheOtherClicked && isTheOtherClicked === 'Alerts') {
            await animateTheOtherFirst(Which.Alerts, setIsTheOtherClicked)
        }
        const direction = wasClicked ? 0 : 1
        elements.forEach(element => {
            giveStyle(decideValue(element, direction), element)
        })
        setIsTheOtherClicked(wasClicked ? null : 'Calc')
        wasClicked = !wasClicked
    }
}


const UserIcon: React.FC<PUserIcon> = memo(({userName, imgUrl, isMobile, wachlsit}) => {


    const [hovered, setHovered] = useState<boolean>(false)
    const clickFunc = useMemo(() => {
        return clickEvent(setHovered)
    }, [])

    const navigation = useNavigate()


    const [alertsContent, setAlertsContent] = useState<TAlertsContent[] | null>(null)
    const location = useLocation()
    const isMarket = useMemo(() => location.pathname.includes('market'), [location])
    const [width, setWidth] = useState<boolean>(window.innerWidth < 640)
    const [isCalculatroOrAlertsClicked, setisCalculatroOrAlertsClicked] = useState<string | null>(null)


    useEffect(() => {

        if (isMarket) {
            checkAlerts(wachlsit, setAlertsContent, ).then(_ => {});
        }

    }, [wachlsit])
    useEffect(() => {
        const func = () => {
            setWidth(window.innerWidth < 640)
        }
        window.addEventListener('resize', func)
        return () => {
            window.removeEventListener('resize', func)
        }
    }, []);
    return (
        <>
            <div
                className='flex flex-col-reverse  md:flex-row-reverse items-center lg:gap-[0.8em] lg:mr-[2em] relative cursor-pointer'>
                <h1 className='text-content text-[#fff]'>{userName}</h1>
                {imgUrl ?
                    (
                        <img
                            className="w-[6vh] h-[6vh]  lg:right-[2em]  left-0  rounded-[100%]"
                            src={imgUrl}
                            alt={`image for user `}
                            onClick={clickFunc}
                        />
                    ) :
                    <AnonyMusUserCover className="w-[6vh] h-[6vh] lg:right-[2em]  left-0  rounded-[100%]"
                                       onClick={clickFunc}
                    />
                }
                <AnimatePresence>
                    {(hovered &&
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: '-8vh',
                                x: '-20%'
                            }}
                            animate={{
                                y: '5vh',
                                opacity: 1,
                                x: '-20%'
                            }}
                            exit={{
                                y: '-8vh',
                                opacity: 0,
                                x: '-20%'
                            }}
                            transition={{
                                duration: 0.5,
                                type: 'easeInOut'
                            }}
                            className="absolute z-50 before:w-[2em] left-0  p-[0.5em] top-[1em] bg-nav-bar-pop rounded-xl">
                            <ol
                                className="text-user-actions z-50 relative  text-[#fff]"
                            >

                                <li className='flex gap-[1em]
                                    justify-center items-center
                                     w-[max-content]  hover:border-b-1
                                    transition duration-300 ease-in-out hover:border-active-nav-logos
                                    cursor-pointer text-sub-content
                                    '
                                    onClick={(ev) => {
                                        clickedSignOut(ev, navigation).then(_ => {
                                        })
                                    }}
                                >
                                    <span className="">Sign out</span>
                                    <SignOut className="w-[2vh] h-[2vh]"/>
                                </li>
                            </ol>
                        </motion.div>
                    )
                    }
                </AnimatePresence>
            </div>
            {isMarket &&
                <>
                    <div className="top-[6em] w-[100vw] z-10 left-[0] absolute left flex justify-end ">
                        <div
                            className="w-fit h-fit px-[1em] py-[0.4em] relative rounded-tl-[16px] flex alerts-icon-div justify-center gap-[1em] transition duration-500 ease-in-out items-center rounded-bl-[16px] bg-[#262b31]">
                            <AlertsIcon
                                onClick={(ev) => {
                                    animations(ev, AnimationsDirections.left, isCalculatroOrAlertsClicked, setisCalculatroOrAlertsClicked)
                                        .then(_ => {
                                        })
                                }}
                                className="w-[1.5em] cursor-pointer  h-[1.5em] alerts-icon  "/>

                            <Calculator
                                onClick={(ev) => {
                                    ev.stopPropagation();
                                    ev.preventDefault()
                                    handleCalculator(width, isCalculatroOrAlertsClicked, setisCalculatroOrAlertsClicked)(ev).then(_ => {
                                    })
                                }}
                                className="w-[1.5em] cursor-pointer  h-[1.5em] "
                            />
                        </div>
                    </div>

                    <section
                        className={`flex overflow-x-hidden absolute w-screen bg-[#262b31] left-0 top-0  z-50 h-screen translate-x-[100vw] justify-start  alerts-section transition duration-500 ease-in-out`}>
                        {
                            giveContent(alertsContent, setAlertsContent, setisCalculatroOrAlertsClicked)
                        }
                    </section>
                    <section
                        className={`transition duration-500 p-[0.5em] rounded-tl-[6px] top-[3em] ease-in-out calculator absolute z-20 rounded-bl-[6px] left-0 translate-x-[100vw] bg-[#262b31] w-[80vw] sm:w-[40vw] h-[20vh] lg:h-[25vh]`}>
                        <div className={`h-full w-full flex-grow relative z-0`}>
                            <CalculatorCom/>
                        </div>
                    </section>
                </>
            }
        </>
    )
})

export default UserIcon