import { Globaler, host_url } from "./global.jsx";

import React, { useState, useEffect, use } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from "@mui/material";

const fetchData = async (url, method = "GET", body = null) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error("API call failed");
  }

  return response.json();
};

const Tab2 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allFriends, setAllFriends] = useState([]);

  // Fetch incoming requests on component mount
  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        const data = await fetchData(`${host_url}/api/friends/requests`);
        setIncomingRequests(data.map((request) => request.requester));
      } catch (error) {
        console.error("Failed to fetch incoming requests", error);
      }
    };
    fetchIncomingRequests();
  }, []);

  // Fetch users based on search term
  useEffect(() => {
    if (searchTerm.length === 0) return; // Skip if no search term
    const fetchUsers = async () => {
      try {
        const data = await fetchData(`${host_url}/api/users/${searchTerm}`);
        setAllUsers(data); // Assuming the response is an array of users
      } catch (error) {
        console.error("Failed to search users", error);
      }
    };
    fetchUsers();
  }, [searchTerm]);

  useEffect(() => {
    const fetchOutgoingRequests = async () => {
      try {
        const data = await fetchData(`${host_url}/api/friends/outgoing`);
        setOutgoingRequests(data); // Assuming the response is an array of users
      } catch (error) {
        console.error("Failed to search outgoing requests", error);
      }
    };
    fetchOutgoingRequests();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await fetchData(`${host_url}/api/friends`);
        setAllFriends(data); // Assuming the response is an array of users
      } catch (error) {
        console.error("Failed to fetch friends", error);
      }
    };
    fetchFriends();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSendRequest = async (user) => {
    try {
      await fetch(`${host_url}/api/users/${user.username}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
      });
      setOutgoingRequests((prev) => [...prev, user]); // Add to outgoing requests
      setSearchTerm(""); // Clear search
    } catch (error) {
      console.error("Failed to send friend request", error);
    }
  };

  const handleAddBack = async (username) => {
    try {
      await fetch(`${host_url}/api/friends/requests/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
        body: JSON.stringify({ response: "accept" }),
      });
      // Remove the accepted request from the list
      setIncomingRequests((prev) => prev.filter((user) => user !== username));
    } catch (error) {
      console.error("Failed to add friend", error);
    }
  };

  const handleRejectRequest = async (username) => {
    try {
      await fetch(`${host_url}/api/friends/requests/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        mode: "cors",
        body: JSON.stringify({ response: "reject" }),
      });
      // Remove the rejected request from the list
      setIncomingRequests((prev) => prev.filter((user) => user !== username));
    } catch (error) {
      console.error("Failed to reject request", error);
    }
  };

  // Filter users for search
  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Half */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          padding: 2,
          borderBottom: "1px solid #ccc",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Add Friends
        </Typography>

        {/* Search Bar */}
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            label="Search users"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
          />

          {/* Search Results Dropdown */}
          {searchTerm && filteredUsers.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                maxHeight: 200,
                overflowY: "auto",
                zIndex: 10,
              }}
            >
              <List>
                {filteredUsers.map((user, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <Button
                        variant="contained"
                        onClick={() => handleSendRequest(user)}
                        disabled={outgoingRequests
                          .concat(allFriends)
                          .map((e) => e.username)
                          .includes(user.username)}
                      >
                        Send Request
                      </Button>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={user.profilePic} alt={user.username} />
                    </ListItemAvatar>
                    <ListItemText primary={user.username} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        {/* Pending Outgoing Requests */}
        <Box
          sx={{
            marginTop: 2,
            height: "calc(100% - 100px)", // adjust to leave space for search bar
            overflowY: "auto",
            paddingRight: 1,
          }}
        >
          {outgoingRequests.length > 0 && (
            <>
              <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                Pending Requests
              </Typography>
              <List>
                {outgoingRequests.map((user, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar src={user.profilePic} alt={user.username} />
                    </ListItemAvatar>
                    <ListItemText primary={user.username} />
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      Pending
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </>
          )}
        </Box>
      </Box>

      {/* Bottom Half */}
      <Box sx={{ flex: 1, padding: 2, overflowY: "auto" }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Incoming Friend Requests
        </Typography>

        <List>
          {incomingRequests.map((username, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar alt={username} />
              </ListItemAvatar>
              <ListItemText primary={username} />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAddBack(username)}
                >
                  Add Back
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRejectRequest(username)}
                >
                  Reject
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Tab2;
