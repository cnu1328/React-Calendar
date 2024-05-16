import { SetStateAction, MouseEvent, Dispatch } from "react"
import { 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    Button, 
    Box, 
    Typography 
} from "@mui/material";
import { IEventInfo } from "./EventCalendar";

interface IProps {
    open: boolean
    handleClose: Dispatch<SetStateAction<void>>
    onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
    currentEvent: IEventInfo | null
}

const EventInfoModal = ({
    open, 
    handleClose,
    onDeleteEvent,
    currentEvent
}: IProps) => {

    const onClose = () => {
        handleClose();
    }

    return(
        <Dialog open={open} onClose={onClose}>
            <DialogTitle sx={{ fontSize: 18}}>Event Info</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography sx={{ fontSize: 22, marginTop: 2, marginBottom: 2}} color="text.secondary" gutterBottom>
                        {currentEvent?.description}
                    </Typography>
                    <Box component={"form"}></Box>
                </DialogContentText>

                <DialogActions>
                    <Button color="error" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button color="info" onClick={onDeleteEvent}>
                        Delete Event
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}

export default EventInfoModal;


