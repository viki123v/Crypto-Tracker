// drop-shadow : 0 4px 4px #485057
module.exports = {
    content: [
        "./index.html",
        "./src/*.tsx",
        "./src/components/**/**/*.tsx",
        "./src/components/*.tsx",
        './src/static assets/*.tsx',
        './src/static assets/WachlistLogoAnimated.tsx'
    ],
    theme: {
        fontSize: {
            'header' : 'clamp(1.563rem, 1.44vw + 1.19rem, 2rem)' ,
            'content' : `clamp(1rem, 1.44vw + 0.627rem, 1.438rem)`,
            'sub-content' : 'clamp(0.5rem,0.5vw + 0.6rem,2rem)',
            'sub-crypto' : 'clamp(0.3rem, 0.5vw + 0.4rem, 2rem)',
            'user-actions' : "clamp(0.3rem,0.3vw + 0.4rem,2rem)",
            'content-form-login' : 'clamp(1rem, 1.029vw + 0.734rem, 1.313rem)',
            'header-welcome-page' : 'clamp(2.6rem, 12vw - 1rem,5.2rem)',
            'fiter-text' : 'clamp(0.875rem, 0.462vw + 0.755rem, 1.125rem)',
            'header-learn' : 'clamp(1.95rem, 2.54vw + 1.093rem, 3.125rem)',
            'sub-header-learn' : 'clamp(1.2rem, 1.155vw + 0.701rem, 1.625rem)' ,
            'learn-content' : 'clamp(1.015rem, 0.693vw + 0.758rem, 1.313rem)',
            'sub-header-nav' : 'clamp(1.5rem, 1.155vw + 0.701rem, 1.825rem)',
            'sub-header-welcome-page' : "clamp(0.938rem, 0.231vw + 0.878rem, 1.063rem)" ,
            'header-footer' : ' clamp(1.633rem, 0.577vw + 1.484rem, 1.945rem)',
            'sub-header-footer' : 'clamp(1.438rem, 0.938vw + 1.195rem, 1.945rem)',
            'content-footer': "clamp(1rem, 0.231vw + 0.94rem, 1.125rem)",
            'sub-image' : 'clamp(1.25rem, 0.346vw + 1.16rem, 1.438rem)',
            'welcome-rozevo' : 'clamp(0.938rem, 1.235vw + 0.618rem, 1.313rem)',
            'header-desk' : 'clamp(2rem, 2.25vw + 0.313rem, 3.125rem)',
            'content-desk' : 'clamp(1.75rem, 1.375vw + 0.719rem, 2.438rem)',
            'sub-header-desk' : "clamp(1.813rem, 2vw + 0.313rem, 2.813rem)" ,
            'header-main-desk' : 'clamp(3.75rem, 4vw + 0.75rem, 6.25rem)',
            'sub-header-main-desk' : ' clamp(1.313rem, 0.9vw + 0.638rem, 1.875rem)',
            'main-content-desk-desk' : 'clamp(1.688rem, 0.6vw + 1.238rem, 2.063rem)',
            'sub-headers-graph' : 'clamp(1rem, 0.622vw + 0.995rem, 2rem)',
            'graph-content' : 'clamp(1.063rem, 0.658vw + 0.908rem, 1.813rem)',
            'news-card-author' : 'clamp(0.75rem, 0.448vw + 0.634rem, 1.25rem)',
            'news-card-title' : "clamp(1.125rem, 0.336vw + 1.038rem, 1.5rem)",
            'news-header' : "clamp(1.875rem, 0.84vw + 1.658rem, 2.813rem)",
            'news-card-content' : 'clamp(1rem, 0.269vw + 0.93rem, 1.25rem)',
            'landing-page-nav-desk' : 'clamp(1.125rem, 0.577vw + 0.976rem, 1.438rem)',
            'text-desktop' : "clamp(1.15rem, 0.31vw + 0.99rem, 1.563rem)",
            "nft-card-content" : 'clamp(1.125rem, 1.072vw + 0.848rem, 2.188rem)' ,
            'nft-card-sub-content' : 'clamp(0.875rem, 0.757vw + 0.679rem, 1.625rem)'

        },
        lineHeight:{
            'content-line-height' : "1.8em"
        },
        colors: {
            'shadow-color-news-cards' : '#485057',
            'learn-header-col' : '#c685d6',
            'logo': '#A656C6',
            'back-col': '#1c1e21',
            'register-back' : "#082043",
            'light-info': '#6980ff'
            ,'pop-up-col' : '#2f3d53',
            'green' : '#008000',
            'red' : '#FF0000',
            'nav-bar-pop' : '#2f3338',
            'inactive-color' : '#7b418b',
            'inactive-filter-color' : '#5c39a0',
            'active-filter-color' : '#9059fc',
            'inactive-nav-logos' : '#592d62',
            'active-nav-logos' : '#e776ff',
            'nijansa-nav-bar' : "#23262a",
            'background-color' : '#1C1E21',
            "news-card" : '#082043'
        },
        boxShadow:{
            'nav-right' : "-10px 10px 20px black",
            'nav-left' : '10px 10px 20px black',
            'table-content' : '0 10px 20px black',
            'days-nav' : '0 10px 20px black',
            'desk-photos-left' : '-12px 13px 20px black',
            'photo-items-landing-page-mobile' : '0px 13px 20px black',
            'nft-cards-neutral' : '0 10px 20px black',
            'nft-cards-active' : '0 10px 30px black',
            'nft-cards-large-neutral' : '10px 20px 20px black',
            'nft-cards-large-active' : '12px 20px 25px black',

        },
        extend: {
            borderWidth:{
                DEFAULT : '1px',
                '1' : '1px'
            },
            transform :  {
                'rotate-y-2deg' : 'rotateY(2deg)'
            },
            keyframes: {
                gore_dolu_eth: {
                    '0%': {"transform": "translateY(-20px) rotateY(34deg) rotateX(24deg)"},
                    '100%': {" transform": "translateY(20px) rotateY(34deg) rotateX(24deg)"}
                },
                gore_dolu_bit : {
                    '0%' : { "transform" : "translateY(20px) rotateY(324deg) rotateX(24deg)  " } ,
                    "100%" : { "transform" : "translateY(-20px) rotateY(324deg) rotateX(24deg) "}
                },
                gore_dolu_logo : {
                    'from' : { transfrom : 'translateY(20px)'}
                    ,'to' : { transform : 'translateY(-20px)'}
                },
                zgolemi_linija : {
                    'from' : {
                        transform: "scaleY(0)"
                    },
                    "to" : {
                        transform : "scaleY(1)"
                    }
                },
                'news-cards-desk' : {
                    from : {
                        opacity  : 0.2
                    },
                    to : {
                        opacity : 1
                    }
                },
                "loading" : {
                    from : {
                        width : '0'
                    },
                    to : {
                        width :'100%',
                    }
                }
            },
            animation: {
                goreDoluBit : "gore_dolu_bit 1s ease-in-out infinite alternate",
                goreDoluEth: "gore_dolu_eth 1s ease-in-out infinite alternate"
                ,goreDoluLogo : "gore_dolu_logo 1s ease-in-out infinite alternate",
                zgolemi_y : 'zgolemi_linija 800ms ease-in-out forwards 1',
                cards_opacity : 'news-cards-desk 200ms linear forwards infinite',
                loading : 'loading 2s linear forwards 1',
            },
            backgroundImage: {
                'spiderWeb': "url('./src/static assets/endless-constellation.svg')",
            },
            gridTemplateRows : {
                'rowsUserName' : 'fit-content 1fr fit-content',
                'max-content-grid-mob' : 'repeat(4,max-content)',
                'max-crypto-row' : 'repeat(2,max-content)',
            },
            gridTemplateColumns : {
                'max-content-grid' : 'repeat(4,max-content)',
                'max-crypto-col' : 'repeat(5,minmax(min-content,1fr)) ',
                'max-filter-con': 'repeat(3,max-content)',
                'learn-desk-content' : '1fr 3fr 1fr',
            },
            clipPath : {
                'mobile-landing-page-image-section' : 'polygon(50% 0%, 88% 8%, 100% 60%, 82% 100%, 14% 100%, 0% 60%, 13% 13%);'
            }

        },
    },
    plugins: []
}