import { AsyncStorage } from "react-native";

const inputTextStateKey = "@inputText";

export default class StateStorage {
  static async getInputText(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(inputTextStateKey);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async setInputText(text: string) {
    try {
      await AsyncStorage.setItem(inputTextStateKey, text);
    } catch (error) {
      console.error(error);
    }
  }
}
