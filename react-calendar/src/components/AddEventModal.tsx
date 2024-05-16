
import { Dispatch, SetStateAction, ChangeEvent ,MouseEvent } from "react";
import { EventFormData, ITodo } from "./EventCalendar";
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

interface IProps {
    open: boolean
    handleClose: Dispatch<SetStateAction<void>>
    eventFormData: EventFormData
    setEventFormData: Dispatch<SetStateAction<EventFormData>>
    onAddEvent: (e : MouseEvent<HTMLButtonElement>) => void
    todos: ITodo[]
}

export const AddEventModal = ({open, handleClose, eventFormData, setEventFormData, onAddEvent, todos} : IProps) => {

    const { description, color } = eventFormData;

    const onClose = () => handleClose();

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEventFormData((prevState) => ({
            ...prevState, [event.target.name]: event.target.value,
        }))
    }

    const handleTodoChange = (_ : React.SyntheticEvent, value: ITodo | null) => {
        
        setEventFormData((prevState) => ({
            ...prevState,
            todoId: value?._id,
        }))
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
                    To add a event, please fill in the information below. 
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

