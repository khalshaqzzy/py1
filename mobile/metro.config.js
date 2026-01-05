import { getDefaultConfig } from "expo/metro-config";
import { withNativeWind } from "nativewind/metro-config";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const config = getDefaultConfig(__dirname);

export default withNativeWind(config, { 
  input: "./src/styles/global.css",
});