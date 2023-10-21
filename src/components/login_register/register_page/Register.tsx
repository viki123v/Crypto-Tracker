import AnimatedLogo from "../../../static assets/logo_animated/AnimatedLogo";
import PopUp from "./PopupRegister"
import InputFields from '../InputFields.tsx'
import React, {useState, createContext, useMemo, useEffect} from 'react'
import Error from "../../error_loading/errorComponent.tsx";
import {useNavigate} from 'react-router-dom'
import {formAction} from "./loginLogic.ts";
import {AnimatePresence} from "framer-motion";

interface RegisterProps {
    isRegister: boolean,
}

export interface TypeContextRegister {
    isRegister: boolean,
    setError: Function,
    navigate: Function,
}
type TError = {
    isError : boolean ,
    message : string | null
}
export const ContextRegister = createContext<TypeContextRegister | null>(null)

let prev: TError = {
    isError : true,
    message : null
}
let timer: NodeJS.Timeout;
const Register: React.FC<RegisterProps> = ({isRegister,}) => {

    const [
        error, setError
    ] = useState<TError >({isError: true, message : null })

    const navigate = useNavigate()

    const formActionProps = useMemo<TypeContextRegister>(() => ({
        isRegister: isRegister,
        navigate: navigate,
        setError: setError,
    }), [])

    useEffect(() => {

        if (
            prev.isError !== error.isError ||
            prev.message !== error.message
        ) {
            timer  = setTimeout(() => {
                console.log('sho prshe ', error )
                setError({
                    isError : true,
                    message : null
                })
            }, 5000)
        }

    }, [error]);

    return (
        <ContextRegister.Provider value={{isRegister, setError, navigate}}>
            <article id={`${isRegister ? "Register" : "Login"}Article`} className="w-screen h-screen
            grid place-items-center overflow-hidden bg-back-col
            ">
                <div className="flex flex-col gap-[min(5vw,2rem)] items-center ">
                    <div className="justify-center flex flex-col items-center gap-[5px] ">
                        <AnimatedLogo classNames="w-[clamp(7rem,3rem+14.9vw,12rem)]"/>
                        <h1 className="text-header  text-logo">
                            <span>Register into </span>
                            <span className="logoName font-Vendetta ">VendettaTrack</span>
                        </h1>
                    </div>
                    <PopUp func={setError}/>
                    <form
                        onSubmit={(ev) => {
                            if (ContextRegister) {
                                formAction(ev, formActionProps)
                            }
                        }}
                        method="post"
                        action={`${isRegister ? '/register' : '/login'} `}
                            className={
                            `inputField bg-pop-up-col
                                text-content-form-login
                                w-fit h-fit
                                ${isRegister?"h-[12em]" : "h-[14em]"}
                                animate-zgolemi_y
                                grid 
                                grid-cols-1 
                                rounded-xl
                                gap-5
                                p-[1em]
                                pb-[1.5em]
                                shadow-lg
                                `}
                        id="inputCredentials"
                    >
                        <InputFields isRegister2={false}/>
                    </form>
                    <button
                        form='inputCredentials'
                        className="bg-[#008000] box-border w-[calc(8ch+30px)]   rounded-xl
                        p-1 text-content text-[#fff] shadow-lg"
                    >{isRegister ? "Register" : "Login"}</button>
                </div>
            </article>
            <AnimatePresence>
                {error.message && <Error message={error.message} isError={error.isError}/>}
            </AnimatePresence>
        </ContextRegister.Provider>
    )
}
export default Register
// ushte action klaj na formot i to e to
// posle so react router form ke napreme