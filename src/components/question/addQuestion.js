import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { headers, API_BASE } from "../config";
import { useParams } from "react-router-dom";
import "./addQuestion.css";

export default function AddQuestion() {
  const header = headers();
  const url = API_BASE;
  const { register, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });
  // read interviewID from route params at component top-level (valid hook usage)
  const { id: interviewID } = useParams();

  const onSubmit = async (data) => {
    if (header !== undefined) {
      const payload = { ...data };
      if (interviewID) payload.interviewID = interviewID;

      axios
        .post(`${url}/question/create`, payload, header)
        .then((res) => {
          // debug: question created (silenced)
        })
        .catch((err) =>
          console.error(
            "AddQuestion error",
            err?.response?.data || err.message || err
          )
        );
    }
  };

  return (
    <div className="question-body">
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Add Question</h2>
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label>Question-Name</label>
                <input {...register("questionTitle", { required: true })} />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Question Category</label>

                <input {...register("questionCategory", { required: true })} />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Question Level</label>

                <input {...register("questionLevel", { required: true })} />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Examples</label>

                <input {...register("questionExample", { required: true })} />
              </div>
            </div>

            <div className="col">
              <div className="form-group">
                <label>Output</label>

                <input {...register("questionOutput", { required: true })} />
              </div>
            </div>

            {/* <div className="col">
            <div className="form-group">
              <label>Test case</label>

              <input {...register("dateOfQuestionAddition", { required: true })} />
            </div>
          </div> */}

            <div className="col">
              <div className="form-group">
                <label>Solution</label>

                <input {...register("bestSolution", { required: true })} />
              </div>
            </div>

            <div className="col">
              <input type="submit" value="Submit" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
