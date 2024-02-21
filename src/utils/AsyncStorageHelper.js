import AsyncStorage from '@react-native-async-storage/async-storage';
// store item in AsyncStorage
export const _setData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error setting data:', error);
    return false;
  }
};

export const _retrieveObject = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};
// get item from AsyncStorage
export const _retrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    } else return;
  } catch (error) {
    return error;
  }
};

export const _clearData = async () => {
  try {
    // Clear all data from AsyncStorage
    await AsyncStorage.clear();

    console.log('All data cleared from AsyncStorage.');
  } catch (error) {
    console.error('Error clearing data: ', error);
  }
};
export const _removeItem = key => AsyncStorage.removeItem(key);
