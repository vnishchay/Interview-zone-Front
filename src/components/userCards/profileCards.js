import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { headers, API_BASE } from "../config";
import "./profileCards.css";

export const CustomButton = ({ id, type }) => {
  const [loading, setloading] = useState(false);
  const [isdone, setisdone] = useState(false);
  const header = headers();

  const sentInterviewRequest = () => {
    setloading((pre) => true);
    const header = headers();
    if (header !== undefined) {
      axios
        .post(`${API_BASE}/user/interviewRequest`, { id: id }, header)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            if (res.data && res.data.isConnection === false) {
              alert("Make connection first");
              setisdone(false);
              setloading(false);
            } else {
              setloading(false);
              setisdone(true);
            }
          } else {
            setloading(false);
            setisdone(false);
            return alert("Some Error");
          }
        });
    }
  };

  const sendconnectionRequest = () => {
    setloading((pre) => true);
    const header = headers();
    if (header !== undefined) {
      axios
        .post(`${API_BASE}/user/connectionrequest`, { id: id }, header)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            setloading((pre) => false);
            setisdone((pre) => true);
          } else {
            setloading((pre) => false);
            setisdone((pre) => false);
            return alert("Some Error");
          }
        })
        .catch((error) => {
          console.error("Connection request error:", error);
          setloading(false);
          setisdone(false);
          alert(
            error.response?.data?.message || "Failed to send connection request"
          );
        });
    }
  };

  const acceptConnection = async () => {
    setloading((pre) => true);
    const header = headers();
    axios
      .post(`${API_BASE}/user/acceptConnection`, { id: id }, header)
      .then((res) => {
        if (res.status === 200) {
          setloading(false);
          setisdone(true);
        } else {
          setloading(false);
          setisdone(false);
          return alert("Some Error");
        }
      })
      .catch((err) => {
        console.error("acceptConnection error", err);
        setloading(false);
        setisdone(false);
      });
  };

  const deleteConnectionRequest = async () => {
    setloading((pre) => true);
    const header = headers();
    axios
      .post(`${API_BASE}/user/deleteConnectionRequest`, { id: id }, header)
      .then((res) => {
        if (res.status === 200) {
          setloading(false);
          setisdone(true);
        } else {
          setloading(false);
          setisdone(false);
          return alert("Some Error");
        }
      })
      .catch((err) => {
        console.error("deleteConnectionRequest error", err);
        setloading(false);
        setisdone(false);
      });
  };

  const acceptInterview = async () => {
    setloading((pre) => true);
    const header = headers();
    axios
      .post(`${API_BASE}/user/acceptInterview`, { id: id }, header)
      .then((res) => {
        if (res.status === 200) {
          setloading(false);
          setisdone(true);
        } else {
          setloading(false);
          setisdone(false);
          return alert("Some Error");
        }
      })
      .catch((err) => {
        console.error("acceptInterview error", err);
        setloading(false);
        setisdone(false);
      });
  };

  return (
    <>
      {isdone ? (
        <div className="success-badge">Done ✓</div>
      ) : (
        <>
          {type === 1 && (
            <button className="btn-0" onClick={sentInterviewRequest}>
              {!loading ? <>Interview Request </> : <>...</>}
            </button>
          )}
          {type === 2 && (
            <button className="btn-0" onClick={acceptConnection}>
              {!loading ? <> Accept Connection Request </> : <>...</>}
            </button>
          )}
          {type === 3 && (
            <button className="btn-0" onClick={sendconnectionRequest}>
              {!loading ? <> Connect </> : <>...</>}
            </button>
          )}
          {type === 4 && (
            <button className="btn-0" onClick={acceptInterview}>
              {!loading ? <> Accept Interview Request </> : <>...</>}
            </button>
          )}
          {type === 5 && (
            <button className="btn-0" onClick={deleteConnectionRequest}>
              {!loading ? <> Delete Connection Request </> : <>...</>}
            </button>
          )}
          {type === 6 && (
            <button
              className="btn-0"
              onClick={() => console.log("TO be implemented")}
            >
              Remove Connection
            </button>
          )}
          {type === 7 && (
            <button
              className="btn-0"
              onClick={() => console.log("TO be implemented")}
            >
              Accept Interview Request
            </button>
          )}
        </>
      )}
    </>
  );
};

const ProfileCard = ({ object, type }) => {
  const [data, setdata] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const header = headers();
    if (header !== undefined && object) {
      axios
        .post(`${API_BASE}/user/getUserById`, { id: object }, header)
        .then((res) => {
          console.log("[PROFILE-CARD] User data:", res);
          if (res.status === 200) {
            // API returns { data: { ... } } or { data: [...] }
            setdata(res.data.data || res.data);
          }
        })
        .catch((err) => {
          console.error("[PROFILE-CARD] Error fetching user:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [object]); // Only depend on object

  if (loading) {
    return (
      <div className="profile-card card">
        <div className="card-loading">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {data && (
        <div>
          <div className="profile-card card">
            <div>
              <Link to={`/profile/${data.username}`}>
                <div className="profileImage">
                  {data.username?.charAt(0).toUpperCase()}
                </div>
                <div className="nameFamily">
                  <p>{data.username}</p>
                  <span>{data.name || "Developer"}</span>
                </div>
              </Link>
              <CustomButton id={data._id} type={type}></CustomButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCard;

export const InterviewCard = ({ id, type }) => {
  const [interview, setinterview] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const header = headers();
    if (header !== undefined && id) {
      axios
        .post(`${API_BASE}/interview/findById`, { id: id }, header)
        .then((res) => {
          if (res.status === 200) {
            console.log("[INTERVIEW-CARD] Interview data:", res.data);
            setinterview(res.data.data || res.data);
          }
        })
        .catch((err) => {
          console.error("[INTERVIEW-CARD] Error fetching interview:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]); // Only depend on id

  if (loading) {
    return (
      <div className="profile-card card">
        <div className="card-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-card card">
      {interview && (
        <div>
          <div className="nameFamily">
            <div>Interview Session</div>
            <div>Host: {interview.hostname || "N/A"}</div>
            <div>Candidate: {interview.candidatename || "N/A"}</div>
            <div>Level: {interview.levelOfQuestions || "EASY"}</div>
          </div>
          {type === 8 ? (
            <Link to={`/setup/${interview.interviewID}`}>
              <button className="btn-0">Proceed</button>
            </Link>
          ) : (
            <CustomButton id={interview._id} type={type}></CustomButton>
          )}
        </div>
      )}
    </div>
  );
};
