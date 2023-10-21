import {LoaderFunctionArgs} from "@remix-run/router/utils";
import {redirect} from 'react-router-dom'
import {FormEvent} from "react";
import {getStorage, uploadBytes, ref} from "firebase/storage";
import {fireStore} from "../../../firebaseConfig.ts";
import {getDoc, setDoc, doc} from 'firebase/firestore'
import {createUserWithEmailAndPassword} from 'firebase/auth'
import {fireAuth} from "../../../firebaseConfig.ts";
import {dealWithDoc} from "../register_page/loginLogic.ts";


const craeteUser = async (email: string, passwrod: string): Promise<void> => {
    const createDoc = async (email: string): Promise<void> => {
        await dealWithDoc(email);
    }
    try {
        await Promise.all([
            createUserWithEmailAndPassword(fireAuth, email, passwrod),
            createDoc(email)
        ])
    } catch (e) {
        throw new Error('this is an error ');
    }

}
export const useNameLoader = async ({}: LoaderFunctionArgs) => {
    const [email, password, isPopUp] = [window.localStorage.getItem('email'), window.localStorage.getItem("password"),
    window.localStorage.getItem('pop')];
    window.localStorage.removeItem('pop'); 
    if(isPopUp && email)
        return {email};

    if (!(email && password)) {
        return redirect('/');
    }
    try {
        // await craeteUser(email, password)
        // return {email, password}
        return await createUserWithEmailAndPassword(fireAuth, email,password)
            .then(_ =>{
                return dealWithDoc(email) ;
            })
            .then(_ => {
                return {email};
            }) ;
    } catch (e) {
        return redirect('/')
    }
}
export const docActions = async (
    email: string,
    setArgument?: object
) => {
    if (typeof setArgument === 'undefined') {
        return await getDoc(doc(fireStore, 'users', email))
    } else {
        await setDoc(doc(fireStore, 'users', email), setArgument)
    }
}

export const handleSubmitUsername = async (ev: FormEvent,email: string,setError: Function,navigate: Function) => {
    ev.stopPropagation();
    ev.preventDefault();

    const uploadPicture = async (
        picture: File | null,
        email: string
    ) => {
        if (!picture?.name || picture?.name === '' || !picture) {
            return false
        }
        const storage = getStorage(fireStore.app)
        await uploadBytes(ref(storage, `users/${email}`), picture)
            .catch(err => {
                console.log('tuka se jave probelm ');
                setError(err.message)
            })
        return true
    }

    const formData = new FormData(ev.target as HTMLFormElement)
    let arrFormData = [...formData.values()]
    const image = arrFormData[0]
    arrFormData.shift()

    const didUploadPicture = await uploadPicture(image as File | null, email)

    await docActions(email, {
        name: arrFormData[0].toString(),
        surname: arrFormData[1].toString(),
        username: arrFormData[2].toString()
        , hasCoverPicture: didUploadPicture
    })
    window.localStorage.removeItem('password')
    navigate('/loading/user/market');
}