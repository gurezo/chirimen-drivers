import { requestGPIOAccess } from 'node-web-gpio';
import { promisify } from 'util';
const sleep = promisify(setTimeout);

// WS2812B制御クラス
class WS2812B {
  constructor(gpioPort, ledCount = 8) {
    this.port = gpioPort;
    this.ledCount = ledCount;
    this.pixels = new Array(ledCount * 3).fill(0);
  }

  // 高精度な待機（ナノ秒単位）- 同期的に実行
  delayNanoseconds(ns) {
    const start = process.hrtime.bigint();
    while (process.hrtime.bigint() - start < ns) {
      // ビジーウェイト
    }
  }

  // 1ビットを送信（0ビット: HIGH 0.3μs + LOW 0.9μs, 1ビット: HIGH 0.6μs + LOW 0.6μs）
  // 注意: WS2812Bのタイミングは非常に厳密です
  // JavaScriptの非同期処理では正確なタイミング制御が困難なため、
  // タイミングを調整する必要がある場合があります
  async sendBit(bit) {
    // write()がPromiseを返すかどうかに関わらず処理
    const writeHigh = this.port.write(1); // HIGH
    if (writeHigh instanceof Promise) {
      await writeHigh;
    }

    // タイミング調整: 実際のハードウェアに合わせて調整が必要な場合があります
    // より長いタイミングを使用して安定性を向上
    if (bit) {
      this.delayNanoseconds(800n); // 0.8μs (0.6μsから調整)
    } else {
      this.delayNanoseconds(400n); // 0.4μs (0.3μsから調整)
    }

    const writeLow = this.port.write(0); // LOW
    if (writeLow instanceof Promise) {
      await writeLow;
    }

    if (bit) {
      this.delayNanoseconds(700n); // 0.7μs (0.6μsから調整)
    } else {
      this.delayNanoseconds(1000n); // 1.0μs (0.9μsから調整)
    }
  }

  // 1バイト（8ビット）を送信（MSB first）
  async sendByte(byte) {
    for (let i = 7; i >= 0; i--) {
      await this.sendBit((byte >> i) & 1);
    }
  }

  // RGB値を設定（LEDインデックス、R、G、B）
  // 注意: WS2812BはGRB順序でデータを受け取るため、順序を調整
  // 色が正しく表示されない場合は、RGB順序に変更してください
  setPixel(index, r, g, b) {
    if (index >= 0 && index < this.ledCount) {
      const pos = index * 3;
      // WS2812BはGRB順序でデータを受け取る
      this.pixels[pos] = g;
      this.pixels[pos + 1] = r;
      this.pixels[pos + 2] = b;
      // もし色が正しく表示されない場合は、以下のコメントを外してRGB順序に変更
      // this.pixels[pos] = r;
      // this.pixels[pos + 1] = g;
      // this.pixels[pos + 2] = b;
    }
  }

  // すべてのLEDを同じ色に設定
  setAll(r, g, b) {
    for (let i = 0; i < this.ledCount; i++) {
      this.setPixel(i, r, g, b);
    }
  }

  // すべてのLEDをクリア（消灯）
  clear() {
    this.setAll(0, 0, 0);
  }

  // ピクセルデータを送信
  async show() {
    // 割り込みを無効化してタイミングを正確に保つ
    // すべてのデータを連続して送信（中断を避ける）
    for (let i = 0; i < this.pixels.length; i++) {
      await this.sendByte(this.pixels[i]);
    }
    // リセットパルス（50μs以上LOW、実際には80μs以上推奨）
    const writeLow = this.port.write(0);
    if (writeLow instanceof Promise) {
      await writeLow;
    }
    this.delayNanoseconds(80000n); // 80μs（余裕を持たせる）
  }
}

main();

