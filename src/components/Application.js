import React, { useState, useEffect } from "react";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment/index";
import axios from "axios";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";


export default function Application(props) {
  const setDay = days => setState(prev => ({ ...prev, days }));
  const [state, setState] = useState({
    day: "Thursday",
    days: [],
    appointments: {}
  });
  
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days"),
      axios.get("http://localhost:8001/api/appointments"),
      axios.get("http://localhost:8001/api/interviewers")
    ]).then(all => {
      setState(state => ({
        ...state,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }));
    });
  }, []);

  function bookInterview(id, interview) {
    console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

     const appointments = {
       ...state.appointments,
       [id]: appointment
     };

     axios
     .put(`http://localhost:8001/api/appointments/${id}`, appointment)
     .then(setState({...state, appointments}))
     .catch(err => console.error(err));    
}

function cancelInterview (id) {
  console.log(id);
  const appointment = {
    ...state.appointments[id],
  };

   const appointments = {
     ...state.appointments,
     [id]: appointment
   };

   axios
   .delete(`http://localhost:8001/api/appointments/${id}`, appointment)
   .then(setState({...state, appointments}))
   .catch(err => console.error(err));    
}
  
  const interviewers = getInterviewersForDay(state, state.day);
  const appointments = getAppointmentsForDay(state, state.day);
  
  const schedule = appointments.map(appointment => {
  const interview = getInterview(state, appointment.interview);
  return (
  
  <Appointment
  key={appointment.id}
  id={appointment.id}
  time={appointment.time}
  interview={interview}
  interviewers={interviewers}
  bookInterview={bookInterview}
  cancelInterview={cancelInterview}
  />
);
});

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day= {state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">{schedule} <Appointment key="last" time="5pm"/></section>
    </main>
  );
}