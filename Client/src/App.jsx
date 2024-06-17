import React, { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";
import { Button, Container, Stack, TextField, Typography } from "@mui/material";

const App = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);

  const socket = useMemo(() => io("http://localhost:3000"), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (room) {
      console.log("Sending message:", message, "to room:", room);
      socket.emit("message", { message, room });
      setMessage("");
    } else {
      alert("Please enter a room ID");
    }
  };

  const handleJoinRoom = () => {
    if (room) {
      console.log("Joining room:", room);
      socket.emit("joinRoom", room);
    } else {
      alert("Please enter a room ID");
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected", socket.id);
    });

    socket.on("welcome", (e) => {
      console.log("Welcome message:", e);
    });

    socket.on("messageReceive", (e) => {
      console.log("Message received:", e);
      setReceivedMessages((prevMessages) => [...prevMessages, e]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <Container maxWidth="sm">
      <Typography variant='h6' component="div" gutterBottom>
        Socket ID: {socketId}
      </Typography>
      <TextField
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        id='room'
        label='Room ID'
        variant='outlined'
      />
      <Button onClick={handleJoinRoom} variant='contained' color='primary'>
        Join Room
      </Button>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id='message'
          label='Message'
          variant='outlined'
        />
        <Button type='submit' variant='contained' color='primary'>
          Send Message
        </Button>
      </form>
      <Stack>
        {receivedMessages.map((m, i) => (
          <Typography key={i} variant='h6' component="div" gutterBottom>
            {m.message} (Room: {m.room})
          </Typography>
        ))}
      </Stack>
    </Container>
  );
};

export default App;
