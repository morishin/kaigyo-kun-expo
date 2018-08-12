import React from "react";
import {
  View,
  KeyboardAvoidingView,
  Image,
  StatusBar,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Clipboard,
  Alert,
  ToastAndroid,
  Platform
} from "react-native";
import { Analytics, ScreenHit, Event } from "expo-analytics";
import TextInputBox from "./TextInputBox";
import { env } from "./dotenv/env";
import StateStorage from "./StateStorage";

interface State {
  currentText: string;
  showSmilyFace: boolean;
}

const analytics = env.GOOGLE_ANALYTICS_TRACKING_ID
  ? new Analytics(env.GOOGLE_ANALYTICS_TRACKING_ID)
  : null;

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);

    this.state = {
      currentText: "",
      showSmilyFace: true
    };
  }

  async componentDidMount() {
    if (analytics) await analytics.hit(new ScreenHit("Top"));
    const savedText = await StateStorage.getInputText();
    if (savedText) {
      this.setState({
        currentText: savedText,
        showSmilyFace: savedText.length === 0
      });
    }
  }

  private async onPressCopyButton() {
    if (this.state.currentText.length === 0) {
      if (Platform.OS === "android") {
        ToastAndroid.show("テキストを入力してください", ToastAndroid.SHORT);
      } else {
        Alert.alert(
          "テキストを入力してください",
          undefined,
          [{ text: "閉じる" }],
          { cancelable: true }
        );
      }
      return;
    }

    const result = this.state.currentText.replace(/\n/g, "\ufeff\n");
    Clipboard.setString(result);
    Alert.alert(
      "コピーしました",
      "投稿アプリに貼り付けてご利用ください",
      [{ text: "閉じる" }],
      { cancelable: true }
    );

    if (analytics) await analytics.event(new Event("user_action", "copy"));
  }

  private onPressDeleteButton() {
    Alert.alert(
      "確認",
      "テキストを削除しますか？",
      [
        {
          text: "削除",
          onPress: async () => await this.clearText(),
          style: "destructive"
        },
        { text: "キャンセル", style: "cancel" }
      ],
      { cancelable: true }
    );
  }

  private async clearText() {
    this.setState({ currentText: "", showSmilyFace: true });
    await StateStorage.setInputText("");
    if (analytics) await analytics.event(new Event("user_action", "delete"));
  }

  private renderHeader() {
    return (
      <View
        style={{
          backgroundColor: "#C5C9C9",
          height: 44 + (StatusBar.currentHeight || 0),
          paddingTop: StatusBar.currentHeight || 0,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Image
          source={require("../assets/header_app_title.png")}
          resizeMode="contain"
          style={{ width: 83 }}
        />
      </View>
    );
  }

  private renderGuideMessage() {
    return (
      <View
        style={{
          alignItems: "center"
        }}
      >
        <Image
          source={require("../assets/please_input_message.png")}
          resizeMode="contain"
          style={{ width: 204 }}
        />
      </View>
    );
  }

  private renderTextInput() {
    const width = Dimensions.get("window").width - 60;
    return (
      <View
        style={{ width: "100%", alignItems: "center", paddingHorizontal: 30 }}
      >
        <TextInputBox
          style={{ width: width, height: width, backgroundColor: "#fff" }}
          value={this.state.currentText}
          onChangeText={async text => {
            this.setState({ currentText: text });
            await StateStorage.setInputText(text);
          }}
          showSmilyFace={this.state.showSmilyFace}
          onFocus={() => {
            this.setState({ showSmilyFace: false });
          }}
          onBlur={() => {
            this.setState({
              showSmilyFace: this.state.currentText.length === 0
            });
          }}
        />
      </View>
    );
  }

  private renderButton(type: "copy" | "delete", onPress: () => void) {
    const backgroundColor = type === "copy" ? "#8ED9D8" : "#D98283";
    const imageResource =
      type === "copy"
        ? require("../assets/copy_button_text.png")
        : require("../assets/delete_button_text.png");
    const width = Dimensions.get("window").width - 60;
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          borderRadius: 8,
          backgroundColor,
          width,
          height: 44,
          marginBottom: 18,
          alignSelf: "center"
        }}
        onPress={onPress}
        activeOpacity={0.5}
      >
        <View
          style={{
            height: "100%",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Image
            source={imageResource}
            resizeMode="contain"
            style={{ height: 20 }}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, backgroundColor: "#ECEFF3" }}>
          {this.renderHeader()}
          {this.renderGuideMessage()}
          {this.renderTextInput()}
          <View style={{ height: 22 }} />
          {this.renderButton("copy", () => {
            this.onPressCopyButton();
          })}
          {this.renderButton("delete", () => {
            this.onPressDeleteButton();
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}
