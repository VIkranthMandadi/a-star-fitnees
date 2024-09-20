import React, { useState } from "react";
import { View, ScrollView, Text, Dimensions } from "react-native";
import { Card, Button, Title } from "react-native-paper";
import tw from "twrnc";
import {
  format,
  addMonths,
  subMonths,
  getDaysInMonth,
  startOfMonth,
  getDay,
} from "date-fns";

// Get the dimensions of the screen
const { width } = Dimensions.get("window");
const cardSize = width / 7 - 7; // 7 days in a week, subtracting some margin for spacing

const CalendarPage = () => {
  // State to track the current month and year
  const [currentDate, setCurrentDate] = useState(new Date());

  // Array of day names for the header
  const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];

  // Get number of days in the current month
  const daysInMonth = Array.from(
    { length: getDaysInMonth(currentDate) },
    (_, i) => i + 1
  );

  // Get the starting day of the current month (0 = Sunday, 6 = Saturday)
  const firstDayOfMonth = getDay(startOfMonth(currentDate));

  // Handlers for navigating to previous and next months
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <ScrollView style={tw`bg-white flex-1 p-4`}>
      {/* Month navigation buttons */}
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

      {/* Day names header */}
      <View style={tw`flex-row justify-between mb-2`}>
        {dayNames.map((day, index) => (
          <Text
            key={index}
            style={{
              width: cardSize,
              textAlign: "center",
              fontSize: width * 0.04,
              fontWeight: "bold",
            }}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={tw`flex-row flex-wrap`}>
        {/* Empty spaces for the days before the 1st of the month */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <View key={`empty-${index}`} style={{ width: cardSize, margin: 1 }} />
        ))}

        {/* Render the days of the month */}
        {daysInMonth.map((day) => (
          <Card
            key={day}
            style={{
              width: cardSize,
              margin: 1,
              borderColor: "gray",
              borderWidth: 2,
              justifyContent: "center",
              alignItems: "center", // Ensure the text aligns properly
            }}
            onPress={() => console.log(`Selected day: ${day}`)}
          >
            <Card.Content style={tw`items-center`}>
              <Text style={{ textAlign: "center", fontSize: width * 0.025 }}>
                {day}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

export default CalendarPage;