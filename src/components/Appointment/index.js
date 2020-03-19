import React from "react";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";

export default function Appointment(props) {
  return (
    <article className="appointment">
      <Header time={props.appointment.time} />
      {props.appointment.interview && (
        <Show
          student={props.appointment.interview.student}
          interviewer={props.appointment.interview.interviewer}
        />
      )}
      {!props.interview && <Empty />}
    </article>
  );
}