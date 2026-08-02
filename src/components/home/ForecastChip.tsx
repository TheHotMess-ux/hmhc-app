import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ForecastChipProps = {
  emoji: string;
  title: string;
  value: string;
};

export default function ForecastChip({
  emoji,
  title,
  value,
}: ForecastChipProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{emoji}</Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 6,
  },

  emoji: {
    fontSize: 24,
  },

  title: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7A737B",
    textAlign: "center",
  },

  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#231F24",
    textAlign: "center",
  },
});