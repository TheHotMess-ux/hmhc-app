import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ForecastChip from "./ForecastChip";

type Props = {
  coffeeForecast: string;
  brainFogForecast: string;
  patienceForecast: string;
  survivalStrategy: string[];

  feralLevel: {
    emoji: string;
    title: string;
    meter: string;
    description: string;
    recommendation: string;
  };
};

export default function FeralForecastCard({
  coffeeForecast,
  brainFogForecast,
  patienceForecast,
  survivalStrategy,
  feralLevel,
}: Props) {
  return (

    <View style={styles.card}>
      <Text style={styles.title}>🔥 YOUR FERAL FORECAST</Text>

    <View style={styles.feralLevelCard}>
  <Text style={styles.feralLevelEyebrow}>
    Powered by today's check-in 
  </Text>

  <Text style={styles.feralLevelTitle}>
    {feralLevel.emoji} {feralLevel.title}
  </Text>

  <Text style={styles.feralLevelMeter}>
    {feralLevel.meter}
  </Text>

  <Text style={styles.feralLevelDescription}>
    {feralLevel.description}
  </Text>

  <Text style={styles.feralLevelRecommendation}>
    {feralLevel.recommendation}
  </Text>
</View>

      <Text style={styles.subtitle}>
        Here's what we're working with today
      </Text>

      <View style={styles.row}>
        <ForecastChip
          emoji="☕"
          title="Coffee"
          value={coffeeForecast}
        />

        <ForecastChip
          emoji="🧠"
          title="Brain Fog"
          value={brainFogForecast}
        />

        <ForecastChip
          emoji="😤"
          title="Patience"
          value={patienceForecast}
        />
      </View>

      <View style={styles.strategyCard}>
        <Text style={styles.strategyTitle}>
          🌿 SURVIVAL STRATEGY
        </Text>

        {survivalStrategy.map((tip) => (
          <Text key={tip} style={styles.tip}>
            • {tip}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#18171B",
    borderRadius: 26,
    padding: 20,
    gap: 18,
  },

  title: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    color: "#AFA9B6",
    fontSize: 14,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  strategyCard: {
    backgroundColor: "#26242B",
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },

  strategyTitle: {
    color: "#D4AF37",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },

  tip: {
    color: "#ECE8EF",
    fontSize: 15,
    lineHeight: 22,
  },

  feralLevelCard: {
  backgroundColor: "#26242B",
  borderRadius: 18,
  padding: 16,
  gap: 8,
},

feralLevelEyebrow: {
  color: "#D4AF37",
  fontSize: 11,
  fontWeight: "800",
  letterSpacing: 1,
},

feralLevelTitle: {
  color: "#ECE8EF",
  fontSize: 22,
  fontWeight: "800",
},

feralLevelMeter: {
  color: "#D4AF37",
  fontSize: 20,
  letterSpacing: 3,
},

feralLevelDescription: {
  color: "#ECE8EF",
  fontSize: 15,
  lineHeight: 22,
},

feralLevelRecommendation: {
  color: "#AFA9B6",
  fontSize: 14,
  lineHeight: 20,
},
});