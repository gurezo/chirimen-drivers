# WS2812B RGB LED HAT

Waveshare WS2812B RGB LED HAT を chirimen-lite 環境で node-web-gpio を使用して制御するサンプルコードです。

https://www.amazon.co.jp/dp/B08JQMR2XB
https://www.waveshare.com/rgb-led-hat.htm
https://www.waveshare.com/wiki/RGB_LED_HAT
https://www.waveshare.com/wiki/Raspberry_Pi_Tutorial_Series:_Getting_Started_with_lighting_up_an_LED

## 必要なもの

- Waveshare RGB LED HAT (WS2812B 搭載)
- Raspberry Pi (chirimen-lite 対応)
- node-web-gpio

## GPIO ピン設定

Waveshare RGB LED HAT は通常、GPIO18（PWM0）を使用します。

`main.js`の以下の行で GPIO 番号を変更できます：

```javascript
const port = gpioAccess.ports.get(18); // GPIO18を使用
```

## LED 数の設定

HAT に搭載されている LED 数に合わせて、`main.js`の以下の行を変更してください：

```javascript
const ledCount = 8; // LED数（HATの仕様に合わせて変更）
```

## インストール

```bash
npm install
```

## 実行

```bash
node main.js
```

## デモプログラム

このサンプルコードには以下のデモが含まれています：

1. **基本的な色の変化**: 赤、緑、青、黄、マゼンタ、シアン、白の順に点灯
2. **順番に点灯**: LED を順番に点灯させて移動するエフェクト
3. **レインボーエフェクト**: 虹色のグラデーションが流れるエフェクト
4. **フェードアウト**: 白色から徐々に暗くなるエフェクト

## WS2812B クラスの使い方

```javascript
const ws2812b = new WS2812B(port, ledCount);

// すべてのLEDを赤色に設定
ws2812b.setAll(255, 0, 0);
await ws2812b.show();

// 特定のLEDを緑色に設定（インデックスは0から開始）
ws2812b.setPixel(0, 0, 255, 0);
await ws2812b.show();

// すべてのLEDを消灯
ws2812b.clear();
await ws2812b.show();
```

## 重要な制限事項

**⚠️ node-web-gpio では WS2812B を正しく制御できません**

このコードは技術的には動作しますが、**LED は正しく点灯しません**。理由は以下の通りです：

1. **タイミング要件**: WS2812B は 0.3μs〜0.9μs の厳密なタイミング制御が必要です
2. **非同期処理のオーバーヘッド**: `port.write()`の各呼び出しに数ミリ秒かかります
3. **実測値**: データ送信時間が約 274ms（本来は 0.8ms）と約 343 倍遅いです

### 推奨される解決策

WS2812B を正しく制御するには、以下の方法を使用してください：

1. **Python の rpi_ws281x ライブラリ**（推奨）

   - ハードウェア PWM/DMA を使用
   - タイミング要件を満たす
   - 例: `sudo pip3 install rpi-ws281x`

2. **C 言語で直接 GPIO 制御**

   - 最も低レベルの制御が可能
   - タイミング精度が高い

3. **専用の WS2812B 制御ライブラリ**
   - ハードウェア機能を活用

### その他の注意事項

- GPIO ピン番号は Waveshare HAT の実際の仕様に合わせて調整してください
- LED 数は HAT の仕様に基づいて設定してください（通常 8 個や 16 個など）
- このコードは学習目的やデモンストレーション用です
- 複数の WS2812B デバイスを制御する場合は、それぞれ異なる GPIO ピンを使用してください

## 参考リンク

- [Waveshare RGB LED HAT](https://www.waveshare.com/rgb-led-hat.htm)
- [Waveshare RGB LED HAT Wiki](https://www.waveshare.com/wiki/RGB_LED_HAT)
- [node-web-gpio](https://github.com/chirimen-oh/node-web-gpio)
- [chirimen-lite](https://github.com/chirimen-oh/chirimen-lite)
