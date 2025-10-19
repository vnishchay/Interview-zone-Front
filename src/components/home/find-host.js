import axios from "axios";
import React, { useState, useEffect } from "react";
import { headers, API_BASE } from "../config";
import ProfileCard from "../userCards/profileCards";
import Navbar from "./navbar";

// Simple in-memory cache to dedupe interviewer requests across mounts.
// Keeps the first successful response for the app lifetime so later
// remounts (or duplicate mounts) won't trigger a second network call
// that could return an empty result and overwrite UI state.
let interviewerCache = null;
let interviewerPromise = null;

export default function FindHost() {
  const [loading, setloading] = useState(true);
  const [people, setpeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const header = headers();
    // Fetch hosts regardless of authentication state
    if (interviewerCache) {
      // reuse cached value
      setpeople(interviewerCache);
      setFilteredPeople(interviewerCache);
      setloading(false);
      return;
    }

    if (interviewerPromise) {
      // another mount in flight — reuse it
      interviewerPromise
        .then((data) => {
          setpeople(data);
          setFilteredPeople(data);
        })
        .catch((error) => {
          console.error("[FIND-HOST] Error fetching hosts:", error);
        })
        .finally(() => setloading(false));
      return;
    }

    interviewerPromise = axios
      .get(`${API_BASE}/user/interviewer`, header)
      .then((res) => {
        if (res.statusText === "OK") {
          interviewerCache = res.data.data || [];
          return interviewerCache;
        }
        return [];
      })
      .catch((error) => {
        console.error("[FIND-HOST] Error fetching hosts:", error);
        interviewerCache = [];
        throw error;
      })
      .finally(() => {
        interviewerPromise = null;
      });

    interviewerPromise
      .then((data) => {
        setpeople(data);
        setFilteredPeople(data);
      })
      .catch(() => {})
      .finally(() => setloading(false));
  }, []); // Empty dependency array - only run once on mount

  // Real-time search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPeople(people);
      return;
    }

    const filtered = people.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPeople(filtered);
  }, [searchQuery, people]); // Re-run when searchQuery or people changes

  const handleSearch = () => {
    // This is now handled by the useEffect above
    // But we can keep it for the button click if needed
    if (!searchQuery.trim()) {
      setFilteredPeople(people);
      return;
    }

    const filtered = people.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPeople(filtered);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="find-host-page">
      <div className="find-host-container">
        <div className="search-section">
          <div className="search-box-modern">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="search-btn" onClick={handleSearch}>
              <span>🔍</span> Search
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Loading available hosts...</p>
          </div>
        ) : (
          <div className="hosts-grid">
            {filteredPeople && filteredPeople.length > 0 ? (
              filteredPeople.map((user, index) => (
                <ProfileCard
                  key={user._id || index}
                  object={user._id}
                  type={3}
                />
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">👥</div>
                <h3>No hosts found</h3>
                <p>
                  {searchQuery
                    ? "Try a different search term"
                    : "No interview hosts are available at the moment"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
