import { FC, useEffect, useState } from 'react';

const date = new Date(2023, 1, 6);

const Countdown: FC = () => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (date === null) return;

        const timeLeft = Math.max(calculateTimeLeft(date), 0);
        console.log("timeleft is " + timeLeft);
        setValue(timeLeft);
        if (!timeLeft) return;

        const interval = setInterval(() => {
            const timeLeft = calculateTimeLeft(date);
            if (timeLeft <= 0) {
                setValue(0);
                clearInterval(interval);
            } else {
                setValue(timeLeft);
            }
        }, 1000);

        return () => clearInterval(interval);

    }, []);

    return (
        <>
            {formatTime(value)}
        </>
    )
}

export default Countdown;

const calculateTimeLeft = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    console.log(`diff is ${diff} between ${now} and ${date}`);
    return diff;
};

const pad = (unit: number) => unit.toString().padStart(2, "0");

export const formatTime = (time?: number) => {
    if (time === undefined) {
        return;
    }

    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};