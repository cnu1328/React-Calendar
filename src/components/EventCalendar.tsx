// importing all the required libraries
import { 
    Box, 
    Container,
    Card, 
    CardHeader, 
    Divider,
    CardContent,
    Button,
} from "@mui/material"; //Material UI Components

import { 
  format, 
  getDay, 
  parse, 
  startOfWeek 
} from "date-fns";  // For date manipulations

import enUS from "date-fns/locale/en-US";
import { 
  Calendar, 
  type Event, 
  dateFnsLocalizer 
} from "react-big-calendar"; //It is for main calendar functionalities

import "react-big-calendar/lib/css/react-big-calendar.css"; // react-big-calendar stylings

import "../../public/css/CustomHeader.css"; // Custom stylings for react-big-calendar
import { nanoid } from 'nanoid'; //To generate Unique ID(for each event in the calendar and each Todo Coloring)

import { useState, MouseEvent } from "react"; //React Hooks

import { EventInfo } from "./EventInfo"; // This component is used for displaying the discription of event in the calendar
import { AddEventModal } from "./AddEventModal"; // This component is used for Adding Events, When user selects the time slot(by dragging or just one click)
import CustomHeader from "./CustomHeader"; // This component is used for inserting, Plus Icon in the calendar Header
import AddDatePickerEventModal from "./AddDatePickerEventModal"; //Whenever user clicks on plusIcon, this model opens, used for Adding events with specific dates and time
import EventInfoModal from "./EventInfoModal"; // This component is used for displying the existing event in the calendar
import { AddTodoModal } from "./AddTodoModal"; // This component is used for Adding Todo Colorings(Because, For specific events, same color is used. With the help of color picker, we may not get exact colors)

// initializing the date-fns localizer to handle date formatting.

const locales = {
    "en-US": enUS
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});


// Defining Data Models

export interface ITodo { // For Todo Colorings
  _id: string
  title: string
  color?: string
}


export interface IEventInfo extends Event { // Event Information
  _id: string
  description: string
  todoId?: string
  color?: string
}

export interface EventFormData { // When user selects time slot, then this data is used to add event
  description: string
  todoId?: string
  color?: string
}


export interface DatePickerEventFormData { // When user clicks on plusIcon, then this data is used to add event
    description: string
    todoId?: string
    color?: string
    allDay: boolean
    start?: Date
    end?: Date
}


// Initialize the From Data

const initialEventFormState: EventFormData = {
    description: "",
    todoId: undefined,
    color: "#b64fc8",
}

const initialDatePickerEventFormData: DatePickerEventFormData = {
    description: "",
    todoId: undefined,
    color: "#b64fc8",
    allDay: false, // It is to ensure the event for entire day
    start: undefined,
    end: undefined,
}


