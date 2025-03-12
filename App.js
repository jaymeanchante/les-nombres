import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import * as Speech from "expo-speech";

const totalTime = 60;
const totalLives = 3;

export default function App() {
  const [targetNumber, setTargetNumber] = useState(generateRandomNumber());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(totalLives);
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleGameOver(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver, score]);

  useEffect(() => {
    if (gameOver) return;

    const speakNumber = async () => {
      Speech.speak(`${targetNumber}`, { language: "fr" });
    };

    speakNumber();
  }, [targetNumber]);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 99) + 1;
  }

  useEffect(() => {
    if (input !== "" && (targetNumber < 10 || input.length >= 2)) {
      checkGuess();
    }
  }, [input]);

  function checkGuess() {
    if (parseInt(input) === targetNumber) {
      setScore((prevScore) => prevScore + 1);
      setMessage("Correct!");
    } else {
      setLives((prevLives) => prevLives - 1);
      setMessage("Wrong!");
    }

    setTimeout(() => setMessage(""), 1000);

    if (lives - 1 === 0) {
      handleGameOver(score + (parseInt(input) === targetNumber ? 1 : 0));
    } else {
      setTargetNumber(generateRandomNumber());
    }
    setInput("");
  }

  function handleGameOver(finalScore) {
    setGameOver(true);
    Alert.alert("Game Over!", `Your Score: ${finalScore}`, [
      { text: "OK", onPress: resetGame },
    ]);
  }

  function resetGame() {
    setScore(0);
    setLives(totalLives);
    setTimeLeft(totalTime);
    setTargetNumber(generateRandomNumber());
    setGameOver(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
      <Text style={styles.lives}>Lives: {"❤️".repeat(lives)}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={input}
        onChangeText={setInput}
        placeholder="Enter your guess"
      />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.score}>Score: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  timer: { fontSize: 24, fontWeight: "bold" },
  lives: { fontSize: 20, marginVertical: 10 },
  input: {
    borderWidth: 1,
    width: 150,
    padding: 15,
    textAlign: "center",
    marginBottom: 10,
  },
  message: { fontSize: 20, color: "blue", marginVertical: 10 },
  score: { fontSize: 22, marginTop: 10 },
});
