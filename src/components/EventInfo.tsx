import { IEventInfo } from "./EventCalendar";
import { Typography } from "@mui/material";

interface IProps {
    event: IEventInfo
}

export const EventInfo = ({event}: IProps) => {
    return (
    
        <>
            <Typography>{event.description}</Typography>
        </>
    );
}