import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Globaler, host_url } from "./global.jsx";
import coin from "/betcoin.png";

// Mapping backend fields to friendly names
const FIELD_MAPPING = {
  currency: "curr",
  tasks: "numTasks",
  username: "username",
};

const Tab3 = () => {
  const [friends, setFriends] = useState([]);
  const [sortBy, setSortBy] = useState("currency");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        let response = await fetch(`${host_url}/api/friends`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let data = await response.json();
        const mappedData = data.map((friend) => ({
          username: friend.username,
          curr: friend.currency,
          numTasks: friend.numoftaskscompleted,
        }));

        response = await fetch(`${host_url}/api/users/self`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        data = await response.json();
        setUser(data);
        setFriends([...mappedData, data]);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

  // Sort friends based on selected sortBy
  const sortedFriends = [...friends].sort((a, b) => {
    const field = FIELD_MAPPING[sortBy];
    if (field === "username") {
      return a[field].localeCompare(b[field]);
    }
    return b[field] - a[field];
  });

  return (
    <Box sx={{ padding: 2 }}>
      {/* Dropdown for selecting sort criteria */}
      <FormControl
        fullWidth
        sx={{
          marginTop: 1,
          marginBottom: 3,
          height: "64px", // match Box height (padding + font size considered)
        }}
      >
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          label="Sort By"
          onChange={handleChange}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: (theme) => theme.palette.background.default2,
              },
            },
          }}
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MenuItem value="currency">BetCoin</MenuItem>
          <MenuItem value="tasks">Tasks Completed</MenuItem>
          <MenuItem value="username">Username (A-Z)</MenuItem>
        </Select>
      </FormControl>

      {/* Conditional rendering */}
      {sortedFriends.length === 0 ? (
        <Typography variant="body1" align="center" color="text.secondary">
          No friends added yet
        </Typography>
      ) : (
        sortedFriends.map((friend, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 2,
              marginBottom: 2,
              border:
                friend != user
                  ? (theme) => `1px solid ${theme.palette.border}`
                  : (theme) => `1px solid ${theme.palette.primary.main}`,
              bgcolor:
                friend != user ? "background.default" : "primary.default2",
              borderRadius: "4px",
            }}
          >
            {/* Left side: Avatar + Username */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={`https://ui-avatars.com/api/?name=${friend.username}`}
                alt={friend.username}
                sx={{ width: 30, height: 30, marginRight: 2 }}
              />
              <Typography variant="body1">{friend.username}</Typography>
            </Box>

            {/* Right side: Currency or Tasks */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {sortBy === "currency" ? (
                <>
                  <Typography variant="body1" sx={{ marginRight: 1 }}>
                    {friend.curr}
                  </Typography>
                  <img
                    src={coin}
                    alt="Coin"
                    style={{ width: 20, height: 20 }}
                  />
                </>
              ) : sortBy === "tasks" ? (
                <Typography variant="body1">{friend.numTasks} tasks</Typography>
              ) : null}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default Tab3;
