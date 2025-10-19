import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { headers, API_BASE } from "../config";
import "./profileCards.css";

// In-memory caches to reduce duplicate network requests when many cards
// are rendered (e.g. activity page). These live for the app lifetime and
// avoid hammering the backend with the same GET/POST for each card.
const userCache = new Map();
const userPromises = new Map();
const interviewCache = new Map();
const interviewPromises = new Map();

const fetchUserById = (id, header) => {
  if (!id) return Promise.resolve(null);
  if (userCache.has(id)) return Promise.resolve(userCache.get(id));
  if (userPromises.has(id)) return userPromises.get(id);

  const p = axios
    .post(`${API_BASE}/user/getUserById`, { id }, header)
    .then((res) => {
      const data = res.data.data || res.data || null;
      userCache.set(id, data);
      userPromises.delete(id);
      return data;
    })
    .catch((err) => {
      userPromises.delete(id);
      throw err;
    });

  userPromises.set(id, p);
  return p;
};

const fetchInterviewById = (id, header) => {
  if (!id) return Promise.resolve(null);
  if (interviewCache.has(id)) return Promise.resolve(interviewCache.get(id));
  if (interviewPromises.has(id)) return interviewPromises.get(id);

  const p = axios
    .post(`${API_BASE}/interview/findById`, { id }, header)
    .then((res) => {
      const data = res.data.data || res.data || null;
      interviewCache.set(id, data);
      interviewPromises.delete(id);
      return data;
    })
    .catch((err) => {
      interviewPromises.delete(id);
      throw err;
    });

  interviewPromises.set(id, p);
  return p;
};

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
    let mounted = true;
    if (header !== undefined && object) {
      fetchUserById(object, header)
        .then((user) => {
          if (!mounted) return;
          setdata(user);
        })
        .catch((err) => {
          console.error("[PROFILE-CARD] Error fetching user:", err);
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
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
                <div
                  className="profileImage"
                  style={(() => {
                    const name = (data.name || data.username || "").trim();
                    const source = name || data.username || "";
                    // initials: first two letters
                    const initials = (
                      source
                        .split(" ")
                        .map((s) => s.charAt(0))
                        .join("") || source.slice(0, 2)
                    )
                      .slice(0, 2)
                      .toUpperCase();

                    // deterministic color from string -> hue
                    let hash = 0;
                    for (let i = 0; i < source.length; i++) {
                      hash = source.charCodeAt(i) + ((hash << 5) - hash);
                      hash = hash & hash;
                    }
                    const hue = Math.abs(hash) % 360; // 0-359
                    const bg = `hsl(${hue} 65% 45%)`;
                    const shadow = `0 4px 12px hsla(${hue} 60% 30% / 0.28)`;
                    return {
                      background: bg,
                      boxShadow: shadow,
                    };
                  })()}
                >
                  {(() => {
                    const name = (data.name || data.username || "").trim();
                    const source = name || data.username || "";
                    const initials = (
                      source
                        .split(" ")
                        .map((s) => s.charAt(0))
                        .join("") || source.slice(0, 2)
                    )
                      .slice(0, 2)
                      .toUpperCase();
                    return initials;
                  })()}
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
    let mounted = true;
    if (header !== undefined && id) {
      fetchInterviewById(id, header)
        .then((iv) => {
          if (!mounted) return;
          setinterview(iv);
        })
        .catch((err) => {
          console.error("[INTERVIEW-CARD] Error fetching interview:", err);
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
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
