import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { BarChart, PieChart } from "react-native-chart-kit";

import "../global.css";

const API_URL = {
  residents: "http://192.168.155.85:5001/residents",
  households: "http://192.168.155.85:5001/households",
  businesses: "http://192.168.155.85:5001/businesses",
};

const StatCard = ({ icon, title, value, color }) => {
  return (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      delay={300}
      className={`bg-gray-800 rounded-xl p-4 mb-4 flex-row items-center shadow-lg`}
      style={{ borderLeftWidth: 4, borderLeftColor: color }}
    >
      <View
        className="bg-opacity-20 rounded-full p-2 mr-3"
        style={{ backgroundColor: `${color}30` }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-gray-400 text-sm">{title}</Text>
        <Text className="text-white text-xl font-bold">{value}</Text>
      </View>
    </Animatable.View>
  );
};

const Home = () => {
  const [residents, setResidents] = useState([]);
  const [households, setHouseholds] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [residentsRes, householdsRes, businessesRes] = await Promise.all([
        axios.get(API_URL.residents),
        axios.get(API_URL.households),
        axios.get(API_URL.businesses),
      ]);

      setResidents(residentsRes.data);
      setHouseholds(householdsRes.data);
      setBusinesses(businessesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Count residents by gender
  const genderCounts = residents.reduce((acc, resident) => {
    acc[resident.gender] = (acc[resident.gender] || 0) + 1;
    return acc;
  }, {});

  // Count residents by voterStatus
  const voterCounts = residents.reduce((acc, resident) => {
    acc[resident.voterStatus] = (acc[resident.voterStatus] || 0) + 1;
    return acc;
  }, {});

  // Count residents by civil status
  const civilStatusCounts = residents.reduce((acc, resident) => {
    acc[resident.civilStatus] = (acc[resident.civilStatus] || 0) + 1;
    return acc;
  }, {});

  const civilStatusData = {
    labels: ["Single", "Married", "Separated", "Divorced", "Widowed"],
    datasets: [
      {
        data: [
          civilStatusCounts["Single"] || 0,
          civilStatusCounts["Married"] || 0,
          civilStatusCounts["Separated"] || 0,
          civilStatusCounts["Divorced"] || 0,
          civilStatusCounts["Widowed"] || 0,
        ],
      },
    ],
  };

  // Categorize residents by life stages
  const getLifeStage = (age) => {
    if (age < 18) return "Child/Teen";
    if (age < 30) return "Young Adult";
    if (age < 40) return "Adult";
    if (age < 60) return "Middle Age";
    return "Senior";
  };

  // Count residents by life stage
  const lifeStageCounts = residents.reduce((acc, resident) => {
    const stage = getLifeStage(resident.age);
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});

  const lifeStageData = [
    {
      name: "Child/Teen",
      population: lifeStageCounts["Child/Teen"] || 0,
      color: "#FF6B6B",
      legendFontColor: "#FFFFFF",
      legendFontSize: 12,
    },
    {
      name: "Young Adult",
      population: lifeStageCounts["Young Adult"] || 0,
      color: "#4ECDC4",
      legendFontColor: "#FFFFFF",
      legendFontSize: 12,
    },
    {
      name: "Adult",
      population: lifeStageCounts["Adult"] || 0,
      color: "#45B7D1",
      legendFontColor: "#FFFFFF",
      legendFontSize: 12,
    },
    {
      name: "Middle Age",
      population: lifeStageCounts["Middle Age"] || 0,
      color: "#37db79",
      legendFontColor: "#FFFFFF",
      legendFontSize: 12,
    },
    {
      name: "Senior",
      population: lifeStageCounts["Senior"] || 0,
      color: "#dbc537",
      legendFontColor: "#FFFFFF",
      legendFontSize: 12,
    },
  ];

  if (loading) {
    return (
      <View className="bg-gray-900 flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#6366F1" />
        <Text className="text-white mt-4">Loading community data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-gray-900 flex-1 justify-center items-center p-6">
        <Ionicons name="alert-circle" size={60} color="#EF4444" />
        <Text className="text-white text-lg text-center mt-4">{error}</Text>
        <TouchableOpacity
          className="bg-indigo-600 py-3 px-6 rounded-lg mt-6"
          onPress={fetchData}
        >
          <Text className="text-white font-bold">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-gray-900 flex-1">
      <ScrollView className="flex-1 px-4 pt-2 pb-6">
        <Animatable.View animation="fadeIn" duration={600}>
          <View className="flex-row justify-between items-center mb-6 mt-2">
            <Text className="text-white text-3xl font-bold">Dashboard</Text>
            <View className="bg-indigo-600 rounded-full p-2">
              <Ionicons
                name="refresh"
                size={20}
                color="white"
                onPress={fetchData}
              />
            </View>
          </View>

          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Ionicons name="people" size={20} color="#6366F1" />
              <Text className="text-white text-xl font-semibold ml-2">
                Population Summary
              </Text>
            </View>

            <StatCard
              icon="people"
              title="Total Residents"
              value={residents.length}
              color="#6366F1"
            />

            <View className="flex-row space-x-3 gap-6">
              <View className="flex-1">
                <StatCard
                  icon="man"
                  title="Males"
                  value={genderCounts["Male"] || 0}
                  color="#3B82F6"
                />
              </View>
              <View className="flex-1">
                <StatCard
                  icon="woman"
                  title="Females"
                  value={genderCounts["Female"] || 0}
                  color="#EC4899"
                />
              </View>
            </View>

            <Animatable.View
              animation="fadeInUp"
              duration={800}
              delay={300}
              className="bg-gray-800 rounded-xl p-4 mb-7 flex-row items-center shadow-lg"
              style={{ borderLeftWidth: 4, borderLeftColor: "#4ECDC4" }}
            >
              <PieChart
                data={lifeStageData}
                width={Dimensions.get("window").width - 48}
                height={220}
                chartConfig={{
                  backgroundColor: "#1e293b",
                  backgroundGradientFrom: "#1e293b",
                  backgroundGradientTo: "#1e293b",
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Animatable.View>
          </View>

          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Ionicons name="home" size={20} color="#10B981" />
              <Text className="text-white text-xl font-semibold ml-2">
                Property Overview
              </Text>
            </View>

            <View className="flex-row space-x-3 gap-6">
              <View className="flex-1">
                <StatCard
                  icon="home"
                  title="Households"
                  value={households.length}
                  color="#10B981"
                />
              </View>
              <View className="flex-1">
                <StatCard
                  icon="business"
                  title="Businesses"
                  value={businesses.length}
                  color="#F59E0B"
                />
              </View>
            </View>
          </View>

          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="checkbox" size={20} color="#8B5CF6" />
              <Text className="text-white text-xl font-semibold ml-2">
                Civic Engagement
              </Text>
            </View>

            <StatCard
              icon="checkbox"
              title="Registered Voters"
              value={voterCounts["Registered"] || 0}
              color="#8B5CF6"
            />
          </View>

          <View className="flex-row items-center mb-4">
            <Ionicons name="people" size={20} color="#F59E0B" />
            <Text className="text-white text-xl font-semibold ml-2">
              Civil Status Distribution
            </Text>
          </View>

          <Animatable.View
            animation="fadeInUp"
            duration={800}
            delay={600}
            className="bg-gray-800 rounded-xl p-4 mb-7 flex-row items-center shadow-lg"
            style={{ borderLeftWidth: 4, borderLeftColor: "#F59E0B" }}
          >
            <BarChart
              data={civilStatusData}
              width={Dimensions.get("window").width - 48}
              height={220}
              yAxisLabel=""
              xAxisLabel=""
              chartConfig={{
                backgroundColor: "#1e293b",
                backgroundGradientFrom: "#1e293b",
                backgroundGradientTo: "#1e293b",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                barPercentage: 0.5,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              showValuesOnTopOfBars
              fromZero
            />
          </Animatable.View>
        </Animatable.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
