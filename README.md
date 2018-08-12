# 改行くん Expo ver.

https://play.google.com/store/apps/details?id=me.morishin.kaigyokun.android

## Setup

```sh
yarn
```

## Run

1. Launch packager

    ```sh
    exp start
    ```

1. Launch Android emulator by Genymotion

1. Launch app with Expo app in emulator

    ```sh
    exp android
    ```

## Publish (only for owner)
### Bump version

```sh
yarn run bumpversion
```

### Generate apk

```sh
exp build:android
```

### Publish

Publish the app on Google Play Console.
