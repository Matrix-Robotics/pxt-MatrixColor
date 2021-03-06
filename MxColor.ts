enum ColorLightMode
{
    PWM = 0,
    AUTO
}

enum ColorLogic
{
    Close = 0,
    Open
}

enum ColorType
{
    R = 4,
    G,
    B,
    C,
    M,
    Y,
    K
}

//% weight=9 color=#000016 icon="\uf030" block="MxColor"
namespace MxColor{

    const MxColor_ADDR = 0x22

    enum ColorReg
    {
        Device_ID = 1,
        Device_CONFIG,
        Device_LIGHT,
        Device_RED,
        Device_GREEN,
        Device_BLUE,
        Device_CYAN,
        Device_MAGENTA,
        Device_YELLOW,
        Device_BLACK,
        Device_GRAY,
        Device_NUM_COLOR
    }

    /**
     *start up the color sensor
     *@param gamma [0-1] on/off gamma correction; eg: true, false
     *@param light [0-1] on/off fill light; eg: true, false
     *@param lmode [0-1] fill-light Mode; eg: 0, 1
    */
    //%block="start up the color sensor|gamma correnction is %gamma|fill-light is %light and set in mode:%lmode"
    //%weight=194 inlineInputMode="external" %blockID="MxColor_init"
    export function init(gamma: ColorLogic, light: ColorLogic, lmode: ColorLightMode): void {
        let setting = 0x08
        setting = (gamma) ? setting + 4 : setting
        setting = (light) ? setting + 2 : setting
        setting += <number>lmode

        if(i2cRead(ColorReg.Device_ID) == 0x43){
            i2cWrite(ColorReg.Device_CONFIG, 0x10); // reset
            basic.pause(500);
            i2cWrite(ColorReg.Device_CONFIG, setting); // enable
        }
    }

    /**
     *set fill light brightness
     *@param pwm [0-255] fill light brightness, eg: 0, 90
    */
    //%block="set fill light brightness at pwm |%pwm|"
    //%weight=193 %blockID="MxColor_light"
    //% pwm.min=0 pwm.max=255
    export function setLight(pwm: number): void {
        i2cWrite(ColorReg.Device_LIGHT, pwm)
    }
    

    /**
     *read color from sensor
     *@param color [4-10] choose color; eg: 4, 6
    */
    //%block="read |%color| from sensor"
    //%weight=192 %blockID="MxColor_color"
    export function readColor(color: ColorType): number {
        let reg = 0
        reg += <number>color
        return i2cRead(reg)
    }

    /**
     *read grayscale from sensor
    */
    //%block="read grayscale from sensor"
    //%weight=191 %blockID="MxColor_gray"
    export function readGrayscale(): number {
        return i2cRead(ColorReg.Device_GRAY)
    }
    
    /**
     * Checks the color is being detected
     * @param color the color to detect
    */
    //% block="is **color sensor** |detected|%color=colorPicker"
    //% blockId=colorisColorDetectedDetected
    //% blockNamespace=MxColor
    //% weight=99
    export function isColorDetected(color: number): boolean {
        let logic = (readColorNumber() == color) ? true : false
        return logic;
    }

    /**
     * A color enum picker
     * @param color to use, converted to dec, eg: 0x8000FF  //Violet
    */
    //% blockId=colorPicker block="%color" shim=TD_ID
    //% weight=0 blockHidden=1 turnRatio.fieldOptions.decompileLiterals=1
    //% color.fieldEditor="colornumber"
    //% color.fieldOptions.colours='["#FF0000", "#FF8000", "#FFFF00", "#80FF00", "#00FF00", "#00FF80", "#00FFFF", "#0080FF", "#0000FF", "#8000FF", "#FF00FF", "#FF0080", "#000000", "#FFFFFF"]'
    //% color.fieldOptions.columns=2
    export function __colorPicker(color: number): number {
        return color;
    }

    function readColorNumber(): number {
        let num = i2cRead(ColorReg.Device_NUM_COLOR)
        let cmykDec = 0
        switch(num){
            case 0:
                cmykDec = 0x000000  //black
                break
            case 1:
                cmykDec = 0xFFFFFF  //white
                break
            case 2:
                cmykDec = 0x00FFFF  //Cyan
                break
            case 3:
                cmykDec = 0x0080FF  //Ocean
                break
            case 4:
                cmykDec = 0x0000FF  //blue
                break
            case 5:
                cmykDec = 0x8000FF  //Violet
                break
            case 6:
                cmykDec = 0xFF00FF  //Magenta
                break
            case 7:
                cmykDec = 0xFF0080  //Raspberry
                break
            case 8:
                cmykDec = 0xFF0000  //Red
                break
            case 9:
                cmykDec = 0xFF8000  //Orange
                break
            case 10:
                cmykDec = 0xFFFF00  //Yellow
                break
            case 11:
                cmykDec = 0x80FF00  //SpringGreen
                break
            case 12:
                cmykDec = 0X00FF00  //Green
                break
            case 13:
                cmykDec = 0X00FF80  //Turquoise
                break
            default:
                break
        }
        return cmykDec
    }

    function i2cWrite(reg: number, value: number): void {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(MxColor_ADDR, buf)
    }  
    
    function i2cRead(reg: number): number {
        pins.i2cWriteNumber(MxColor_ADDR, reg, NumberFormat.UInt8LE)
        return pins.i2cReadNumber(MxColor_ADDR, NumberFormat.UInt8LE, false)
    }
}