const EventCalendar = () => {
    // declaring states

    const [openSlot, setOpenSlot] = useState(false); // This state is used to open popup, when user selects the timeslot
    const [openDatepickerModal, setOpenDatepickerModal] = useState(false); // It is to open popup, when user clicks on plusIcon Button
    const [openTodoModal, setOpenTodoModal] = useState(false); // It is to open popup, When user clicks on AddTodo(to add Todo colorings)
    const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(null); // This state is used to point the Current Event
    
    const [eventInfoModal, setEventInfoModal] = useState(false); // It is to open popup, when user clicks on existing event

    const [events, setEvents] = useState<IEventInfo[]>([]); //This state to store all events
    const [todos, setTodos] = useState<ITodo[]>([]); // This state to store all Todo Colors

    const [eventFormData, setEventFormData] = useState<EventFormData>(initialEventFormState); // Event Form Data(When user selects time Slot)
    
    const [datePickerEventFormData, setDatePickerEventFormData] = useState<DatePickerEventFormData>(initialDatePickerEventFormData);  // Event form Data(When user Clicks on plusIcon)


    // Function handles

    const handleSelectSlot = (event: Event) => { // This function is to handle to open popup(when user selects time slot)
        setOpenSlot(true);
        setCurrentEvent(event);
    }

    const handleSelectEvent = (event: IEventInfo) => { // This function is to handle to open popup(When user clicks on existing event)
        setCurrentEvent(event);
        setEventInfoModal(true);
    }


    const handleClose = () => { // This function is used to close the popup of Selected time slot popup
        setEventFormData(initialEventFormState);
        setOpenSlot(false);
    }

    const handleDatePickerClose = () => { // It is used to close the popup of plusIcon popup
        setDatePickerEventFormData(initialDatePickerEventFormData);
        setOpenDatepickerModal(false);
    }
    

    const onAddEvent = (e: MouseEvent<HTMLButtonElement>) => { // It is used to add events(When user select time slots)
        e.preventDefault();

        const data: IEventInfo = {
            ...eventFormData,
            _id: nanoid(),
            start: currentEvent?.start,
            end: currentEvent?.end,
        }

        const newEvents = [...events, data];

        setEvents(newEvents);
        handleClose();
    }

    const onAddEventFormDatePicker = (e : MouseEvent<HTMLButtonElement>) => { //It is used to add events(When user Clicks plusIcon)
        e.preventDefault();

        const addHours = (date: Date | undefined, hours: number): Date | undefined => { // It is used to add a specified number of hours to a given date.
            if (!date) return undefined;
            const newDate = new Date(date);
            newDate.setHours(newDate.getHours() + hours);
            return newDate;
        };

        const setMinToZero = (date: Date | undefined | null) => { //It is used to set the seconds of a given date to zero.
          if (date instanceof Date && !isNaN(date.getTime())) {
              date.setSeconds(0);
              return date;
          } else {
              return new Date();
          }
        };

        const data: IEventInfo = {
            ...datePickerEventFormData,
            _id: nanoid(),
            start: setMinToZero(datePickerEventFormData.start),
            end: datePickerEventFormData.allDay 
                ? addHours(datePickerEventFormData.start, 12)
                : setMinToZero(datePickerEventFormData.end),
        }

        const newEvents = [...events, data];

        setEvents(newEvents);
        handleDatePickerClose();
    } 

    const onDeleteEvent = () => { // It is used to delete the existing event
        setEvents(() => [...events].filter((e) => e._id !== (currentEvent as IEventInfo)._id!))
        setEventInfoModal(false);
    }


    return(
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                py: 2,
            }}
        >

            <Container maxWidth={false}>
                <Card>  
                    <CardHeader title="Calendar" subheader="" />
                    <Divider />

                    <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                          <Button onClick={() => setOpenTodoModal(true)} size="small" variant="contained" >
                              Create todo
                          </Button>  
                        </Box>

                        <Divider style={{ margin: 10}} />
                        
                        {/* Modals */}

                        <AddEventModal 
                            open={openSlot}
                            handleClose={handleClose}
                            eventFormData={eventFormData}
                            setEventFormData={setEventFormData}
                            onAddEvent={onAddEvent}
                            todos={todos}
                        />

                        <AddDatePickerEventModal 
                          open={openDatepickerModal}
                          handleClose={handleDatePickerClose}
                          datePickerEventFormData={datePickerEventFormData}
                          setDatePickerEventFormData={setDatePickerEventFormData}
                          onAddEvent={onAddEventFormDatePicker}
                          todos={todos}
                        />


                        <EventInfoModal 
                          open={eventInfoModal}
                          handleClose={() => setEventInfoModal(false)}
                          onDeleteEvent={onDeleteEvent}
                          currentEvent={currentEvent as IEventInfo}
                        />

                        <AddTodoModal 
                          open={openTodoModal}
                          handleClose={() => setOpenTodoModal(false)}
                          todos={todos}
                          setTodos={setTodos}
                        />
                        

                        <Calendar 
                          localizer={localizer}
                          events={events}
                          onSelectEvent={handleSelectEvent}
                          onSelectSlot={handleSelectSlot}
                          selectable
                          startAccessor="start"
                          endAccessor={"end"}
                          defaultView="week"
                          views={['week']}
                          style={{
                              height: 900,
                          }}
                          
                          min={new Date(2024, 0, 1, 9, 0, 0)} // Start time (9am)
                          max={new Date(2024, 0, 1, 18, 0, 0)} // End time (6pm)

                          components={{
                              week: {
                                header: (props) => (
                                  <CustomHeader {...props} setOpenDatepickerModal={setOpenDatepickerModal} />
                                ),
                              },
                              event: EventInfo,
                          }}

                          eventPropGetter={(event) => { // It is used to hightlight the events
                              const hasTodo = todos.find((todo) => todo._id === event.todoId);
                              const hasColor = events.find((e) => e._id === event._id)

                              return {
                                  style: {
                                      backgroundColor: hasTodo ? hasTodo.color: hasColor ? hasColor.color : "#b64fc8",
                                      borderColor: hasTodo ? hasTodo.color: hasColor ? hasColor.color : "#b64fc8",
                                  }
                              }
                          }}
                        />  
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default EventCalendar;