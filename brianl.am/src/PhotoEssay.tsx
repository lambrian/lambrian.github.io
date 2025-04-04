import React, {
    useState,
    useMemo,
    SetStateAction,
    Dispatch,
    useCallback,
    useEffect,
} from 'react'
import { useDimensions } from './useDimensions'
import { useParams } from 'react-router-dom'
import { PHOTO_ESSAYS } from './photo_essays'
import { useInView } from 'react-intersection-observer'

export type EssayConfig = {
    link: string
    header: string
    title: string
    subtitle: string
    photos: Array<Array<string>>
}

export const PhotoEssay = () => {
    const { name } = useParams()
    const [lightboxFile, setLightboxFile] = useState('')
    const [isTransitioningLightbox, setIsTransitioningLightbox] =
        useState(false)

    const essay = PHOTO_ESSAYS.find((essay) => essay.link === name)
    useEffect(() => {
        const handleKeyup = (event: KeyboardEvent) => {
            if (!isLightboxOpen) {
                return
            }

            switch (event.key) {
                case 'ArrowRight':
                    findNextImg(1)
                    return
                case 'ArrowLeft':
                    findNextImg(-1)
                    return
                case 'Escape':
                    setLightboxFile('')
                    return
                default:
                    console.log(event.key)
            }
        }

        window.addEventListener('keyup', handleKeyup)

        return () => {
            window.removeEventListener('keyup', handleKeyup)
        }
    })
    const allPhotos = useMemo(() => {
        if (!essay) return []
        return essay.photos.reduce((acc: Array<string>, row: Array<string>) =>
            acc.concat(row)
        )
    }, [essay])
    const findNextImg = useCallback(
        (increment: number) => {
            console.log(lightboxFile)
            const currIndex = allPhotos.findIndex(
                (photo) => photo === lightboxFile
            )
            const nextIndex = (currIndex + increment) % allPhotos.length
            setIsTransitioningLightbox(true)
            setTimeout(() => {
                setIsTransitioningLightbox(false)
                setLightboxFile(allPhotos[nextIndex])
            }, 500)
        },
        [lightboxFile, setLightboxFile, allPhotos]
    )
    const isLightboxOpen = useMemo(() => !!lightboxFile, [lightboxFile])
    if (!name) {
        return <></>
    }
    if (!essay) {
        return <></>
    }
    return (
        <div onKeyUp={(event) => console.log(event.key)}>
            <div className={`lightbox ${isLightboxOpen ? 'open' : ''}`}>
                <div
                    className="background"
                    onClick={() => setLightboxFile('')}
                ></div>
                <img
                    className={`${!isTransitioningLightbox ? 'opened' : ''}`}
                    src={lightboxFile}
                    alt={lightboxFile}
                    onClick={() => findNextImg(1)}
                />
            </div>
            <div className="cover-container">
                <img className="cover" src={essay.header} alt={essay.header} />
                <div className="essay-title-container">
                    <p className="essay-title">{essay.title}</p>
                    <p className="essay-subtitle">{essay.subtitle}</p>
                </div>
            </div>
            <div className="photo-essay-wrapper">
                {essay.photos.map((row: string[], i: number) => (
                    <PhotoRow
                        photos={row}
                        key={i}
                        setLightboxFile={setLightboxFile}
                    />
                ))}
            </div>
        </div>
    )
}

interface ScaledPhotoDimensions {
    final_scaled_widths: number[]
    final_scaled_heights: number[]
}

const calculatePhotoDimensions = (
    photos: string[],
    photoDimensionsMap: Map<any, any> | undefined,
    width: number
): ScaledPhotoDimensions | undefined => {
    const photoDimensions = photos.map((photo) =>
        photoDimensionsMap?.get(photo)
    )
    if (!width || photoDimensions.includes(undefined)) {
        return undefined
    }

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
    return { final_scaled_widths, final_scaled_heights }
}

const PhotoRow = (props: {
    photos: string[]
    setLightboxFile: Dispatch<SetStateAction<string>>
}) => {
    const [intersectionRef, inView] = useInView({ triggerOnce: true })
    const [ref, setRef] = useState(null)
    const { width } = useDimensions(ref)
    const [dimensions, setDimensions] = useState(new Map())
    const scaledDimensions = useMemo(
        () => calculatePhotoDimensions(props.photos, dimensions, width),
        [props, dimensions, width]
    )

    const handleRef = (node: any) => {
        setRef(node)
        intersectionRef(node)
    }

    return (
        <div
            className={`photoset ${!scaledDimensions && 'loading'} ${!inView && 'hidden'}`}
            ref={handleRef}
        >
            {props.photos.map((photo: string, i: number) => {
                return (
                    <Img
                        key={i}
                        photo={photo}
                        width={scaledDimensions?.final_scaled_widths[i]}
                        height={scaledDimensions?.final_scaled_heights[i]}
                        dimensions={dimensions}
                        setDimensions={setDimensions}
                        onClick={props.setLightboxFile}
                    />
                )
            })}
        </div>
    )
}

interface ImgProps {
    photo: string
    width?: number
    height?: number
    dimensions: Map<any, any> | null
    setDimensions: React.Dispatch<React.SetStateAction<Map<any, any>>>
    onClick: Dispatch<SetStateAction<string>>
}

const Img = (props: ImgProps) => {
    const { dimensions, setDimensions } = props
    const onload = (e: any) => {
        if (e.target instanceof HTMLImageElement) {
            dimensions &&
                setDimensions(
                    new Map(
                        dimensions.set(props.photo, [
                            e.target?.naturalWidth,
                            e.target?.naturalHeight,
                        ])
                    )
                )
        }
    }

    return (
        <img
            style={{
                width: props.width,
                height: props.height,
            }}
            className="photo"
            loading="lazy"
            src={props.photo}
            alt={props.photo}
            onLoad={onload}
            onClick={() => props.onClick(props.photo)}
        />
    )
}
