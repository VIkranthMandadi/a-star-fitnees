import React, { useState } from "react";
import { View, ScrollView, Text, Dimensions } from "react-native";
import { Card, Button, Title } from "react-native-paper";
import { useRouter } from "expo-router"; // Import useRouter
import tw from "twrnc";
import {
  format,
  addMonths,
  subMonths,
  getDaysInMonth,
  startOfMonth,
  getDay,
  isToday,
  setDate,
} from "date-fns";

// Get the dimensions of the screen
const { width } = Dimensions.get("window");
const cardSize = width / 7 - 7; // 7 days in a week, subtracting some margin for spacing

const CalendarPage = () => {
  const router = useRouter(); // Initialize useRouter for navigation
  const [currentDate, setCurrentDate] = useState(new Date());

  const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  const daysInMonth = Array.from(
    { length: getDaysInMonth(currentDate) },
    (_, i) => i + 1
  );
  const firstDayOfMonth = getDay(startOfMonth(currentDate));

  const handlePreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const checkIfToday = (day: number) => isToday(setDate(currentDate, day));

  const handleDayPress = (day: number) => {
    const selectedDate = format(setDate(currentDate, day), "yyyy-MM-dd");
    router.push({
      pathname: `/calendarDay/day`,
      params: { day: selectedDate },
    });
  };

  return (
    <ScrollView style={tw`bg-white flex-1 p-4`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <Button mode="contained" onPress={handlePreviousMonth}>
          Previous
        </Button>
        <Title style={{ fontSize: width * 0.05 }}>
          {format(currentDate, "MMMM yyyy")}
        </Title>
        <Button mode="contained" onPress={handleNextMonth}>
          Next
        </Button>
      </View>

      <View style={tw`flex-row justify-between mb-2`}>
        {dayNames.map((day, index) => (
          <Text key={index} style={tw`text-center text-base font-bold`}>
            {day}
          </Text>
        ))}
      </View>

      <View style={tw`flex-row flex-wrap`}>
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <View key={`empty-${index}`} style={{ width: cardSize, margin: 1 }} />
        ))}
        {daysInMonth.map((day) => {
          const isCurrentDay = checkIfToday(day);
          return (
            <Card
              key={day}
              style={{
                width: cardSize,
                margin: 1,
                borderColor: isCurrentDay ? "blue" : "gray",
                borderWidth: 2,
                backgroundColor: isCurrentDay
                  ? "rgba(0, 0, 255, 0.1)"
                  : "white",
              }}
              onPress={() => handleDayPress(day)}
            >
              <Card.Content style={tw`items-center`}>
                <Text style={{ textAlign: "center", fontSize: width * 0.025 }}>
                  {day}
                </Text>
              </Card.Content>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default CalendarPage;