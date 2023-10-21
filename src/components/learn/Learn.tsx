import Loading from "../error_loading/loadingPage";
import {which_content_is_needed} from "../../static assets/learningContent/learningContent";
import React, {useEffect, useState} from 'react'
import {
    create_main_text_content,
    change_page,
    change_page_via_aside_content,
    craete_subHeading
} from './creating_parts'
import {rasporedTitles} from "./creating_parts";

export interface ContentComponentProps {
    current_title: string,
    change_current_tittle: React.Dispatch<React.SetStateAction<string>>
}

const Content = (props: ContentComponentProps) => {
    const {current_title, change_current_tittle} = props
    const content = which_content_is_needed(current_title);
    let currentIndx = rasporedTitles.indexOf(props.current_title)
    let subheading: string[] = []
    const navClassNames = `max-w-[max-content] nav_button  
                        text-[#fff] p-[1em]
                          transition duration-200 ease-in-out 
                            rounded-xl flex items-center flex-col 
                         justify-center group/parent-div cursor-pointer`
    return (
        <>
            <main className="px-[1em] break-words sm:mx-[5em] md:mx-0 lg:px-0 ">
                {create_main_text_content(content, subheading)}
                <footer className='w-full flex justify-center gap-[1.5em] mt-[2em] border-t-1 border-solid text-learn-content  border-active-nav-logos
                pt-[3em] mb-[4em]'>
                    <nav
                        onClick={(ev) => {
                            change_page(ev, {action: 'back'}, change_current_tittle, current_title)
                        }}
                        className={`${currentIndx === 0 ? 'opacity-50 text-learn-content' : 'text-learn-content  hover:translate-x-[1em] hover:shadow-nav-right border-solid hover:translate-y-[-1em] hover:border-inactive-color  hover:bg-[#161515]  hover:border-2 ' } 
                        ${navClassNames}`}>
                        <span>{currentIndx === 0 ? rasporedTitles[currentIndx] : rasporedTitles[currentIndx - 1]}</span>
                        <br/> <span className={`${currentIndx !== 0 ? 'group-hover/parent-div:text-active-nav-logos' : ''} text-content`}>&nbsp;&nbsp;&lt;&lt;&lt;</span>
                    </nav>
                    <nav
                        onClick={(ev) => {
                        change_page(ev, {action: 'forward'}, change_current_tittle, current_title)
                    }}
                         className={`${currentIndx === 3 ? 'opacity-50' : 'hover:translate-x-[1em] hover:shadow-nav-right hover:translate-y-[-1em] hover:border-inactive-color  hover:bg-[#161515]  hover:backdrop-blur-lg hover:border-1'} 
                          ${navClassNames}`}>
                        <span className="text-content">  {currentIndx === 3 ? rasporedTitles[currentIndx] : rasporedTitles[currentIndx + 1]} </span>
                         <span className={`${currentIndx !== 3? 'group-hover/parent-div:text-active-nav-logos' : ""} text-content`}>&nbsp;&nbsp;&gt;&gt;&gt;</span>
                    </nav>
                </footer>
            </main>
            <nav
                className={`tableContents through pages order-start text-content lg:border-none lg:bg-[transparent]
                    lg:p-0 md:mt-0 lg:text-sub-content 
                    hover:border-learn-header-col flex items-center flex-col sm:mt-[5em] sm:mb-[5em]
                     py-[4em]  text-learn-header-col border-active-nav-logos border-y-1     
                     bg-[#24272b]`}
                 aria-label="navigation">
                <div className="flex lg:mt-[4em]  lg:mr-0 flex-col w-[55%] h-fit items-center md:w-[max-content] md:text-start md:opacity-60 md:hover:opacity-100 lg:text-sub-content
                    mr-[1.5em]">
                    <h1 className={`tableContents_heading mb-[0.2em] text-sub-header-nav text-learn-header-col md:mb-[1em]`}>Table of contents</h1>
                    <ul className={`tableContents_holder flex md:w-[max-content] flex-col gap-[20px] text-learn-header-col cursor-pointer
                    list-disc translate-x-[3em] md:translate-x-0 text-content lg:text-sub-content   md:justify-center`}>
                        {craete_subHeading(content, subheading)}
                    </ul>
                </div>
            </nav>
        </>
    )
}

const LearnSection = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [current_page_title, set_current_page_tittle] = useState<string>(rasporedTitles[0])
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1000);

    useEffect(() => {
        const func = (ev: Event) => {
            ev.stopPropagation();
            setIsMobile(window.innerWidth < 1000)
        }
        window.addEventListener('resize', func);
        return () => {
            window.removeEventListener('resize',func);
        }
    }, []);

    if (isLoading) {
        return (
            <div className={`mt-[15vh]`}>
                <Loading />
            </div>
        )
    }

    return (
        <article className="learningPage pt-[8em] md:pt-[20vh] gap-[3em]  flex flex-col-reverse  lg:gap-[4em]  lg:grid 
           lg:grid-cols-learn-desk-content">
            { isMobile ? null :
                (<nav className="navigation_through_pages flex justify-center mt-[3em] text-sub-content">
                    <ul className={`navigation_through_pages_list px-[1em] bg-nav-bar-pop p-[0.5em] mt-[4em] 
                    opacity-70 hover:opacity-100 text-[#fff] h-fit rounded-xl grid grid-cols-1 gap-y-[1.5em]  hover:translate-y-[-2em] 
                    hover:shadow-table-content hover:bg-[#161515] hover:border-1 hover:border-active-nav-logos transition duration-200 
                        ' text-sub-content cursor-pointer `}>
                        {rasporedTitles.map((val, indx) => (
                            <li key={indx}
                                data-val={val}
                                className={`${rasporedTitles.indexOf(current_page_title) === indx ? 'active_list_content' : ''} list_content text-learn-content hover:text-active-nav-logos`}
                                onClick={(ev) => {
                                    change_page_via_aside_content(ev, set_current_page_tittle, setIsLoading)
                                }}>{val}</li>
                        ))}
                    </ul>
                </nav>)}
            <Content current_title={current_page_title} change_current_tittle={set_current_page_tittle}/>
        </article>
    )
}
//TODO add image
export default LearnSection;