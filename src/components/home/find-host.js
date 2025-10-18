import axios from "axios";
import React, { useState, useEffect } from "react";
import headers from "../config";
import ProfileCard from "../userCards/profileCards";
import Navbar from "./navbar";

export default function FindHost() {
  const [loading, setloading] = useState(true);
  const [people, setpeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const header = headers();
    if (header !== undefined) {
      axios
        .get("http://localhost:3001/user/interviewer", header)
        .then((res) => {
          if (res.statusText === "OK") {
            console.log("[FIND-HOST] Fetched hosts:", res.data.data);
            setpeople(res.data.data);
            setFilteredPeople(res.data.data);
          }
        })
        .catch((error) => {
          console.error("[FIND-HOST] Error fetching hosts:", error);
        })
        .finally(() => {
          setloading(false);
        });
    }
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
