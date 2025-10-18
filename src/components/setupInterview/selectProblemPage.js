import React, { useEffect, useState } from "react";
import "./selectProblems.css";
import { useForm } from "react-hook-form";
import { headers, API_BASE } from "../config";
const axios = require("axios");

const SelectProblemsPage = () => {
  const [questionList, setquestionList] = useState([]);
  const { register, handleSubmit } = useForm({});
  const url = API_BASE;
  const header = headers();
  const fetchquestions = async () => {
    try {
      if (header)
        await axios.get(url + "/question/get", header).then((res) => {
          var data = res.data;
          if (data) {
            console.log(data);
            data.data.forEach((problem) => {
              setquestionList((prev) => {
                return [...new Set([...prev, problem])];
              });
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchquestions();
  }, []);

  return (
    <div>
      <div className="create"></div>
      <br />
      <div className="childOne">
        <br />
        <br />
        <ul className="textFont">
          {questionList.map((val, key) => {
            const { question, questionOutput, questionLevel } = val;
            return (
              <div key={"dsfds"} className="childOne">
                <ul>
                  <h3>{question}</h3>
                  <li>{questionOutput}</li>
                  <li>{questionLevel}</li>
                </ul>
                {<button>Add</button>}

                <button>Delete</button>
              </div>
            );
          })}
        </ul>
      </div>
      <br />
      <br />
    </div>
  );
};

export default SelectProblemsPage;
