/// <reference types="vite-plugin-svgr/client" />
import {ReactComponent as GoogleLogo} from "../../../static assets/register_img/icons8-google.svg";
import {motion} from 'framer-motion'
import {handleClickPopUp} from "./loginLogic";
import React,{useContext} from 'react'
import {ContextRegister} from "./Register.tsx";


export const popUpWhileClicked = {
    animate : {
        scale : 0.9
    }
}


const PopUp:React.FC<{func : Function }>  = ({func}) => {

    const contextRegistrer = useContext(ContextRegister)


    return (
        <motion.section className="cursor-pointer" variants={popUpWhileClicked}
                        whileTap="animate"
                        onClick={() => {
                            if(contextRegistrer)
                            {
                                handleClickPopUp(contextRegistrer).then(_ => { });
                            }
                        }}
            >
            <div className="grid place-items-center  ">
                <div className=" px-[10px] box-border w-fit py-1  gap-1 rounded-2xl  bg-[#fff]
                flex  items-center  ">
                    <GoogleLogo className="w-[clamp(1rem,0.5rem+3vw,3rem)] h-[clamp(1rem,0.5rem+1.5vw,3rem)]"/>
                    <h1 className=" text-[#000] w-[max-content] text-content ">
                        {contextRegistrer?.isRegister ? "Register with" : "Login with"} Google
                    </h1>
                </div>
            </div>
        </motion.section>
    )
}
export default PopUp