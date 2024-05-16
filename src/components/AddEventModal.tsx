import { Dispatch, SetStateAction, ChangeEvent, MouseEvent } from "react";
import { EventFormData, ITodo, IEventInfo } from "./EventCalendar";
import { 
    Autocomplete, 
    Box, 
    Dialog, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    TextField,
    DialogActions,
    Button
} from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

type CurrentEventType = Event | IEventInfo | null;
interface IProps {
    open: boolean;
    handleClose: Dispatch<SetStateAction<void>>;
    eventFormData: EventFormData;
    setEventFormData: Dispatch<SetStateAction<EventFormData>>;
    onAddEvent: (e: MouseEvent<HTMLButtonElement>) => void;
    currentEvent: CurrentEventType;
    todos: ITodo[];
}

export const AddEventModal = ({
    open, 
    handleClose, 
    eventFormData, 
    setEventFormData, 
    onAddEvent, 
    currentEvent,
    todos
}: IProps) => {

    const { description, color, start } = eventFormData;

    const onClose = () => handleClose();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEventFormData((prevState) => ({
            ...prevState, [event.target.name]: event.target.value,
        }));
    }

    const handleTodoChange = (_: React.SyntheticEvent, value: ITodo | null) => {
        setEventFormData((prevState) => ({
            ...prevState,
            todoId: value?._id,
        }));
    }

    const handleColorChange = (color: string) => {
        setEventFormData((prevState) => ({
            ...prevState,
            color: color,
        }));
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Event</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To add an event, please fill in the information below. 
                </DialogContentText>

                <Box component="form">
                    <TextField 
                        name="description"
                        value={description}
                        margin="dense"
                        id="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="outlined"
                        onChange={onChange}
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box mb={2} mt={5}>
                            <DateTimePicker
                                label="Start date"
                                value={currentEvent?.start}
                                ampm={true}
                                minutesStep={30}
                                onChange={(newValue) =>
                                    setEventFormData((prevState) => ({
                                        ...prevState,
                                        start: new Date(newValue!),
                                    }))
                                }
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Box>

                        <Box mb={2}>
                            <DateTimePicker
                                label="End date"
                                minDate={start}
                                minutesStep={30}
                                ampm={true}
                                value={currentEvent?.end}
                                onChange={(newValue) =>
                                    setEventFormData((prevState) => ({
                                        ...prevState,
                                        end: new Date(newValue!),
                                    }))
                                }
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Box>
                    </LocalizationProvider>

                    <Box mt={3} sx={{ display: "flex", justifyContent: "space-around" }}>
                        <HexColorPicker color={color} onChange={handleColorChange} />
                        <Box sx={{ height: 80, width: 80, borderRadius: 1 }} className="value" style={{ backgroundColor: color }}></Box>
                    </Box>

                    <Autocomplete 
                        onChange={handleTodoChange}
                        disablePortal
                        id="combo-box-demo"
                        options={todos}
                        sx={{ marginTop: 4}}
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => <TextField {...params} label="Todo" />}
                    />

                    
                </Box>
            </DialogContent>

            <DialogActions>
                <Button color="error" onClick={onClose}>
                    Cancel
                </Button>

                <Button disabled={description === ""} color="success" onClick={onAddEvent}>
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
}
