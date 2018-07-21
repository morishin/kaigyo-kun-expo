import React from "react";
import { View, TextInput, TextStyle, Image } from "react-native";

interface Props {
  style?: TextStyle;
  onChangeText?: (text: string) => void;
  value: string;
}

interface State {
  height: number;
  showSmilyFace: boolean;
}

export default class TextInputBox extends React.Component<Props, State> {
  private defaultHeight: number;
  private currentText: string;

  constructor(props: Props) {
    super(props);

    this.defaultHeight = (() => {
      if (props.style && props.style.height) {
        return typeof props.style.height === "string"
          ? parseInt(props.style.height, 10)
          : props.style.height;
      } else {
        return 20;
      }
    })();
    this.currentText = "";

    this.state = {
      height: this.defaultHeight,
      showSmilyFace: true
    };
  }

  private updateHeight(height: number) {
    this.setState({ height });
  }

  private renderSmilyFace() {
    return (
      <View
        accessible={false}
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: this.defaultHeight,
          height: this.defaultHeight,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={require("../assets/smily_face.png")}
          resizeMode="contain"
          style={{ width: this.defaultHeight * 0.67 }}
        />
      </View>
    );
  }

  render() {
    const { height } = this.state;

    return (
      <View>
        <TextInput
          value={this.props.value}
          onChangeText={text => {
            this.currentText = text;
            this.setState({ showSmilyFace: text.length === 0 });
            if (this.props.onChangeText) this.props.onChangeText(text);
          }}
          onFocus={() => {
            this.setState({ showSmilyFace: false });
          }}
          onBlur={() => {
            this.setState({
              showSmilyFace: this.currentText.length === 0
            });
          }}
          style={[
            this.props.style,
            {
              height: height > this.defaultHeight ? height : this.defaultHeight,
              textAlignVertical: "top"
            }
          ]}
          multiline={true}
          onContentSizeChange={e =>
            this.updateHeight(e.nativeEvent.contentSize.height + 12)
          }
          underlineColorAndroid="transparent"
          autoCorrect={false}
          padding={4}
        />
        {this.state.showSmilyFace ? this.renderSmilyFace() : null}
      </View>
    );
  }
}
