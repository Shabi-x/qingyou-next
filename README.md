# Qingyou Next - 南邮日程表

![a9d5a97f56a84341223f6cecac200696](https://github.com/user-attachments/assets/883b04ab-b305-4087-a466-6eb2ba6b33a7)

南邮日程表是由青柚工作室继南邮小程序后研发的又一款服务于南京邮电大学师生的APP，集成了日常使用中高频次的功能，致力于提供更加的使用体验。

## Get started

1. 安装依赖

   ```bash
   npm install
   ```

2. 启动项目

   ```bash
   npx expo start
   ```

命令行中会给出多种启动方式，可以根据需要选择：

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)，一个用于快速体验的沙盒环境

项目采用 [file-based routing](https://docs.expo.dev/router/introduction/)，直接修改 **app** 目录下的文件即可开始开发。

## Build & OTA workflow

### EAS Build

我们使用 [EAS Build](https://docs.expo.dev/build/introduction/) 来生成可安装包：

```bash
# Android 内测包（订阅 preview channel）
eas build --platform android --profile preview

# iOS 或生产环境时可切换 profile，例如 production
eas build --platform ios --profile production
```

`profile` 来自 `eas.json`，决定了分发方式、是否是 dev client、绑定的 channel 等。比如 `preview` profile 已配置 `channel: "preview"`，因此打出来的包会自动订阅 preview 渠道。

### EAS Update（OTA）

当只改动 JS/资源时，用 OTA 推送即可：

```bash
eas update --channel preview --message "fix calendar ui"
```

要点：

- `channel` 决定这一批 App 会收到哪条更新时间线；目前主要使用 `preview` 和 `development`。
- OTA 只对已经集成 `expo-updates` 且 runtimeVersion 匹配的安装包生效。
- App 冷启动（或手动 `Updates.reloadAsync()`）后会加载最新 bundle，属于“无感知”更新。

如需切换渠道映射，可在 Dashboard 执行：

```bash
eas channel:list
eas channel:edit preview --branch preview
```

### 多平台注意事项

- **Android**：使用 `preview` / `development` profile 生成内部分发 APK，生产版可切换 `production` profile 并开启 Play App Bundle。
- **iOS**：同理，通过 `preview`/`production` profile 选择对应渠道，分发到 TestFlight 或内部设备。
- **Web**：`npm run export` 或 EAS Update 在 `web` 平台同样生成 bundle，可部署到任意静态托管（如 Vercel），但它与 OTA 逻辑独立。

## Get a fresh project

需要重置为全新模版时可以执行：

```bash
npm run reset-project
```

该命令会把示例代码移动到 **app-example**，并创建一个空的 **app** 目录方便重新开始。

## Learn more

想系统了解 Expo，可参考：

- [Expo documentation](https://docs.expo.dev/): 覆盖基础到进阶的官方文档与 [指南](https://docs.expo.dev/guides)。
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): 手把手完成一个同时运行在 Android、iOS、Web 的示例。

## Join the community

欢迎加入社区，与其他开发者交流跨端经验：

- [Expo on GitHub](https://github.com/expo/expo): 浏览并参与贡献这个开源平台。
- [Discord community](https://chat.expo.dev): 与全球 Expo 用户交流、提问。
