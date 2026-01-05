import { getDefaultConfig } from "expo/metro-config.js";
import { withNativeWind } from "nativewind/metro-config.js";

const config = getDefaultConfig(process.cwd());

export default withNativeWind(config, { 
  input: "./src/styles/global.css",
});