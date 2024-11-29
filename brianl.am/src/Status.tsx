import './Status.css'
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useMemo,
    useRef,
    useState,
} from 'react'
import statuses from './notion-data.json'

const getChartIndicator = (location: string) => {
    if (location === 'San Francisco') {
        return 'status-ok'
    } else if (location === 'Needs Information') {
        return 'status-missing'
    } else {
        return 'status-info'
    }
}

const getChartRel = (index: number, total: number) => {
    const quarter = Math.floor(Math.abs(index - total) / 30)
    return `rel-${quarter}`
}

interface Status {
    date: string
    location: string
    rel: string
}

const countTravelDays = (statuses: Array<Status>): string => {
    return `${
        statuses.filter((status) => status.location !== 'San Francisco').length
    } / ${statuses.length}`
}

interface TooltipLocation {
    top: number
    left: number
}
export const ChartIndicator = ({
    index,
    page,
    setTooltipLocation,
    setTooltipVisible,
    setCurrentStatusIndex,
}: {
    index: number
    page: { location: string; date: string; rel: string }
    setTooltipVisible: Dispatch<SetStateAction<boolean>>
    setTooltipLocation: (newLocation: TooltipLocation) => void
    setCurrentStatusIndex: Dispatch<SetStateAction<number>>
}) => {
    const ref = useRef<HTMLDivElement>(null)

    const handleMouseEnter = () => {
        if (ref.current) {
            console.log('mouse enter')
            setTooltipVisible(true)
            const { top, left } = ref.current.getBoundingClientRect()
            setTooltipLocation({ top, left })
            setCurrentStatusIndex(index)
        }
    }
    return (
        <div
            ref={ref}
            className={`chart-indicator ${getChartIndicator(page.location)} ${page.rel}`}
            onMouseEnter={handleMouseEnter}
            aria-describedby="tooltip"
            style={{ position: 'relative' }}
        ></div>
    )
}

const Chart = (props: { statuses: Array<Status> }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false)
    const [toolTipLocation, setTooltipLocation] = useState<TooltipLocation>({
        top: 0,
        left: 0,
    })
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0)

    const setTooltipLocationImpl = useCallback(
        (newLocation: TooltipLocation) => {
            setTooltipLocation(newLocation)
        },
        [setTooltipLocation]
    )

    return (
        <div className="chart" onMouseLeave={() => setTooltipVisible(false)}>
            {props.statuses.map((page, i) => (
                <ChartIndicator
                    index={i}
                    page={page}
                    setTooltipLocation={setTooltipLocationImpl}
                    setTooltipVisible={setTooltipVisible}
                    setCurrentStatusIndex={setCurrentStatusIndex}
                />
            ))}
            {isTooltipVisible && (
                <div
                    className="chart-indicator-tooltip"
                    style={{
                        top: toolTipLocation.top,
                        left: toolTipLocation.left,
                    }}
                >
                    <div className="triangle-bg"></div>
                    <div className="triangle"></div>
                    <div className="tooltip-date">
                        {statuses[currentStatusIndex].date}
                    </div>
                    <div className="tooltip-summary">
                        {statuses[currentStatusIndex].location}
                    </div>
                </div>
            )}
        </div>
    )
}
const LocationChart = (props: { statuses: Array<Status> }) => {
    return (
        <div className="section">
            <div className="chart-section">
                <div className="chart-title">Location</div>
                <Chart statuses={props.statuses} />
                <div className="chart-metrics">
                    <div className="left-data">{props.statuses[0].date}</div>
                    <div className="spacer"></div>
                    <div className="center-data">{`${countTravelDays(props.statuses)} days out of San Francisco`}</div>
                    <div className="spacer"></div>
                    <div className="right-data">
                        {props.statuses[statuses.length - 1].date}
                    </div>
                </div>
            </div>
        </div>
    )
}

const IncidentList = (props: { statuses: Array<Status> }) => {
    const reversedStatuses: Array<Status> = useMemo(() => {
        const ret = structuredClone(props.statuses)
        ret.reverse()
        return ret
    }, [props])

    return (
        <div className="section">
            <div className="section-title">Previous Incidents</div>
            {reversedStatuses.map((status) => (
                <div className="summary-day-section">
                    <div className="summary-date">{status.date}</div>
                    <div className="summary-detail">{status.location}</div>
                </div>
            ))}
        </div>
    )
}
export const StatusPage = () => {
    const displayedStatuses = useMemo(() => {
        return statuses.map((page, i) => ({
            date: page.date,
            location: page.location,
            rel: getChartRel(i, statuses.length),
        }))
    }, [])

    return (
        <div className="page-wrapper">
            <div className="page">
                <div className="page-title">Status History</div>
                <LocationChart statuses={displayedStatuses} />
                <IncidentList statuses={displayedStatuses} />
            </div>
        </div>
    )
}
