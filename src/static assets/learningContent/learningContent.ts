import {ContentType} from "../../components/learn/creating_parts.tsx";
type title_values<T extends string[]> = T[number]

const Blockchain:ContentType ={
    title : 'Blokchain',

    content : [
        {
            sub : "The effect of Blockchain",
            p : [
                "Blockchain is a transformative technology that has revolutionized various industries and continues to shape the way we interact with data, assets, and systems. At its core, a blockchain is a decentralized and distributed digital ledger that records transactions in a secure, transparent, and immutable manner. Unlike traditional centralized systems, where a single entity controls and validates transactions, blockchain operates on a network of computers (nodes) that collectively maintain the ledger through consensus mechanisms. This ensures that no single entity can manipulate the data, enhancing trust and eliminating the need for intermediaries in various processes. Each transaction, or \"block,\" is cryptographically linked to the previous one, forming a chronological chain, hence the name \"blockchain.\" This architecture provides inherent security, as altering one block would require changing subsequent blocks across the entire network, making it computationally infeasible and preserving the historical integrity of the data. ",
                "Blockchain's significance extends far beyond its initial association with cryptocurrencies like Bitcoin. Its applications span across sectors such as finance, supply chain management, healthcare, real estate, and more. In finance, blockchain enables faster and more secure cross-border payments, reduces fraud through transparent audit trails, and facilitates the creation of programmable digital assets known as \"smart contracts.\" These self-executing contracts automate processes and trigger actions when predefined conditions are met, streamlining complex negotiations and reducing the risk of disputes.",
                "Blockchain's decentralized nature makes it highly resistant to data tampering and unauthorized access, ensuring that sensitive information, such as patient records in healthcare, remains secure and private."
            ],
            img : '../../../src/static%20assets/learningContent/blockchain.jpg',
        },

        {
            sub : 'Challenges and Conclusion',
            p : [
                "Despite its potential, blockchain technology faces challenges. Scalability and energy consumption are concerns that arise from the resource-intensive consensus mechanisms used in many blockchain networks. As the technology evolves, efforts are being made to address these issues through consensus algorithm improvements and the development of more energy-efficient protocols.",
                "In conclusion, blockchain stands as a cornerstone of digital innovation, reshaping industries and driving efficiency, transparency, and trust in an increasingly interconnected world. As ongoing research and development continue to refine the technology's capabilities and address its limitations, the full spectrum of blockchain's transformative potential is yet to be fully realized."
            ]
        }
    ]
}
const ConsensusMechanism :ContentType ={
    title : "Consensus",
    content : [
        {
            sub  : "Consensus",
            p: [
                "Mining and consensus mechanisms are fundamental components of blockchain technology, playing a pivotal role in maintaining the integrity of decentralized networks and enabling secure transactions. These mechanisms underpin the operation of cryptocurrencies and ensure the trustworthiness of distributed ledgers.\n",
                "At the heart of many blockchain networks is the concept of mining, which is crucial to validating transactions and adding them to the blockchain. In proof-of-work (PoW) systems like Bitcoin, miners compete to solve complex mathematical puzzles, with the first one to solve it earning the right to add the next block to the chain. This energy-intensive process ensures that the majority of participants agree on the state of the ledger and prevents fraudulent or double-spending transactions. While effective, PoW's energy consumption has spurred the exploration of alternative consensus mechanisms.",
            ],
            img : '../../../src/static%20assets/learningContent/consensus%20mechanism.jpg'
        },
        {
            sub : "Proof of stake",
            p : [
                "One such alternative is proof-of-stake (PoS), embraced by networks like Ethereum 2.0. In PoS, validators are chosen to create new blocks based on the amount of cryptocurrency they \"stake\" as collateral. This approach is more energy-efficient than PoW and encourages validators to act in the network's best interest, as they have something at risk. PoS networks offer scalability advantages, quicker transaction finality, and a lower environmental impact, making them an attractive choice for the future of blockchain technology.",
                "Beyond PoW and PoS, there are other consensus mechanisms such as delegated proof-of-stake (DPoS), practical Byzantine fault tolerance (PBFT), and more. Each mechanism addresses different aspects of network security, scalability, and decentralization, catering to various use cases and preferences./p\n"
            ]
        }
    ]
}
const CryptoTokens :ContentType ={
    title : 'Crypto Tokens',
    content : [
        {
            sub : "Effect of crypto",
            p : [
                'Cryptocurrencies and tokens have revolutionized the financial landscape, ushering in a new era of decentralized digital assets and innovative economic models. Rooted in blockchain technology, these digital constructs have garnered immense attention, sparking discussions about their potential to reshape industries, empower individuals, and redefine the very nature of money itself./p\n',
                'At the core of this revolution is the concept of cryptocurrencies. Bitcoin, the pioneering cryptocurrency introduced in 2009 by the pseudonymous Satoshi Nakamoto, kickstarted the movement. Bitcoin, often referred to as digital gold, operates on a decentralized network of nodes that validate and record transactions on a public ledger known as the blockchain. The blockchain\'s immutability and transparency ensure security and reduce the risk of fraud, making it a trusted medium for recording transactions without the need for intermediaries like banks.',
                'The success of Bitcoin paved the way for thousands of other cryptocurrencies, each with its unique features and use cases. Ethereum, introduced by Vitalik Buterin in 2015, took the concept further by enabling the creation of smart contracts. These self-executing contracts automate and enforce agreements without intermediaries, broadening the scope of blockchain applications to encompass decentralized applications (DApps), decentralized finance (DeFi), and non-fungible tokens (NFTs).',
            ],
            img : '../../../src/static%20assets/eth.png'
        },
        {
            sub : 'L2 and so on crypto tokens',
            p : [
                'Tokens, often built on existing blockchain platforms like Ethereum, Binance Smart Chain, or Solana, are digital assets with varying functionalities. They can represent various things, including assets, utility, ownership, or access rights within a specific ecosystem. The two primary categories of tokens are utility tokens and security tokens. Utility tokens grant access to a platform\'s features or services and are commonly used in crowdfunding Initial Coin Offerings (ICOs) or Initial Exchange Offerings (IEOs). Security tokens, on the other hand, represent ownership in a company or project and are subject to regulatory oversight.',
            ]
        },
        {
            sub : 'Brief about Defi',
            p : [
                "The explosive growth of the cryptocurrency market has also led to the rise of decentralized finance. DeFi encompasses various financial services, including lending, borrowing, trading, and yield farming, all built on blockchain networks without the need for traditional financial intermediaries. This democratization of finance has the potential to provide greater access to financial services for individuals around the world, particularly those who are unbanked or underbanked."
            ]
        },
        {
            sub : 'NFTs',
            p : [
                'Non-fungible tokens (NFTs) are another fascinating development within the cryptocurrency space. NFTs are unique digital assets that represent ownership of a particular item or piece of content, such as digital art, music, collectibles, or virtual real estate. The scarcity and verifiable ownership of NFTs have attracted artists, creators, and collectors, leading to multimillion-dollar sales and sparking debates about the future of digital ownership and intellectual property rights.',
                'In conclusion, cryptocurrencies and tokens have unleashed a wave of innovation that is reshaping the financial landscape. They offer new ways of transacting, investing, and interacting with digital assets. The future holds the promise of increased financial inclusion, more efficient systems, and a reimagined concept of ownership. As the technology continues to evolve and mature, it will be exciting to witness how cryptocurrencies and tokens contribute to the ongoing transformation of the global economy.'
            ]
        }
    ]
}
const Web3 :ContentType= {
    title : 'Web3',
    content : [
        {
            sub : 'Introduction',
            p : [
                'Web 3.0, often referred to as the "Decentralized Web" or "Semantic Web," represents the next evolutionary phase of the internet. This vision encompasses a paradigm shift from the current web structure to a more decentralized, open, and user-centric online ecosystem. Web 3.0 aims to address the limitations of the current web, providing enhanced security, privacy, and user control while enabling a more seamless and interconnected digital experience.',
                'At the heart of Web 3.0 is the concept of decentralization. Unlike the current model, where data and control are concentrated in the hands of a few tech giants, Web 3.0 envisions a landscape where data ownership and control are distributed among users. Blockchain technology plays a significant role in realizing this vision by providing the infrastructure for decentralized applications (DApps) and digital identities. This empowers users with more control over their personal information and eliminates single points of failure or censorship.'
            ],
            img : '../../../src/static%20assets/learningContent/web3.png'
        },
        {
            sub : 'Tokenization and challenges',
            p : [
                'Interoperability is another key feature of Web 3.0. Currently, data is often siloed within different platforms and services, making it challenging to create a unified digital experience. Web 3.0 aims to create an interconnected network where data can flow seamlessly across different applications and services, enabling more personalized and efficient interactions.',
                'Semantic understanding is another hallmark of Web 3.0. By enabling computers to understand the meaning of data, this version of the web will facilitate more intelligent searches, recommendations, and interactions. This semantic understanding is driven by technologies like natural language processing, machine learning, and AI, which collectively enhance the user experience and accessibility of information.'
            ]
        }
    ]
}
let all_content :ContentType[]= [
    {...Blockchain},
    {...Web3},
    {...CryptoTokens},
    {...ConsensusMechanism}
]
export const which_content_is_needed =  <T extends Array<string>>( name: title_values<T>, contents:ContentType[] = all_content ):ContentType => {
    switch(name){
        case "Blockchain" : return contents[0];
        case 'Consensus mechanism' : return contents[3];
        case 'Crypto tokens' : return contents[2];
        case "Web3" : return contents[1];
        default : return contents[0]
    }
}