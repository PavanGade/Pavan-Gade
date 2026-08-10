module.exports = function (api) {
  api.cache(true);
  const plugins = [];
  // Reanimated plugin breaks Jest worker transforms unless worklets are installed;
  // keep it for app builds only.
  if (process.env.NODE_ENV !== 'test') {
    plugins.push('react-native-reanimated/plugin');
  }
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
