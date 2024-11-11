import './Status.css'
import { useMemo } from 'react'
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
export const StatusPage = () => {
    const displayedStatuses = useMemo(() => {
        return statuses.results.map((page) => ({
            date: page.properties.Date.formula.string,
            location: page.properties.Location.select.name,
        }))
    }, [])

    return (
        <div className="page-wrapper">
            <div className="page">
                <div className="section">
                    <div className="section-title">Status History</div>
                    <div className="chart-section">
                        Location
                        <div className="chart">
                            {displayedStatuses.map((page) => (
                                <div
                                    className={`chart-indicator ${getChartIndicator(page.location)}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="section-title">Previous Incidents</div>
                    {displayedStatuses.map((page) => (
                        <div>
                            <div>Date {page.date}</div>
                            <div>Date {page.location}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
