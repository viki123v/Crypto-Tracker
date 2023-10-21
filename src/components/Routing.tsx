import {createBrowserRouter, createRoutesFromElements, redirect, Route} from 'react-router-dom'
import Learn from "./learn/Learn";
import Navbar, {loadUser} from "./navigation/Navbar";
import Error from "./error_loading/errorComponent";
import Register from "./login_register/register_page/Register.tsx";
import UserNameLogo from "./login_register/additionalInfo/UserNameLogo.tsx";
import Filter from "./crypto_price/Filter.tsx";
import WelcomePage from "./welcome_pagee/Home.tsx";
import React from 'react'
import {useNameLoader} from "./login_register/additionalInfo/helpers.ts";
import {initalLoad} from "./crypto_price/apsContent/loaderHook.tsx";
import GraphMobile, {loaderGraphMobile} from "./crypto_price/Graph/GraphVersions/GraphMobile.tsx";
import News, {initalLoadNews} from "./News/News.tsx";
import RedirectLoading, {Ltowhere} from "./RedirectLoading.tsx";
import NftPage, {loaderNFTsPage} from "./NFTs/NftPage.tsx";
import NftCollection, {loadingCollection} from "./NFTs/NftCollection.tsx";

let mobile = window.innerWidth < 1000

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path='/'
        >
            <Route index loader={() => redirect('/home')}/>

            <Route path="/home" element={<WelcomePage/>}/>
            <Route
                path='*'
                errorElement={<Error isError={true} message={'The page is not found'}/>}
            />
            <Route
                path="login"
                element={<Register isRegister={false}/>}
            />
            <Route
                path="register"
                element={<Register isRegister={true}/>}
            />
            <Route
                path="additionalInfo"
                loader={useNameLoader}
                element={<UserNameLogo/>}
            />
            <Route path={"loading/:toWhere/:toWhere1/:toWhere2"} loader={Ltowhere} element={<RedirectLoading/>}/>
            <Route path={"loading/:toWhere"} loader={Ltowhere} element={<RedirectLoading/>}/>
            <Route path={"loading/:toWhere/:toWhere1"} loader={Ltowhere} element={<RedirectLoading/>}/>
            <Route path="user" element={<Navbar/>} loader={loadUser}>
                <Route path="market" loader={initalLoad} element={<Filter isMobile={mobile}/>}/>
                {mobile && <Route path="market/:id" loader={loaderGraphMobile} element={<GraphMobile/>}/>}
                <Route path="news" element={<News/>} loader={initalLoadNews}/>
                <Route path="learn" element={<Learn/>}/>
                <Route path="nft" loader={loaderNFTsPage} element={<NftPage />}/>
                <Route path={"collection/:collectionSlug"} loader={loadingCollection} element={<NftCollection />}/>
            </Route>
        </Route>
    )
);
export default router;