/// <reference types="vite-plugin-svgr/client" />
import {useContext} from 'react';
import {ContextRegister} from "./register_page/Register";
import {ReactComponent as PassSee} from '../../static assets/register_img/passwordSee.svg'
import React from 'react'
import {TypeContextRegister} from "./register_page/Register.tsx";

interface InputFieldsComponentProps {
    isRegister2: boolean,
    className? : string
}
const opacity = 'opacity-30'
const styles = {
    input : {
        values : `
        w-full
        text-[#fff]
        focus-visible:rounded-xl
        transition
        duration-500
        border-[transparent]
        focus:ring-0
        focus-visible:opacity-100
        focus:outline-none
        focus-visible:border-2
        focus-visible:outline-none
        focus-visible:outline-offset-0
        border-b-2 ${opacity} focus-visible:opacity-100
        bg-[transparent] border-logo
        px-2  h-[1.5em] p-[1em] 
        valid:opacity-100
        text-content 
        `
    },
    labels : {
        values : `
         text-content 
         focus-visible:outline-none
        focus:outline-none
        peer-valid/input_login:opacity-0
        absolute text-logo ${opacity}
        transition duration-200 delay-0
        peer-focus-visible/input_login:opacity-100
        peer-focus-visible/input_login:translate-y-[-1.2em]
        lg:peer-focus-visible/input_login:scale-[0.6]
        peer-focus-visible/input_login:scale-[0.6]
        peer-focus-visible/input_login:border-l-2
        peer-focus-visible/input_login:border-logo
        peer-focus-visible/input_login:border-r-2
        peer-focus-visible/input_login:px-2
        left-[1.9em]
        bottom-[0.1em]
        bg-pop-up-col
        pointer-events-none`
    }
}

const show = () => {

    const values = ['password', 'text']
    let current_val = 0


    return (
        ev: React.MouseEvent<SVGElement>
    ) => {

        const target = ev?.currentTarget
        if (!target?.outerHTML.match(/svg/gm)) {
            return;
        }

        ev.stopPropagation()

        const input = target?.previousSibling as HTMLInputElement,
            value = (current_val + 1) % 2


        const path = document.querySelector(
            `.${target.classList[target?.classList.length - 1]} .lineThroughEye `) as SVGPathElement

        if (input) {
            input.type = `${values[current_val]}`
        }

        path.style.opacity = `${value}`

        current_val = value
    }
}
export interface inputFieldsType {
    legend: string,
    type: string,
    form : string
}
const inputFieldsRegister2 = [
    {legend: "Name", type: 'text', form:'userName'},
    {legend: "Surname", type: 'text',  form:'userName'},
    {legend: 'Username', type: 'text', form:'userName'}
]
const inputFieldsRegister1 = [
    {legend: 'Email', type: 'text', form : 'inputCredentials'},
    {legend: 'Password', type: 'password',form : 'inputCredentials'},
    {legend: 'RetypePasswrod', type: 'password',form : 'inputCredentials'}
]

let idsForSvgs = 0;
const isPassword = (el: inputFieldsType) => {
    if (el.type === "password") {
        return (
            <div className="passwordContainer
            w-full items-center flex relative text-content  ">
                <input
                    className={`${styles.input.values} peer/input_login pl-[2em] relative`}
                    type="password"
                    required={true}
                    name={el.legend}
                    form={el.form}/>
                <PassSee
                    className={`
                    w-[1em] h-[2em]
                    ${opacity}
                    peer-focus-visible/input_login:opacity-100 
                    left-[0.5em]
                    peer-valid/input_login:opacity-100 
                    absolute ${el.legend}  `
                }
                    onClick={show()}
                    id={`svgLock${++idsForSvgs}`}/>
                <label htmlFor={`${el.legend}`}
                       className={`${styles.labels.values}`}
                >{el.legend}</label>
            </div>
        )
    } else {
        return (
            <>

                <input
                    className={`${styles.input.values} peer/input_login px-1
                    `}
                    type="text"
                    required={true}
                    name={el.legend}
                    form={el.form}
                />
                <label htmlFor={`${el.legend}`}
                       className={`${styles.labels.values} left-[0.1em]
                       `}
                >{el.legend}</label>
            </>
        )
    }
}


const InputFields = ({isRegister2, className}: InputFieldsComponentProps) => {

    let registerArrType = isRegister2 ? inputFieldsRegister2 : inputFieldsRegister1;
    const context = useContext<TypeContextRegister | null > (ContextRegister)


    return (
        <>
            {registerArrType.map((el, indx) => {
                if (!context?.isRegister && indx === 2 && registerArrType !== inputFieldsRegister2) {
                    return null;
                }
                return (
                    <fieldset
                        key={`filedSet${indx}`}
                        className={` 
                        relative
                        transition duration-100
                        w-full h-fit
                        text-content 
                        ${className ?? ''}
                        ${( window.innerWidth > 650 && el.legend === 'Username') ?
                            'col-span-3' : ''}
                         `}>
                        {isPassword(el as inputFieldsType)}
                    </fieldset>
                )
            })}
        </>
    )
}

export default InputFields