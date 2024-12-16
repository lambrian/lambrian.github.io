import React, { useState, useRef, useMemo } from 'react'
import { useDimensions } from './useDimensions'
import { useParams } from 'react-router-dom'
import { PHOTO_ESSAYS } from './photo_essays'

export const PhotoEssay = () => {
    const { name } = useParams()
    if (!name || !Object.keys(PHOTO_ESSAYS).includes(name)) {
        return <></>
    }

    const essay = PHOTO_ESSAYS[name]
    return (
        <>
            <div className="cover-container">
                <img className="cover" src={essay.header} alt={essay.header} />
            </div>
            <div className="photo-essay-wrapper">
                <p className="essay-title">{essay.title}</p>
                <p className="essay-subtitle">{essay.subtitle}</p>
                {essay.photos.map((row: string[], i: number) => (
                    <PhotoRow photos={row} key={i} />
                ))}
            </div>
        </>
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

const PhotoRow = (props: { photos: string[] }) => {
    const ref = useRef(null)
    const [dimensions2, setDimensions2] = useState(new Map())
    const { width } = useDimensions(ref)
    const scaledDimensions = useMemo(
        () => calculatePhotoDimensions(props.photos, dimensions2, width),
        [props, dimensions2, width]
    )

    return (
        <div className="photoset" ref={ref}>
            {props.photos.map((photo: string, i: number) => {
                return (
                    <Img
                        key={i}
                        photo={photo}
                        width={scaledDimensions?.final_scaled_widths[i]}
                        height={scaledDimensions?.final_scaled_heights[i]}
                        dimensions={dimensions2}
                        setDimensions={setDimensions2}
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
        />
    )
}
