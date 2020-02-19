(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.OledDisplay = factory());
}(this, (function () { 'use strict';

  // @ts-check
  // Source : http://wiki.seeedstudio.com/wiki/Grove_-_OLED_Display_128*64

  const OLED_CONST = {
    basicFont: [
      [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x5f, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x07, 0x00, 0x07, 0x00, 0x00, 0x00],
      [0x00, 0x14, 0x7f, 0x14, 0x7f, 0x14, 0x00, 0x00],
      [0x00, 0x24, 0x2a, 0x7f, 0x2a, 0x12, 0x00, 0x00],
      [0x00, 0x23, 0x13, 0x08, 0x64, 0x62, 0x00, 0x00],
      [0x00, 0x36, 0x49, 0x55, 0x22, 0x50, 0x00, 0x00],
      [0x00, 0x00, 0x05, 0x03, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x1c, 0x22, 0x41, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x41, 0x22, 0x1c, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x08, 0x2a, 0x1c, 0x2a, 0x08, 0x00, 0x00],
      [0x00, 0x08, 0x08, 0x3e, 0x08, 0x08, 0x00, 0x00],
      [0x00, 0xa0, 0x60, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x08, 0x08, 0x08, 0x08, 0x08, 0x00, 0x00],
      [0x00, 0x60, 0x60, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x20, 0x10, 0x08, 0x04, 0x02, 0x00, 0x00],
      [0x00, 0x3e, 0x51, 0x49, 0x45, 0x3e, 0x00, 0x00],
      [0x00, 0x00, 0x42, 0x7f, 0x40, 0x00, 0x00, 0x00],
      [0x00, 0x62, 0x51, 0x49, 0x49, 0x46, 0x00, 0x00],
      [0x00, 0x22, 0x41, 0x49, 0x49, 0x36, 0x00, 0x00],
      [0x00, 0x18, 0x14, 0x12, 0x7f, 0x10, 0x00, 0x00],
      [0x00, 0x27, 0x45, 0x45, 0x45, 0x39, 0x00, 0x00],
      [0x00, 0x3c, 0x4a, 0x49, 0x49, 0x30, 0x00, 0x00],
      [0x00, 0x01, 0x71, 0x09, 0x05, 0x03, 0x00, 0x00],
      [0x00, 0x36, 0x49, 0x49, 0x49, 0x36, 0x00, 0x00],
      [0x00, 0x06, 0x49, 0x49, 0x29, 0x1e, 0x00, 0x00],
      [0x00, 0x00, 0x36, 0x36, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0xac, 0x6c, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x08, 0x14, 0x22, 0x41, 0x00, 0x00, 0x00],
      [0x00, 0x14, 0x14, 0x14, 0x14, 0x14, 0x00, 0x00],
      [0x00, 0x41, 0x22, 0x14, 0x08, 0x00, 0x00, 0x00],
      [0x00, 0x02, 0x01, 0x51, 0x09, 0x06, 0x00, 0x00],
      [0x00, 0x32, 0x49, 0x79, 0x41, 0x3e, 0x00, 0x00],
      [0x00, 0x7e, 0x09, 0x09, 0x09, 0x7e, 0x00, 0x00],
      [0x00, 0x7f, 0x49, 0x49, 0x49, 0x36, 0x00, 0x00],
      [0x00, 0x3e, 0x41, 0x41, 0x41, 0x22, 0x00, 0x00],
      [0x00, 0x7f, 0x41, 0x41, 0x22, 0x1c, 0x00, 0x00],
      [0x00, 0x7f, 0x49, 0x49, 0x49, 0x41, 0x00, 0x00],
      [0x00, 0x7f, 0x09, 0x09, 0x09, 0x01, 0x00, 0x00],
      [0x00, 0x3e, 0x41, 0x41, 0x51, 0x72, 0x00, 0x00],
      [0x00, 0x7f, 0x08, 0x08, 0x08, 0x7f, 0x00, 0x00],
      [0x00, 0x41, 0x7f, 0x41, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x20, 0x40, 0x41, 0x3f, 0x01, 0x00, 0x00],
      [0x00, 0x7f, 0x08, 0x14, 0x22, 0x41, 0x00, 0x00],
      [0x00, 0x7f, 0x40, 0x40, 0x40, 0x40, 0x00, 0x00],
      [0x00, 0x7f, 0x02, 0x0c, 0x02, 0x7f, 0x00, 0x00],
      [0x00, 0x7f, 0x04, 0x08, 0x10, 0x7f, 0x00, 0x00],
      [0x00, 0x3e, 0x41, 0x41, 0x41, 0x3e, 0x00, 0x00],
      [0x00, 0x7f, 0x09, 0x09, 0x09, 0x06, 0x00, 0x00],
      [0x00, 0x3e, 0x41, 0x51, 0x21, 0x5e, 0x00, 0x00],
      [0x00, 0x7f, 0x09, 0x19, 0x29, 0x46, 0x00, 0x00],
      [0x00, 0x26, 0x49, 0x49, 0x49, 0x32, 0x00, 0x00],
      [0x00, 0x01, 0x01, 0x7f, 0x01, 0x01, 0x00, 0x00],
      [0x00, 0x3f, 0x40, 0x40, 0x40, 0x3f, 0x00, 0x00],
      [0x00, 0x1f, 0x20, 0x40, 0x20, 0x1f, 0x00, 0x00],
      [0x00, 0x3f, 0x40, 0x38, 0x40, 0x3f, 0x00, 0x00],
      [0x00, 0x63, 0x14, 0x08, 0x14, 0x63, 0x00, 0x00],
      [0x00, 0x03, 0x04, 0x78, 0x04, 0x03, 0x00, 0x00],
      [0x00, 0x61, 0x51, 0x49, 0x45, 0x43, 0x00, 0x00],
      [0x00, 0x7f, 0x41, 0x41, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x02, 0x04, 0x08, 0x10, 0x20, 0x00, 0x00],
      [0x00, 0x41, 0x41, 0x7f, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x04, 0x02, 0x01, 0x02, 0x04, 0x00, 0x00],
      [0x00, 0x80, 0x80, 0x80, 0x80, 0x80, 0x00, 0x00],
      [0x00, 0x01, 0x02, 0x04, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x20, 0x54, 0x54, 0x54, 0x78, 0x00, 0x00],
      [0x00, 0x7f, 0x48, 0x44, 0x44, 0x38, 0x00, 0x00],
      [0x00, 0x38, 0x44, 0x44, 0x28, 0x00, 0x00, 0x00],
      [0x00, 0x38, 0x44, 0x44, 0x48, 0x7f, 0x00, 0x00],
      [0x00, 0x38, 0x54, 0x54, 0x54, 0x18, 0x00, 0x00],
      [0x00, 0x08, 0x7e, 0x09, 0x02, 0x00, 0x00, 0x00],
      [0x00, 0x18, 0xa4, 0xa4, 0xa4, 0x7c, 0x00, 0x00],
      [0x00, 0x7f, 0x08, 0x04, 0x04, 0x78, 0x00, 0x00],
      [0x00, 0x00, 0x7d, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x80, 0x84, 0x7d, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x7f, 0x10, 0x28, 0x44, 0x00, 0x00, 0x00],
      [0x00, 0x41, 0x7f, 0x40, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x7c, 0x04, 0x18, 0x04, 0x78, 0x00, 0x00],
      [0x00, 0x7c, 0x08, 0x04, 0x7c, 0x00, 0x00, 0x00],
      [0x00, 0x38, 0x44, 0x44, 0x38, 0x00, 0x00, 0x00],
      [0x00, 0xfc, 0x24, 0x24, 0x18, 0x00, 0x00, 0x00],
      [0x00, 0x18, 0x24, 0x24, 0xfc, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x7c, 0x08, 0x04, 0x00, 0x00, 0x00],
      [0x00, 0x48, 0x54, 0x54, 0x24, 0x00, 0x00, 0x00],
      [0x00, 0x04, 0x7f, 0x44, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x3c, 0x40, 0x40, 0x7c, 0x00, 0x00, 0x00],
      [0x00, 0x1c, 0x20, 0x40, 0x20, 0x1c, 0x00, 0x00],
      [0x00, 0x3c, 0x40, 0x30, 0x40, 0x3c, 0x00, 0x00],
      [0x00, 0x44, 0x28, 0x10, 0x28, 0x44, 0x00, 0x00],
      [0x00, 0x1c, 0xa0, 0xa0, 0x7c, 0x00, 0x00, 0x00],
      [0x00, 0x44, 0x64, 0x54, 0x4c, 0x44, 0x00, 0x00],
      [0x00, 0x08, 0x36, 0x41, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x00, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x41, 0x36, 0x08, 0x00, 0x00, 0x00, 0x00],
      [0x00, 0x02, 0x01, 0x01, 0x02, 0x01, 0x00, 0x00],
      [0x00, 0x02, 0x05, 0x05, 0x02, 0x00, 0x00, 0x00]
    ],
    address: 0x3c,
    maxX: 127,
    maxY: 63,
    pageMode: 1,
    horizontalMode: 2,
    commandMode: 0x80,
    dataMode: 0x40,
    chargePumpSettingCmd: 0x8d,
    chargePumpEnableCmd: 0x14,
    displayOffCmd: 0xae,
    displayOnCmd: 0xaf,
    normalDisplayCmd: 0xa6,
    inverseDisplayCmd: 0xa7,
    activateScrollCmd: 0x2f,
    dectivateScrollCmd: 0x2e,
    setBrightnessCmd: 0x81,
    scrollLeft: 0,
    scrollRight: 1,
    scroll2Frames: 7,
    scroll3Frames: 6,
    scroll4Frames: 5,
    scroll5Frames: 0,
    scroll25Frames: 6,
    scroll64Frames: 1,
    scroll128Frames: 2,
    scroll256Frames: 3,
    packetSize: 16
  };

  var OledDisplay = function(i2cPort, slaveAddress) {
    this.i2cPort = i2cPort;
    this.i2cSlave = null;
    if (!slaveAddress) {
      slaveAddress = OLED_CONST.address;
    }
    this.slaveAddress = slaveAddress;
    this.funcQueue = new Array();
    this.index = 0;
    this.sequence = null;
    this.addressingMode = OLED_CONST.pageMode;
    this.useSSD1306 = false;
  };

  OledDisplay.prototype = {
    initQ: function() {
      if (this.useSSD1306) {
        this.registerQueue(
          OLED_CONST.commandMode,
          OLED_CONST.chargePumpSettingCmd
        );
        this.registerQueue(
          OLED_CONST.commandMode,
          OLED_CONST.chargePumpEnableCmd
        );
        console.log("SSD1306 charge pump enabled.");
      }
      this.registerQueue(OLED_CONST.commandMode, OLED_CONST.displayOffCmd);
      this.registerQueue(OLED_CONST.commandMode, OLED_CONST.displayOnCmd);
      this.registerQueue(OLED_CONST.commandMode, OLED_CONST.normalDisplayCmd);
    },
    putCharQ: function(char) {
      var c = char.charCodeAt(0);
      if (c < 32 || c > 127) {
        c = 32;
      }
      var word = 0;
      for (var i = 0; i < 8; i++) {
        if (i % 2) {
          word |= OLED_CONST.basicFont[c - 32][i] << 8;
          this.registerQueue(OLED_CONST.dataMode, word);
        } else {
          word = OLED_CONST.basicFont[c - 32][i];
        }
      }
    },
    putStringQ: function(string) {
      if (typeof string === "object") {
        console.warn(`Ignoring invalid parameter: "${string}" is not string.`);
        return;
      }
      if (typeof string === "number" || typeof string === "boolean") {
        string = `${string}`;
      }
      for (var i = 0; i < string.length; i++) {
        var c = string.charAt(i);
        this.putCharQ(c);
      }
    },
    drawStringQ: function(row, col, string) {
      this.setTextXYQ(row, col);
      this.putStringQ(string);
    },
    setBrightnessQ: function(Brightness) {
      this.registerQueue(OLED_CONST.commandMode, OLED_CONST.Set_Brightness_Cmd);
      this.registerQueue(OLED_CONST.commandMode, Brightness);
    },
    setHorizontalModeQ: function() {
      this.addressingMode = OLED_CONST.horizontalMode;
      this.registerQueue(OLED_CONST.commandMode, 0x20);
      this.registerQueue(OLED_CONST.commandMode, 0);
    },
    setPageModeQ: function() {
      this.addressingMode = OLED_CONST.pageMode;
      this.registerQueue(OLED_CONST.commandMode, 0x20);
      this.registerQueue(OLED_CONST.commandMode, 0x02);
    },
    setTextXYQ: function(row, col) {
      this.registerQueue(OLED_CONST.commandMode, 0xb0 + row);
      this.registerQueue(OLED_CONST.commandMode, 0x00 + ((8 * col) & 0x0f));
      this.registerQueue(
        OLED_CONST.commandMode,
        0x10 + (((8 * col) >> 4) & 0x0f)
      );
    },
    clearDisplayQ: function() {
      for (var j = 0; j < 8; j++) {
        this.registerQueue(OLED_CONST.commandMode, 0xb0 + j);
        this.registerQueue(OLED_CONST.commandMode, 0);
        this.registerQueue(OLED_CONST.commandMode, 0x10);
        for (var i = 0; i < 16; i++) {
          this.putCharQ(" ");
        }
      }
    },
    registerQueue: function(mode, param) {
      if (this.sequence != null) {
        console.error("OledDisplay.registerQueue(): error! (now playing)");
        return;
      }
      var obj = { mode: mode, param: param };
      this.funcQueue.push(obj);
    },
    init: function(isSSD1306) {
      return new Promise(resolve => {
        if (isSSD1306) {
          this.useSSD1306 = true;
        }
        this.i2cPort.open(this.slaveAddress).then(i2cSlave => {
          this.i2cSlave = i2cSlave;
          this.initQ();
          this.playSequence().then(() => {
            resolve();
          });
        });
      });
    },
    playSequence: function() {
      return new Promise((resolve, reject) => {
        if (this.i2cSlave == null) {
          reject("i2cSlave Address does'nt yet open!");
        } else {
          if (this.sequence != null) {
            console.error("OledDisplay.playSequence(): error! (multiple call)");
            reject();
          }
          this.sequence = setInterval(() => {
            for (var cnt = 0; cnt < OLED_CONST.packetSize; cnt++) {
              if (this.funcQueue[this.index].mode === OLED_CONST.commandMode) {
                this.i2cSlave.write8(
                  OLED_CONST.commandMode,
                  this.funcQueue[this.index].param
                );
              } else {
                this.i2cSlave.write16(
                  OLED_CONST.dataMode,
                  this.funcQueue[this.index].param
                );
              }
              this.index++;
              if (this.index >= this.funcQueue.length) {
                clearInterval(this.sequence);
                this.sequence = null;
                this.index = 0;
                this.funcQueue = [];
                resolve();
                break;
              }
            }
          }, 1);
        }
      });
    },
    clearDisplay: function() {
      return new Promise((resolve, reject) => {
        if (this.i2cSlave == null) {
          reject("i2cSlave Address does'nt yet open!");
        } else {
          this.clearDisplayQ();
          this.playSequence().then(() => {
            resolve();
          });
        }
      });
    },
    drawString: function(row, col) {
      return new Promise((resolve, reject) => {
        if (this.i2cSlave == null) {
          reject("i2cSlave Address does'nt yet open!");
        } else {
          this.drawStringQ(row, col);
          this.playSequence().then(() => {
            resolve();
          });
        }
      });
    }
  };

  return OledDisplay;

})));
