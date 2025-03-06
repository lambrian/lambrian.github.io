import './Status.css'
import {
    Dispatch,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

const getChartIndicator = (page: Status, statusKey: StatusKey) => {
    if (statusKey === 'location') {
        if (page.location === 'San Francisco') {
            return 'status-ok'
        } else if (page.location === 'Needs Information') {
            return 'status-missing'
        } else {
            return 'status-info'
        }
    } else if (statusKey === 'drinks') {
        if (page.drinks === null) {
            return 'status-missing'
        } else if (page.drinks === 0) {
            return 'status-ok'
        } else if (page.drinks <= 3) {
            return 'status-warning'
        } else {
            return 'status-major'
        }
    } else if (statusKey === 'gym') {
        if (page.gym) {
            return 'status-ok'
        }
    }

    return 'status-missing'
}

const getChartRel = (index: number, total: number) => {
    const quarter = Math.floor(Math.abs(index - total) / 30)
    return `rel-${quarter}`
}

type StatusKey = 'location' | 'drinks' | 'gym'

interface Status {
    date: string
    location: string
    drinks: number
    gym: boolean
    rel: string
}

const countTravelDays = (statuses: Array<Status>): string => {
    return `${
        statuses.filter((status) => status.location !== 'San Francisco').length
    } / ${statuses.length}`
}

const countTotalDrinks = (statuses: Array<Status>): string => {
    const totalDrinks = statuses.reduce((sum: number, status: Status) => {
        return sum + status.drinks
    }, 0)
    return `${totalDrinks} total number of drinks`
}

const statusKeyTitle = (statusKey: StatusKey): string => {
    switch (statusKey) {
        case 'location':
            return 'Location'
        case 'drinks':
            return 'Drinks'
        case 'gym':
            return 'Gym'
        default:
            return 'Status'
    }
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
    statusKey,
}: {
    index: number
    page: Status
    setTooltipVisible: Dispatch<SetStateAction<boolean>>
    setTooltipLocation: (newLocation: TooltipLocation) => void
    setCurrentStatusIndex: Dispatch<SetStateAction<number>>
    statusKey: StatusKey
}) => {
    const ref = useRef<HTMLDivElement>(null)

    const handleMouseEnter = () => {
        if (ref.current) {
            setTooltipVisible(true)
            const { top, left } = ref.current.getBoundingClientRect()
            setTooltipLocation({ top, left })
            setCurrentStatusIndex(index)
        }
    }
    return (
        <div
            ref={ref}
            className={`chart-indicator ${getChartIndicator(page, statusKey)} ${page.rel}`}
            onMouseEnter={handleMouseEnter}
            aria-describedby="tooltip"
            style={{ position: 'relative' }}
        ></div>
    )
}

const Chart = (props: { statuses: Array<Status>; statusKey: StatusKey }) => {
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

    console.log(104, props.statusKey)
    return (
        <div className="chart" onMouseLeave={() => setTooltipVisible(false)}>
            {props.statuses.map((page, i) => (
                <ChartIndicator
                    index={i}
                    page={page}
                    statusKey={props.statusKey}
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
                        {props.statuses[currentStatusIndex].date}
                    </div>
                    <div className="tooltip-summary">
                        {props.statuses[currentStatusIndex][props.statusKey]}
                    </div>
                </div>
            )}
        </div>
    )
}

const ChartMetrics = (props: {
    statuses: Array<Status>
    statusKey: StatusKey
}) => {
    if (props.statusKey === 'location') {
        return (
            <div className="chart-metrics">
                <div className="left-data">{props.statuses[0].date}</div>
                <div className="spacer"></div>
                <div className="center-data">{`${countTravelDays(props.statuses)} days out of San Francisco`}</div>
                <div className="spacer"></div>
                <div className="right-data">
                    {props.statuses[props.statuses.length - 1].date}
                </div>
            </div>
        )
    } else if (props.statusKey === 'drinks') {
        return (
            <div className="chart-metrics">
                <div className="left-data">{props.statuses[0].date}</div>
                <div className="spacer"></div>
                <div className="center-data">
                    {countTotalDrinks(props.statuses)}
                </div>
                <div className="spacer"></div>
                <div className="right-data">
                    {props.statuses[props.statuses.length - 1].date}
                </div>
            </div>
        )
    }

    return null
}
const LocationChart2 = (props: {
    statuses: Array<Status>
    statusKey: StatusKey
}) => {
    return (
        <div className="chart-section">
            <div className="chart-title">{statusKeyTitle(props.statusKey)}</div>
            <Chart statuses={props.statuses} statusKey={props.statusKey} />
            <ChartMetrics {...props} />
        </div>
    )
}

const LocationChart = (props: { statuses: Array<Status> }) => {
    if (!props.statuses.length) {
        return <></>
    }
    return (
        <div className="section">
            <LocationChart2 statuses={props.statuses} statusKey="location" />
            <LocationChart2 statuses={props.statuses} statusKey="drinks" />
            <LocationChart2 statuses={props.statuses} statusKey="gym" />
        </div>
    )
}

export const StatusPage = () => {
    const [data, setData] = useState<Array<Status>>([])
    const displayedStatuses = useMemo(() => {
        return data.map((page, i) => ({
            date: page.date,
            location: page.location,
            drinks: page.drinks,
            gym: page.gym,
            rel: getChartRel(i, data.length),
        }))
    }, [data])

    useEffect(() => {
        fetch('/notion-data.json')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Not Found')
                }
                return response.json()
            })
            .then((json) => setData(json))
            .catch((err) => console.error(err))
    }, [])

    return (
        <div className="page-wrapper">
            <div className="page">
                <div className="page-title">Status History</div>
                <LocationChart statuses={displayedStatuses} />
            </div>
        </div>
    )
}
