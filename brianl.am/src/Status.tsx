import './Status.css'
import { useMemo, useState } from 'react'
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

export const ChartIndicator = ({
    index,
    page,
}: {
    index: number
    page: { location: string; date: string; rel: string }
}) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false)
    return (
        <div
            className={`chart-indicator ${getChartIndicator(page.location)} ${page.rel}`}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            onFocus={() => setTooltipVisible(true)}
            onBlur={() => setTooltipVisible(false)}
            aria-describedby="tooltip"
            style={{ position: 'relative' }}
        >
            {isTooltipVisible && (
                <div className="chart-indicator-tooltip">
                    <div className="triangle-bg"></div>
                    <div className="triangle"></div>
                    <div className="tooltip-date">{page.date}</div>
                    <div className="tooltip-summary">{page.location}</div>
                </div>
            )}
        </div>
    )
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
                <div className="section">
                    <div className="chart-section">
                        <div className="chart-title">Location</div>
                        <div className="chart">
                            {displayedStatuses.map((page, i) => (
                                <ChartIndicator index={i} page={page} />
                            ))}
                        </div>
                        <div className="chart-metrics">
                            <div className="metric-rel-3">
                                {
                                    displayedStatuses.find(
                                        (day) => day.rel === 'rel-3'
                                    )?.date
                                }
                            </div>
                            <div className="spacer"></div>
                            <div>{`${countTravelDays(displayedStatuses)} days out of San Francisco`}</div>
                            <div className="spacer"></div>
                            <div>
                                {
                                    displayedStatuses[
                                        displayedStatuses.length - 1
                                    ].date
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="section-title">Previous Incidents</div>
                    {displayedStatuses.reverse().map((page) => (
                        <div className="summary-day-section">
                            <div className="summary-date">{page.date}</div>
                            <div className="summary-detail">
                                {page.location}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
