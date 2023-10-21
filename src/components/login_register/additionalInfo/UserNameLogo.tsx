/// <reference types="vite-plugin-svgr/client"/>
import {ReactComponent as AnonymusLogo} from '../../../static assets/register_img/anonymusUser.svg'
import InputFields from "../InputFields.tsx";
import React, {useState, useRef} from 'react'
import Error from "../../error_loading/errorComponent.tsx";
import {useLoaderData, useNavigate} from "react-router-dom";
import {handleSubmitUsername} from "./helpers.ts";
import {motion as m } from 'framer-motion';
const setClickLogoToFile = (fileInput: React.MutableRefObject<HTMLInputElement | undefined | null>) => {
    if (typeof fileInput.current !== 'undefined' && fileInput.current !== null) {
        fileInput.current.dispatchEvent(new MouseEvent('click'))
    }
}

//TODO: da vidime dali slikata se menvit ushte od ko ke se klajt

type TLoader = {
    email : string,
    passwrod: string,
}
const changeImageForUser = (
    ev: React.ChangeEvent<HTMLInputElement>,
    setImgUrl : Function,
    setImgDisplay : Function
) => {
    if(!ev.target || !ev.target.files)
        return
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImgDisplay(reader.result)
    })
    setImgUrl(ev.target.value )
    reader.readAsDataURL(ev.target.files[0])
}
const UserNameLogo = () => {

    const fileInput = useRef<HTMLInputElement | null>();
    const [error, setError] = useState<string | null>(null)
    const {email} = useLoaderData() as TLoader
    const navigate = useNavigate()
    const [imgUrl , setImgUrl ] = useState<string|null>(null)
    const [imgDisplay, setImgDisplay] = useState<string|null>(null)

    return (
        <>
            <m.article  className="
            w-scren h-screen
            bg-back-col
            grid place-items-center
        "
            >
                <div

                    className="text-content w-[50vw] grid grid-row-rowsUserName items-center max-w-[515px]
                ">
                    <div

                        className={`
                anonymusContainerRect   grid justify-center items-end`}
                         onClick={() => {
                             setClickLogoToFile(fileInput)
                         }}>
                        <div className='w-fit h-fit relative top-[2em]'>
                            <div className='w-fit h-fit p-1 bg-back-col rounded-[100%]'>
                                {imgDisplay  ?
                                    <img
                                        src={imgDisplay}
                                        className="rounded-[100%] w-[5em] h-[5em]"/> :
                                    <AnonymusLogo className="w-[5em] h-[5em] "/>
                                }
                            </div>
                            <input
                                className="opacity-0 absolute"
                                ref={(node) => {
                                    fileInput.current = node
                                }}
                                type='file'
                                name={`change cover image`}
                                form='userName'
                                onChange={(ev) => { changeImageForUser(ev, setImgUrl,setImgDisplay)}}
                            />
                            <label
                                className="opacity-0 absolute"
                                htmlFor="change cover image">Add image to your user</label>
                        </div>
                    </div>
                    <m.form
                        method="post"
                          id='userName'
                          onSubmit={(ev) => {
                              handleSubmitUsername(ev,email, setError, navigate ).then(_ => { })}}
                          className={`
                          inputField text-content
                          rounded-tr-[60px] 
                          rounded-tl-[60px]
                         grid p-6 grid-cols-1 sm:grid-cols-2 
                        gap-y-[1.5em] sm:gap-x-[1em] 
                        bg-pop-up-col rounded-xl
                          pt-[3em] w-full
                        sm:px-[1.5em] sm:pt-[3em] sm:pb-[1.5em]
                      `}
                          name={`Username name surname form`}>
                        <InputFields
                            className="ml-[0.4em] grid place-items-center"
                            isRegister2={true}/>
                    </m.form>
                    <div className=" grid place-items-center ">
                        <button
                            form="userName"
                            className="
                    bg-green text-[#fff]
                    text-sub-content mt-[2em]
                    p-[0.6em] rounded-xl
                    relative
                    ">Complete Register
                        </button>
                    </div>
                </div>
            </m.article>
            {error && <Error isError={true} message={error}/>}
        </>
    )
}
// da napresh da se zemat coverot i drugite podatoci
export default UserNameLogo;