/// <reference types="vite-plugin-svgr/client"/>
import {redirect, useNavigate} from "react-router-dom";
import {motion as m } from 'framer-motion' ;
import React,{useEffect} from "react";
import {LoaderFunctionArgs} from "@remix-run/router/utils";
import {useLoaderData} from "react-router-dom";
import {ReactComponent as AnimatedLogo} from "../static assets/logo_for_loading.svg";

export const Ltowhere = async ({request, params } :LoaderFunctionArgs) :Promise<string> => {
   const {toWhere,toWhere1,toWhere2} = params;
   if(!toWhere){
       redirect('/')
       return ''
   }
   let url = '/'+toWhere;
   if(toWhere1)
       url += '/' + toWhere1;
   if(toWhere2)
       url += '/' + toWhere2;
   return url ;
}
const dots3 = Array.from(Array(3).keys());

const RedirectLoading = () =>{
    const navigation = useNavigate() ;
    const toWhere = useLoaderData() as string;

    useEffect(() => {
        let timer = setTimeout(() => {
            navigation(toWhere);
        }, 2100) ;
        return ( ) => {
            clearTimeout(timer)
        }
    }, []);

    return (
        <article className=" bg-[#1c1e21]  grid w-screen h-screen place-items-center">
            <div className="w-[80%] lg:w-[40%] h-[50%] flex flex-col gap-[2em] items-center justify-center">
                <AnimatedLogo className={"w-[15em] h-[15em]  "} />
                <div className='flex flex-col gap-[1em] w-[60%]'>
                    <h1 className="text-header text-active-nav-logos">
                        <span>Loading</span>
                        <m.span
                            variants={{
                                initial:{
                                    overflow : 'hidden'
                                },
                                animate:{
                                    overflow : 'visible',
                                }
                            }}
                            initial="initial"
                            animate="animate"
                            transition={{
                                duration : Infinity,
                                staggerChildren : 0.1,
                            }}
                        >
                            {
                                dots3.map(val => {
                                    return (
                                        <m.span
                                            variants={{
                                                initial: {
                                                    opacity : 0,
                                                } ,
                                                animate :  {
                                                    opacity : 1
                                                }
                                            }}
                                            transition={{
                                                duration : 1,
                                                repeat : Infinity,
                                                type : 'linear',
                                            }}
                                            key={val}> .
                                        </m.span>
                                    )
                                })
                            }
                        </m.span>
                    </h1>
                    <div className="p-[1em] w-full loading border-active-nav-logos border-1 rounded-xl lg:w-full flex justify-start items-center  h-[20px]">
                        <div className="bg-active-nav-logos w-full h-[16px] animate-loading rounded-xl ">
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default RedirectLoading ;
