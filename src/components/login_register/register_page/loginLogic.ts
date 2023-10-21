import {FormEvent} from "react";
import {TypeContextRegister} from "./Register.tsx";
import {fireStore, fireAuth} from "../../../firebaseConfig.ts";
import {doc, getDoc, setDoc} from 'firebase/firestore'
import {
    signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword
    , sendSignInLinkToEmail, signInWithEmailAndPassword,deleteUser
} from 'firebase/auth'
import firebase from "firebase/compat/app";
import UserCredential = firebase.auth.UserCredential;
import userIcon from "../../navigation/UserIcon.tsx";

const dealWithNavigation = (
    isRegister: boolean,
    navigate: Function,
    mistake? : boolean
) => {

    const boolFromMistake = typeof mistake !== undefined && mistake
    if( isRegister && boolFromMistake ){
        navigate('/loading/additionalInfo')
    }
    else {
         navigate('/loading/user/market')
    }
}
const dealWithError = (
    setError: Function,
    errorObject: unknown
) => {
    if (!(errorObject instanceof Error)) {
        return
    }

    let message: string
    switch (errorObject.message) {
        case "Firebase: Error (auth/invalid-email).":
            message = 'Invalid email address.';
            break;
        case 'Firebase: Error (auth/wrong-password).':
            message = 'Wrong password.'
            break;
        case 'Firebase: Error (auth/user-not-found).':
            message = 'User not found.';
            break;
        case 'Firebase: Error (auth/email-already-in-use).':
            message = 'There is a account with this email already';
            break;
        case "Firebase: Password should be at least 6 characters (auth/weak-password).":
            message = "Passwrods needs to be at least 6 characters";
            break ;
        default:
            message = 'An error occurred'
    }
    setError({
        message,
        isError : true
    })
}
type ResponseDocFireStore = {
    _document: {
        data: {
            value: {
                mapValue: {
                    fields: object
                }
            }
        }
    }
}
export const dealWithDoc = async (
    email: string,
) => {
    const docuemntFuncAction = async (
        func: Function ,
        email: string,
        setUser: boolean
    ) => {
        const refDocUser = doc(fireStore, 'users', email);
        if (setUser) {
            return await func(refDocUser, {set: true})
        }
        return await func(refDocUser)
    }

    let userMistake = false
    let  userDoc:ResponseDocFireStore = await docuemntFuncAction(getDoc, email as string, false)


     if  (userDoc._document === null ) {
        await docuemntFuncAction(setDoc, email as string , true);
        userMistake = true
    }

    return userMistake
}

export const handleClickPopUp = async ({isRegister, setError,navigate}: TypeContextRegister) => {
    const authProvider = new GoogleAuthProvider()
    try {
        const {user} = await signInWithPopup(fireAuth, authProvider)

        dealWithNavigation(isRegister, navigate, await dealWithDoc( user.email as string))
        window.localStorage.setItem('email', user.email as string)
        window.localStorage.setItem('pop', '1');
    } catch (err) {
        dealWithError(setError, err)
    }

}
const checkIfUserIsRegsiter = async (email:string, pass:string) =>{
    try{
        const user = await createUserWithEmailAndPassword(fireAuth,email,pass);
        await deleteUser(user.user);
        return new Promise((res : Function ) => {
            res()
        })
    }catch(e){
        throw e;
    }
}
export const formAction = async (
    ev: FormEvent,
    {
        setError,
        isRegister,
        navigate,
    }: TypeContextRegister,
) => {
    ev.stopPropagation()
    ev.preventDefault()

    const dealWithFormEvent = (
        ev: FormEvent,
        setError: Function
    ) => {
        let userInput: FormData | FormDataEntryValue[] = new FormData(ev.target as HTMLFormElement)
        userInput = [...userInput.values()]

        if (userInput.length === 3 && userInput[1] !== userInput[2]) {
            setError({
                message : "Passwords don't match",
                isError : false
            })
            return;
        }

        return userInput.flatMap((val, indx) =>
            indx === 2 ? [] : val.toString())
    }
    const displayInfoMessage = (message : string, setError: Function  ) :void => {
        setError({
            message,
            isError : false
        })
    }

    const userCredentails = dealWithFormEvent(ev, setError)
    const actionCode = {
        url: 'http://localhost:5173/additionalInfo',
        handleCodeInApp: true,
    }

    if (!userCredentails) { return    }


    try {
        if(isRegister) {
            await checkIfUserIsRegsiter(userCredentails[0], userCredentails[1]).then((res) => {})
            await sendSignInLinkToEmail(fireAuth, userCredentails[0], actionCode);
            displayInfoMessage("An email link has been sent to your email", setError);

            window.localStorage.setItem("email", userCredentails[0]);
            window.localStorage.setItem('password', userCredentails[1]);
        }else {
            const user = await signInWithEmailAndPassword(fireAuth, userCredentails[0], userCredentails[1]) ;
            await dealWithDoc(userCredentails[0]);
            window.localStorage.setItem('email', userCredentails[0]);
            dealWithNavigation(isRegister, navigate);
        }

    } catch (err) {
        dealWithError(setError, err)
    }


}