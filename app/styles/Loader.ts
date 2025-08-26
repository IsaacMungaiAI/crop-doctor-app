import { StyleSheet } from "react-native";

export const loader = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderWrapper: {
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loaderText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginTop: 10,
  },
});