async function main() {
  try {
    // GPIOアクセスを取得
    const gpioAccess = await requestGPIOAccess();
    // Waveshare RGB LED HATは通常GPIO18を使用（PWM0）
    // 必要に応じてGPIO番号を変更してください
    const port = gpioAccess.ports.get(18);

    if (!port) {
      throw new Error('GPIO18ポートが取得できませんでした');
    }

    await port.export('out');

    const ledCount = 8; // LED数（HATの仕様に合わせて変更）
    const ws2812b = new WS2812B(port, ledCount);

    console.log('WS2812B RGB LED HAT制御を開始します...');
    console.log(`LED数: ${ledCount}`);
    console.log(`GPIOピン: 18`);
    console.log('\n⚠️  重要な注意事項:');
    console.log(
      'node-web-gpioは非同期処理のため、WS2812Bのタイミング要件（0.3μs〜0.9μs）を'
    );
    console.log(
      '満たすことができません。各port.write()の呼び出しに数ミリ秒かかるため、'
    );
    console.log('WS2812Bの制御には適していません。');
    console.log('\n推奨される解決策:');
    console.log(
      '1. Pythonのrpi_ws281xライブラリを使用（ハードウェアPWM/DMAを使用）'
    );
    console.log('2. C言語で直接GPIOを制御');
    console.log('3. 専用のWS2812B制御ライブラリを使用');
    console.log(
      '\nこのコードは動作しますが、LEDは正しく点灯しない可能性が高いです。'
    );
    console.log('タイミングテストを実行します...\n');

    // WS2812Bタイミングテスト: 非常にシンプルなパターンを送信
    ws2812b.clear();
    ws2812b.setPixel(0, 1, 0, 0); // 非常に暗い赤
    const startTime = process.hrtime.bigint();
    await ws2812b.show();
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // ミリ秒に変換
    console.log(`データ送信時間: ${duration.toFixed(2)}ms`);
    console.log(`（WS2812Bの24ビットデータ送信は約0.8msかかるはずです）`);
    if (duration > 10) {
      console.log(
        `⚠️  警告: 送信時間が${(duration / 0.8).toFixed(0)}倍遅いです。`
      );
      console.log(`   この速度ではWS2812Bは正しく動作しません。`);
    }
    await sleep(2000);

    // テスト: 最初のLEDだけを赤色で点灯（動作確認用）
    console.log('\nテスト: 最初のLEDを赤色で点灯');
    ws2812b.clear();
    ws2812b.setPixel(0, 255, 0, 0); // 赤
    await ws2812b.show();
    await sleep(2000);

    // テスト: すべてのLEDを順番に点灯（動作確認用）
    console.log('\nテスト: すべてのLEDを順番に点灯');
    for (let i = 0; i < ledCount; i++) {
      ws2812b.clear();
      ws2812b.setPixel(i, 0, 255, 0); // 緑
      await ws2812b.show();
      await sleep(300);
    }
    await sleep(1000);

    // デモ1: 基本的な色の変化
    console.log('\nデモ1: 基本的な色の変化');
    const colors = [
      [255, 0, 0], // 赤
      [0, 255, 0], // 緑
      [0, 0, 255], // 青
      [255, 255, 0], // 黄
      [255, 0, 255], // マゼンタ
      [0, 255, 255], // シアン
      [255, 255, 255], // 白
    ];

    for (let i = 0; i < 3; i++) {
      for (const [r, g, b] of colors) {
        ws2812b.setAll(r, g, b);
        await ws2812b.show();
        await sleep(500);
      }
    }

    // デモ2: 順番に点灯
    console.log('\nデモ2: 順番に点灯');
    for (let round = 0; round < 2; round++) {
      for (let i = 0; i < ledCount; i++) {
        ws2812b.clear();
        ws2812b.setPixel(i, 0, 255, 0); // 緑で点灯
        await ws2812b.show();
        await sleep(100);
      }
      for (let i = ledCount - 1; i >= 0; i--) {
        ws2812b.clear();
        ws2812b.setPixel(i, 255, 0, 0); // 赤で点灯
        await ws2812b.show();
        await sleep(100);
      }
    }

    // デモ3: レインボーエフェクト
    console.log('\nデモ3: レインボーエフェクト');
    for (let cycle = 0; cycle < 3; cycle++) {
      for (let hue = 0; hue < 360; hue += 10) {
        for (let i = 0; i < ledCount; i++) {
          const h = (hue + (i * 360) / ledCount) % 360;
          const [r, g, b] = hsvToRgb(h, 1.0, 1.0);
          ws2812b.setPixel(i, r, g, b);
        }
        await ws2812b.show();
        await sleep(50);
      }
    }

    // デモ4: フェードアウト
    console.log('\nデモ4: フェードアウト');
    ws2812b.setAll(255, 255, 255);
    await ws2812b.show();
    for (let brightness = 255; brightness >= 0; brightness -= 5) {
      ws2812b.setAll(brightness, brightness, brightness);
      await ws2812b.show();
      await sleep(30);
    }

    // クリア
    ws2812b.clear();
    await ws2812b.show();
    console.log('\nデモ完了');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// HSVからRGBへの変換
function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r, g, b;
  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}
