import axios from "axios";
import { useEffect, useState } from "react";
import { headers, API_BASE } from "../config";
import ProfileCard, { InterviewCard } from "../userCards/profileCards";
import "./activity.css";

const Activity = () => {
  const [data, setdata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const header = headers();
    if (header !== undefined) {
      axios
        .get(`${API_BASE}/user/profile`, header)
        .then((res) => {
          if (res.status === 200 && res.data.user) {
            console.log("[ACTIVITY] Profile data:", res.data);
            setdata(res.data);
          }
        })
        .catch((err) => {
          console.error("[ACTIVITY] Error fetching profile:", err);
          setError(
            err.response?.data?.message || "Failed to load activity data"
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return (
      <div className="activity">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Loading your activity...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="activity">
        <div className="error-state">
          <h3>Error loading activity</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-page">
      {data && data.user && (
        <div className="activity">
          <div className="section-title">Interviews</div>
          <ul className="grid">
            {data.user.interviews && data.user.interviews.length > 0 ? (
              data.user.interviews.map((interview, index) => {
                return (
                  <InterviewCard
                    key={interview}
                    id={interview}
                    type={8}
                  ></InterviewCard>
                );
              })
            ) : (
              <div className="activity-not-found">No Interviews</div>
            )}
          </ul>

          <div className="section-title">Connections</div>
          <ul className="grid">
            {data.user.connections && data.user.connections.length > 0 ? (
              data.user.connections.map((connection, index) => {
                return (
                  <ProfileCard
                    key={connection}
                    object={connection}
                    type={6}
                  ></ProfileCard>
                );
              })
            ) : (
              <div className="activity-not-found">No Connections</div>
            )}
          </ul>

          <div className="section-title">Sent Connection Requests</div>
          <ul className="grid">
            {data.user.sentConnectionRequest &&
            data.user.sentConnectionRequest.length > 0 ? (
              data.user.sentConnectionRequest.map((request, index) => {
                return (
                  <ProfileCard
                    key={request}
                    object={request}
                    type={5}
                  ></ProfileCard>
                );
              })
            ) : (
              <div className="activity-not-found">No Sent Requests</div>
            )}
          </ul>

          <div className="section-title">Incoming Connection Requests</div>
          <ul className="grid">
            {data.user.connectionRequests &&
            data.user.connectionRequests.length > 0 ? (
              data.user.connectionRequests.map((request, index) => {
                return (
                  <ProfileCard
                    key={request}
                    object={request}
                    type={2}
                  ></ProfileCard>
                );
              })
            ) : (
              <div className="activity-not-found">No Incoming Requests</div>
            )}
          </ul>

          <div className="section-title">Sent Interview Requests</div>
          <ul className="grid">
            {data.user.sentInterviewRequest &&
            data.user.sentInterviewRequest.length > 0 ? (
              data.user.sentInterviewRequest.map((request, index) => {
                return (
                  <ProfileCard
                    key={request}
                    object={request}
                    type={8}
                  ></ProfileCard>
                );
              })
            ) : (
              <div className="activity-not-found">
                No Sent Interview Requests
              </div>
            )}
          </ul>

          <div className="section-title">Incoming Interview Requests</div>
          <ul className="grid">
            {data.user.interviewRequest &&
            data.user.interviewRequest.length > 0 ? (
              data.user.interviewRequest.map((request, index) => {
                return (
                  <ProfileCard
                    key={request}
                    object={request}
                    type={4}
                  ></ProfileCard>
                );
              })
            ) : (
              <div className="activity-not-found">
                No Incoming Interview Requests
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Activity;
