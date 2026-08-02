import React from "react";
import { StyleSheet, Text, View } from "react-native";

import ForecastChip from "./ForecastChip";

type Props = {
  coffeeForecast: string;
  brainFogForecast: string;
  patienceForecast: string;
  survivalStrategy: string[];
};

export default function FeralForecastCard({
  coffeeForecast,
  brainFogForecast,
  patienceForecast,
  survivalStrategy,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>🌤️ FERAL FORECAST</Text>

      <Text style={styles.subtitle}>
        Today's conditions
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
});