import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;

type TkajSme = (typeof elements)[number]
type TdataView = 'not' | 'is'


const elements = ['footer', 'circle', 'article'] as const

enum CircleAnimationDirection {
    open,
    close
}

enum ScaleDirectoins {
    up,
    down
}

enum Shift {
    left,
    right
}

const changeDataview = (el: HTMLElement, to: TdataView) => {
    el.setAttribute('data-view', to)
}
const dealWithClasses = (el: HTMLElement, removeClass: string, addClass: string) => {
    el.classList.add(addClass);
    el.classList.remove(removeClass);
}


const circleAnimation = (direction: CircleAnimationDirection) => {
    //clipped-circle ili full-circle

    const circleAnimationClasses = ['clipped-circle', 'full-circle']
    const circle = document.querySelector('.clip_circle') as HTMLElement


    // se otvarat circleot -> inView circle
    if (direction === CircleAnimationDirection.open) {
        // so clipot ke si igrame
        dealWithClasses(circle, circleAnimationClasses[0], circleAnimationClasses[1])
        changeDataview(circle, 'is')
    }
    // se zatvorat circle -> not in view
    else {
        dealWithClasses(circle, circleAnimationClasses[1], circleAnimationClasses[0])
        changeDataview(circle, 'not')
    }
}
const scaleAnimation = (direction: ScaleDirectoins) => {

    const footer = document.querySelector('.footer-glaven') as HTMLElement,
        circle = document.querySelector('.clip_circle') as HTMLElement,
        divOpacity = document.querySelector('.changeOpacity') as HTMLElement,
        article = document.querySelector('#article-circle') as HTMLElement

    if (direction === ScaleDirectoins.down) {
        divOpacity.style.opacity = '0'
        footer.style.opacity = '1'
        article.style.background = 'rgb(16, 22, 28)'
        dealWithClasses(circle, 'scale-up', 'scale-down')

        const push = window.innerHeight < 900 ? '130vh' : '70vh'
        circle.style.transform = `scale(0.5) translateY(-${push}) `
        changeDataview(footer, 'is')
    } else {
        setTimeout(() => {
            divOpacity.style.opacity = '1'
            footer.style.opacity = '0'
        }, 500)
        circle.style.transform = `scale(1) translateY(0) `
        dealWithClasses(circle, 'scale-down', 'scale-up')
        changeDataview(footer, 'not')
    }

}

const getElements = () => {
    const atrcile = document.querySelector('#article-circle') as HTMLElement,
        circle = document.querySelector('.clip_circle') as HTMLElement,
        footer = document.querySelector('.footer-glaven') as HTMLElement

    return [atrcile, circle, footer]

}


const kajSme = (): TkajSme => {
    const getDataView = (element: HTMLElement) => {
        return element.getAttribute('data-view')
    }

    const viewElements = [...(getElements().map(val => getDataView(val)) as TdataView[])]
        .reverse()
    for (let i = 0; i < 3; i++) {
        if (viewElements[i] === 'is') {
            return elements[i] as TkajSme
        }
    }
    return 'article'

}
const shift = (dir: Shift) => {

    const valuesTranslate = ['translateX(-100vw)', 'translateX(0)']

    const article = (document.querySelector('#article-circle') as HTMLElement).firstChild as HTMLElement,
        section = document.querySelector('.clip_circle') as HTMLElement

    if (dir === Shift.left) {
        article.style.transform = valuesTranslate[0]
        changeDataview(section, 'is')
    } else {
        article.style.transform = valuesTranslate[1]
        changeDataview(section, 'not')
    }

}
const scaleDesk = (dir: ScaleDirectoins) => {

    const article = document.querySelector('#article-circle') as HTMLElement,
        footer = document.querySelector('.footer-glaven') as HTMLElement


    if (dir === ScaleDirectoins.down) {
        article.style.transform = 'scale(0.5) translateY(-100vh)'
        footer.style.opacity = '1'
        changeDataview(footer, 'is')
    } else {
        article.style.transform = 'scale(1) translateY(0)'
        footer.style.opacity = '0'
        changeDataview(footer, 'not')
    }
}
export const decideAnimationDesk = (kajSme: TkajSme, wheel: WheelEvent): void => {

    const {deltaY} = wheel


    switch (kajSme) {
        case "article":
            if (deltaY < 0) {
                return
            }
            shift(Shift.left)
            break;
        case "circle":
            if (deltaY < 0) {
                shift(Shift.right)
            } else {
                scaleDesk(ScaleDirectoins.down)
            }
            break;
        case "footer":
            if (deltaY > 0) {
                return
            }
            scaleDesk(ScaleDirectoins.up)
            break;
    }
}
export const decideAnimationMobile = (kajSme: TkajSme, wheel: WheelEvent) => {

    const {deltaY} = wheel

    switch (kajSme) {
        case "article" :
            if (deltaY < 0) {
                return;
            }
            // ojt nagore nishto ne preme
            circleAnimation(CircleAnimationDirection.open)
            break;
        case 'circle' :
            if (deltaY < 0) {
                circleAnimation(CircleAnimationDirection.close)
            } else {
                scaleAnimation(ScaleDirectoins.down)
            }
            break;
        case 'footer' :
            if (deltaY > 0) {
                return
            }
            scaleAnimation(ScaleDirectoins.up)
            break;
    }


}

export const giveShouldAnimate = (): Function => {

    let wentIn: boolean = false;

    return (
        ev : WheelEvent,
        decideAnimation: Function
    ) => {
        if (wentIn) {
            ev.stopPropagation();
            ev.preventDefault();
            return
        }

        ev.stopPropagation()
        const scroll = window.scrollY,
            height = window.innerHeight,
            article = document.querySelector('#article-circle') as HTMLElement

        if (height <= Math.ceil(scroll) && !wentIn) {
            changeDataview(article, 'is')
            decideAnimation(kajSme(), ev)
            wentIn = true;
            setTimeout(() => {
                wentIn = false;
            }, 500)
        } else if (article.getAttribute('data-view') === 'is') {
            changeDataview(article, 'not')
        }
    }

}
export const preventScroll = (ev: WheelEvent) => {
    const circle = document.querySelector('.clip_circle') as HTMLElement
    const {deltaY} = ev
    if (circle.getAttribute('data-view') === 'is' && deltaY < 0) {
        ev.preventDefault()
    }
}