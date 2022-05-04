import React from "react";
import "./questions.css";
import QuestionWidget from "./questionwidget";


export default function Questions({ questions }) {

  return (
    <div className="questions-box">
      <div className="scroller-outer ">
        <div className="scroller-inner" >
          {
            questions && questions.map((question) => {
              return <QuestionWidget key={question["id"]} question={question}></QuestionWidget>
            })
          }
        </div>
      </div>
    </div>
  );
}

