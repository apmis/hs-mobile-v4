const fs = require('fs');

const tabsProfilePath = 'app/(tabs)/profile.tsx';
const featuresProfilePath = 'app/features/profile/index.tsx';

let tabsProfile = fs.readFileSync(tabsProfilePath, 'utf8');
let featuresProfile = fs.readFileSync(featuresProfilePath, 'utf8');

// Extract styles from tabs profile
const match = tabsProfile.match(/const styles = ScaledSheet\.create\({[\s\S]*}\);\s*$/);
const stylesCode = match ? match[0] : '';

// Remove commented out styles from features profile
featuresProfile = featuresProfile.replace(/\/\/ const styles = ScaledSheet\.create\({[\s\S]*\/\/\s*}\);\s*$/, '');

// Fix ProfileScreen signature
featuresProfile = featuresProfile.replace(
  /interface ProfileScreenProps {[\s\S]*?}\n\nconst ProfileScreen = \(\{ styles \}: ProfileScreenProps\) => {/,
  'const ProfileScreen = () => {'
);

// Append styles code to features profile
featuresProfile += '\n\n' + stylesCode;

fs.writeFileSync(featuresProfilePath, featuresProfile);
console.log('Fixed profile.tsx styles');
