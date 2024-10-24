import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useState,
    useRef,
} from 'react'
import { useDimensions } from './useDimensions'

interface PhotoEssayProps {
    header?: string
}

interface PhotoRowProps {
    photos: string[]
}

interface XXX {
    dimensions: Map<any, any> | null
    setDimensions: React.Dispatch<React.SetStateAction<Map<any, any>>>
}
// Step 1. Create context
const MyContext = createContext<XXX | undefined>(undefined)

// Step 2. Create a custom hook that will return Context
// This will allow you to use the context in any number of children more easily.
// And it will also make sure that it is only used within Parent component
const useData = () => {
    const context = useContext(MyContext)

    if (!context) {
        throw new Error('useData must be used within a <Parent />')
    }

    return context
}

const PhotoEssay = (props: PropsWithChildren<PhotoEssayProps>) => {
    const [dimensions, setDimensions] = useState(new Map())
    return (
        <MyContext.Provider value={{ dimensions, setDimensions }}>
            <div className="cover-container">
                <img className="cover" src={props.header} alt={props.header} />
            </div>
            <div className="photo-essay-wrapper">
                <p className="essay-title">Berlin, Germany</p>
                <p className="essay-subtitle">November 23 — December 3, 2023</p>
                {props.children}
            </div>
        </MyContext.Provider>
    )
}

interface ImgProps {
    photo: string
    width?: number
    height?: number
}

const Img = (props: ImgProps) => {
    const { dimensions, setDimensions } = useData()
    if (!dimensions) {
        return null
    }

    return (
        <img
            style={{
                width: props.width,
                height: props.height,
            }}
            className="photo"
            src={props.photo}
            alt={props.photo}
            onLoad={(e) => {
                if (e.target instanceof HTMLImageElement) {
                    setDimensions(
                        new Map(
                            dimensions.set(props.photo, [
                                e.target?.naturalWidth,
                                e.target?.naturalHeight,
                            ])
                        )
                    )
                }
            }}
        />
    )
}
const PhotoRow = (props: PropsWithChildren<PhotoRowProps>) => {
    const ref = useRef(null)
    const { dimensions } = useData()
    const { width, height } = useDimensions(ref)
    console.log(
        `row-width: ${width}, row-height: ${height}, photo dims: ${props.photos.map(
            (name) => [name, dimensions?.get(name)]
        )}`
    )

    const photoDimensions = props.photos.map((photo) => dimensions?.get(photo))
    if (photoDimensions.findIndex((dim) => !dim) >= 0) {
        return (
            <div className="photoset" ref={ref}>
                {props.photos.map((photo, i) => {
                    return <Img photo={photo} />
                })}
            </div>
        )
    }
    console.log(
        dimensions,
        photoDimensions,
        photoDimensions.findIndex((dim) => !dim)
    )
    const widths = photoDimensions.map((dim) => dim[0])
    const heights = photoDimensions.map((dim) => dim[1])
    const max_h = Math.max(...heights)
    const scales = heights.map((height) => max_h / height)
    const scaled_widths = widths.map((width, i) => width * scales[i])
    const page_width = width
    const overall_scale =
        (page_width - (heights.length - 1) * 12) /
        scaled_widths.reduce((sum, width) => sum + width, 0)
    const final_scaled_heights = heights.map((height, i) =>
        Math.floor(height * scales[i] * overall_scale)
    )
    const final_scaled_widths = widths.map(
        (width, i) => Math.floor(width * scales[i] * overall_scale) - 1
    )
    return (
        <div className="photoset" ref={ref}>
            {props.photos.map((photo, i) => {
                return (
                    <Img
                        photo={photo}
                        width={final_scaled_widths[i]}
                        height={final_scaled_heights[i]}
                    />
                )
            })}
        </div>
    )
}

const berlin_photos = [
    [
        '/img/berlin/walk-1.jpg',
        '/img/berlin/walk-2.jpg',
        '/img/berlin/walk-3.jpg',
    ],
    ['/img/berlin/walk-4.jpg', '/img/berlin/walk-5.jpg'],
    ['/img/berlin/hol-1.jpg'],

    ['/img/berlin/hol-2.jpg', '/img/berlin/hol-3.jpg', '/img/berlin/hol-4.jpg'],

    [
        '/img/berlin/jewish-1.jpg',
        '/img/berlin/jewish-2.jpg',
        '/img/berlin/jewish-3.jpg',
    ],
    ['/img/berlin/syn-1.jpg', '/img/berlin/syn-2.jpg'],

    ['/img/berlin/ham-1.jpg'],

    ['/img/berlin/ham-0.jpg', '/img/berlin/ham-2.jpg', '/img/berlin/ham-3.jpg'],
    ['/img/berlin/ham-4.jpg', '/img/berlin/ham-5.jpg', '/img/berlin/ham-6.jpg'],

    [
        '/img/berlin/doner-1.jpg',
        '/img/berlin/doner-2.jpg',
        '/img/berlin/doner-3.jpg',
    ],
    /* grid-2 ?? */
    ['/img/berlin/brian.jpg', '/img/berlin/danny.jpg'],
    ['/img/berlin/group.jpg'],
]

export const Photoset = () => {
    return (
        <PhotoEssay header="/img/berlin/cover.jpg">
            {berlin_photos.map((row) => (
                <PhotoRow photos={row} />
            ))}
        </PhotoEssay>
    )
}
