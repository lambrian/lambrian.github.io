import './clock.css'

import { DateTime } from 'luxon'
import { useCallback, useEffect, useState } from 'react'

const CONFIG: DIGIT_CONFIG = {
    0: [
        [6, 3],
        [6, 9],
        [12, 6],
        [12, 6],
        [12, 3],
        [9, 12],
    ],
    10: [
        [9, 9],
        [6, 6],
        [9, 9],
        [12, 6],
        [9, 9],
        [12, 12],
    ],
    1: [
        [6, 6],
        [3, 3],
        [12, 6],
        [3, 3],
        [12, 12],
        [3, 3],
    ],
    2: [
        [3, 3],
        [6, 9],
        [3, 6],
        [12, 9],
        [12, 3],
        [9, 9],
    ],
    3: [
        [3, 3],
        [6, 9],
        [3, 3],
        [9, 12],
        [3, 3],
        [9, 12],
    ],
    4: [
        [6, 6],
        [6, 6],
        [12, 3],
        [12, 6],
        [9, 9],
        [12, 12],
    ],
    5: [
        [3, 6],
        [9, 9],
        [12, 3],
        [6, 9],
        [3, 3],
        [9, 12],
    ],
    6: [
        [3, 6],
        [9, 9],
        [12, 6],
        [6, 9],
        [12, 3],
        [9, 12],
    ],
    7: [
        [3, 3],
        [6, 9],
        [9, 9],
        [12, 6],
        [9, 9],
        [12, 12],
    ],
    8: [
        [3, 6],
        [6, 9],
        [12, 3],
        [9, 12],
        [12, 3],
        [9, 12],
    ],
    9: [
        [3, 6],
        [6, 9],
        [12, 3],
        [12, 6],
        [3, 3],
        [9, 12],
    ],
}

type DIGIT_CONFIG = { [key: number]: number[][] }

export const ClockClock = () => {
    const [digits, setDigits] = useState([0, 0, 0, 0])
    const setTime = useCallback(() => {
        const today = DateTime.local()
            .setZone('America/Los_Angeles')
            .toFormat('HHmm')
        const digits = today.split('').map((c) => parseInt(c))
        setDigits(digits)
    }, [setDigits])
    useEffect(() => {
        const currSec = parseInt(
            DateTime.local().setZone('America/Los_Angeles').toFormat('s')
        )
        const currMs = parseInt(
            DateTime.local().setZone('America/Los_Angeles').toFormat('S')
        )
        const timeoutId = setTimeout(setTime, 1000)
        const intervalId = setTimeout(
            () => {
                setInterval(setTime, 60000)
            },
            Math.abs(60000 - currSec * 1000 - currMs)
        )

        return () => {
            clearTimeout(timeoutId)
            clearInterval(intervalId)
        }
    }, [setTime])
    return (
        <div className="wrapper">
            <div className="display-clock">
                <ClockNumber digit={digits[0] === 1 ? 10 : digits[0]} />
                <ClockNumber digit={digits[1]} />
                <ClockNumber digit={digits[2]} />
                <ClockNumber digit={digits[3]} />
            </div>
        </div>
    )
}

const ClockNumber = ({ digit }: { digit: number }) => {
    if (!(digit in CONFIG)) {
        return <></>
    }

    const positions = CONFIG[digit]
    return (
        <div className="clock-number">
            {positions.map((position) => (
                <Clock hour={position[0]} minute={position[1]} />
            ))}
        </div>
    )
}
const Clock = ({ hour, minute }: { hour: number; minute: number }) => {
    return (
        <div className="clock">
            <div className={`hour position-${hour}`}></div>
            <div className={`hour position-${minute}`}></div>
        </div>
    )
}
