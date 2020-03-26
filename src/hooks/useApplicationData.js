import { useState, useEffect } from "react";
import axios from "axios";

const useApplicationData = () => {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const setDay = day => {
    setState(prev => ({ ...prev, day }));
  };

  function bookInterview(id, interview) {
    const selectDayName = state.day;

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then((response) => {
        const selectDayIndex = state.days.findIndex((day) => {
          if (selectDayName === day.name) {
            return true;
          } else {
            return false;
          }
        });


        const selectDay = state.days[selectDayIndex];
        const updateDay = {
          ...selectDay,
          spots: selectDay.spots - 1

        };

        const updatedDayList = [...state.days];
        updatedDayList[selectDayIndex] = updateDay;

        setState({ ...state, appointments, days: updatedDayList });
        return response;

      })

  }

  function cancelInterview(id) {
    const selectDayName = state.day;
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then((response) => {

        const selectDayIndex = state.days.findIndex((day) => {
          if (selectDayName === day.name) {
            return true;
          } else {
            return false;
          }
        });


        const selectDay = state.days[selectDayIndex];
        const updateDay = {
          ...selectDay,
          spots: selectDay.spots + 1

        };

        const updatedDayList = [...state.days];
        updatedDayList[selectDayIndex] = updateDay;

        setState({ ...state, appointments, days: updatedDayList });
        return response;

      })
  }

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

  return { setDay, bookInterview, cancelInterview, state };
}


export default useApplicationData;
