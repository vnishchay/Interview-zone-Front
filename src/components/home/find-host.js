import axios from "axios";
import React, { useState, useEffect } from "react";
import "../profile/profilepage.css"; // for tag-chip styles
import { headers, API_BASE } from "../config";
import ProfileCard from "../userCards/profileCards";
import { useAuth } from "../auth/authContext";

export default function FindHost() {
  const [loading, setLoading] = useState(true);
  const [people, setPeople] = useState([]);
  const [filteredPeople, setFilteredPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // Fetch available tags for filter
  useEffect(() => {
    let mounted = true;
    axios
      .get(`${API_BASE}/constants?key=interview-categories`, headers())
      .then((res) => {
        if (!mounted) return;
        if (res.status === 200 && res.data && res.data.data)
          setAvailableTags(res.data.data);
        else if (res.status === 200 && Array.isArray(res.data))
          setAvailableTags(res.data);
      })
      .catch(() => {})
      .finally(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const { state: authState } = useAuth();

  // Fetch hosts and apply filters
  useEffect(() => {
    let mounted = true;
    const header = headers();

    const fetchHosts = async (useHeader = true) => {
      try {
        const h = useHeader ? header : undefined;
        // If backend supports excluding current user via query param, include it
        const excludeId =
          (authState &&
            authState.user &&
            (authState.user.id || authState.user._id)) ||
          null;
        const url = excludeId
          ? `${API_BASE}/user/interviewer?exclude=${excludeId}`
          : `${API_BASE}/user/interviewer`;
        const res = await axios.get(url, h);
        const list = (res && (res.data?.data || res.data)) || [];
        return list;
      } catch (err) {
        return [];
      }
    };

    (async () => {
      setLoading(true);
      const list = await fetchHosts();
      if (!mounted) return;
      setPeople(list || []);
      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Filter whenever people, searchQuery or selectedTags change
  useEffect(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    let out = people.slice();

    if (q) {
      out = out.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const email = (p.email || "").toLowerCase();
        return name.includes(q) || email.includes(q);
      });
    }

    if (selectedTags && selectedTags.length > 0) {
      out = out.filter((p) => {
        const tags = Array.isArray(p.tags) ? p.tags : [];
        // match if user has ANY of the selected tags (OR match)
        return selectedTags.some((t) => tags.includes(t));
      });
    }

    setFilteredPeople(out);
  }, [people, searchQuery, selectedTags]);

  // Handlers
  const handleSearch = () => {
    // search is reactive via searchQuery state and useEffect; nothing else needed here
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div>
      <div style={{ padding: 16 }}>
        <div
          className="search-section"
          style={{ display: "flex", gap: 8, alignItems: "center" }}
        >
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #444",
              background: "rgba(255,255,255,0.03)",
              color: "#fff",
            }}
          />
          <button
            className="search-btn"
            onClick={handleSearch}
            style={{ padding: "8px 14px", borderRadius: 8 }}
          >
            <span role="img" aria-label="search">
              🔍
            </span>{" "}
            Search
          </button>
        </div>

        <div
          className="tag-filter-section"
          style={{
            marginTop: 18,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ verticalAlign: "middle" }}
            >
              <path d="M3 5h18v2H3z" fill="#9aa4ff" />
              <path d="M6 11h12v2H6z" fill="#9aa4ff" />
              <path d="M10 17h4v2h-4z" fill="#9aa4ff" />
            </svg>
            <span style={{ color: "#fff", fontWeight: 600 }}>Tags</span>
            {selectedTags.length > 0 && (
              <span
                style={{
                  color: "#a7bfff",
                  fontWeight: 600,
                  marginLeft: 6,
                  fontSize: 13,
                }}
              >
                {selectedTags.length}
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 6,
              WebkitOverflowScrolling: "touch",
              pointerEvents: "auto",
              zIndex: 3,
            }}
          >
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.key);
              return (
                <button
                  key={tag.key}
                  className={`tag-chip${isSelected ? " selected" : ""}`}
                  type="button"
                  aria-pressed={isSelected}
                  tabIndex={0}
                  onClick={() => {
                    if (isSelected)
                      setSelectedTags(
                        selectedTags.filter((t) => t !== tag.key)
                      );
                    else if (selectedTags.length < 5)
                      setSelectedTags((s) => [...s, tag.key]);
                  }}
                  disabled={!isSelected && selectedTags.length >= 5}
                  title={
                    isSelected
                      ? "Remove filter"
                      : selectedTags.length < 5
                      ? "Add filter"
                      : "Max 5 tags"
                  }
                  style={{
                    padding: "8px 14px",
                    borderRadius: 20,
                    fontWeight: 600,
                    border: isSelected
                      ? "2px solid #6c7cff"
                      : "1px solid rgba(255,255,255,0.08)",
                    background: isSelected
                      ? "linear-gradient(90deg,#6c7cff,#8a6cff)"
                      : "rgba(255,255,255,0.02)",
                    color: isSelected ? "#fff" : "#ddd",
                    cursor:
                      !isSelected && selectedTags.length >= 5
                        ? "not-allowed"
                        : "pointer",
                    whiteSpace: "nowrap",
                    pointerEvents: "auto",
                    zIndex: 4,
                  }}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>

          <div style={{ marginLeft: "auto" }}>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                style={{
                  background: "transparent",
                  color: "#a7bfff",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-state" style={{ marginTop: 30 }}>
            <div className="loader"></div>
            <p>Loading available hosts...</p>
          </div>
        ) : (
          <div className="hosts-grid" style={{ marginTop: 18 }}>
            {filteredPeople && filteredPeople.length > 0 ? (
              filteredPeople.map((user, index) => (
                <ProfileCard
                  key={user._id || index}
                  object={user._id}
                  type={3}
                />
              ))
            ) : (
              <div className="no-results" style={{ marginTop: 40 }}>
                <div className="no-results-icon">👥</div>
                <h3>No hosts found</h3>
                <p>
                  {searchQuery || selectedTags.length > 0
                    ? "Try a different search term or tag filter"
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
