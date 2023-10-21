import {useEffect, useRef} from "react";
import {useAnimation, useInView} from "framer-motion";

export const variant_divs = {
    init: {
        x: -600
    },
    end: (i: number) => ({
        x: 0,
        delay: i
    })
}

export const text_var = {
    init: {
        y: 100
    },
    end: {
        y: 0
    }
}

export const animation = (
    isInView: boolean,
    controls: { start: Function }
) => {
    useEffect(() => {
        const animate = async () => {
            if (isInView) {
                controls.start('end')
            }
        }
        animate()
    }, [isInView]);
}

export const use_ref_intro =(

) =>{
    const ref = useRef<HTMLDivElement | null>(null)
    const isInView = useInView(ref,)
    const controls_text = useAnimation()

    const ref_parent_div = useRef<HTMLDivElement | null>(null)
    const in_view_parent = useInView(ref_parent_div,)
    const controls = useAnimation()


    animation(in_view_parent, controls)
    animation(isInView, controls_text)

    return {ref,ref_parent_div, controls, controls_text}
}