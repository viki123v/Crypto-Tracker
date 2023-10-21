import React from 'react'

export interface ContentType {
    title: string,
    content: Array<{
        sub: string,
        p: Array<string>,
        img? : string
    }>,
}

const scroll_options: ScrollToOptions = {
    left: 0,
    top: 0,
    behavior: 'smooth'
}
export const rasporedTitles: string[] = [
    'Blockchain',
    "Consensus mechanism",
    "Crypto tokens",
    "Web3"
]
interface actionChangePage{
    action : 'back' | 'forward'
}
export const craete_subHeading = ({content}: ContentType, sub_heading: string[]) => content.map(({sub}, indx) => (
    <li
        key={indx}
        onClick={(ev) => {
            const target = ev.target as HTMLElement
            const content = target.textContent
            if (content) {
                const indx_sub = sub_heading.indexOf(content)
                const el = document.querySelector(`.sub_name_${indx_sub}`)
                if (el) {
                    el.scrollIntoView({behavior: scroll_options.behavior})
                }
            }
        }}
        className={`table_content_subheading text-learn-content hover:text-[#fff]`}>{sub}</li>))
export const create_main_text_content = (object_content: ContentType, subheading: string[]) => {
    const {title, content} = object_content
    return (
        <section className={'content_section text-content grid-cols-1 grid gap-y-[1.5em]'}>
            <h1 className="text-header-learn  text-learn-header-col mt-0  
             content_header text-center  md:text-start  mb-[1.1em] focus:bg-active-nav-logos">
                <span className="">{title}</span>
            </h1>
            {content.map(({sub, p, img: imgUrl}, indx) => {
                    subheading.push(sub)
                    return (
                        <React.Fragment key={indx}>
                            <h2 className={`sub_name_${indx} 
                                    text-sub-header-learn m-0 text-learn-header-col sm:ml-[1.3em]`}>
                                <span>{sub}</span>
                            </h2>
                            {p.map((val, indx) => (
                                <p
                                    key={indx}
                                    className="indent-5 content_p m-0 text-learn-content text-[#fff]
                                    sm:ml-[1.3em] sm:mr-[1.3em] leading-content-line-height ">{val}</p>
                            ))}
                            {imgUrl ?
                                <div className={'w-full h-auto justify-center flex items-center '}>
                                    <img className="w-[80%] aspect-[4/1] my-[1em]" src={imgUrl} alt={`image for ${title}`} />
                                </div> : null
                            }
                        </React.Fragment>
                    )
                }
            )}
        </section>
    )
}
export const change_page = (ev: React.MouseEvent<HTMLElement>, {action}: actionChangePage, change_page: React.Dispatch<string>, current_content: string) => {

    window.scrollTo({...scroll_options})
    let idnex_current = rasporedTitles.indexOf(current_content)

    if (action === 'back' && idnex_current != 0 ) {
        change_page(rasporedTitles[--idnex_current])
    } else if(idnex_current !=rasporedTitles.length - 1 ){
        change_page(rasporedTitles[++idnex_current])
    }

}
export const change_page_via_aside_content = (ev: React.MouseEvent<HTMLLIElement>, change_title: Function, change_loading: Function) => {
    ev.stopPropagation()
    const target = ev.target as HTMLLIElement
    const dataKey = target.dataset.val

    change_title(dataKey)
    change_loading(true);
    setTimeout(() => {
        change_loading(false)
    }, 400)
}