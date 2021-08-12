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

//% weight=0 color=#000016 icon="\uf030" block="MxColor"
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
     *set fill light brightness
     *@param gamma [0-1] on/off gamma correction; eg: true, false
     *@param light [0-1] on/off fill light; eg: true, false
     *@param lmode [0-1] set motor speed; eg: 0, 1
    */
    //%block="start up the color sensor|gamma correnction is %gamma|fill-light is %light and set in mode:%lmode"
    //%weight=994 inlineInputMode="external" %blockID="MxColor_init"
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
     *@param pwm [0-255] set motor speed; eg: 0, 90
    */
    //%block="set fill light brightness at pwm |%pwm|"
    //%weight=993 %blockID="MxColor_light"
    //% pwm.min=0 pwm.max=255
    export function setLight(pwm: number): void {
        i2cWrite(ColorReg.Device_LIGHT, pwm)
    }
    

    /**
     *read color from sensor
     *@param color [4-10] choose color; eg: 4, 6
    */
    //%block="read |%color| from sensor"
    //%weight=96 %blockID="MxColor_color"
    export function readColor(color: ColorType): number {
        let reg = 0
        reg += <number>color
        return i2cRead(reg)
    }


    /**
     *read grayscale from sensor
    */
    //%block="read grayscale from sensor"
    //%weight=95 %blockID="MxColor_gray"
    export function readGrayscale(): number {
        return i2cRead(ColorReg.Device_GRAY)
    }
    
    /**
     *read color string from sensor
    */
    //%block="read color string from sensor"
    //%weight=94 %blockID="MxColor_number"
    export function readColorNumber(): string {
        let num = i2cRead(ColorReg.Device_NUM_COLOR)
        let name =""
        switch(num){
            case 0:
                name = "Black"
                break
            case 1:
                name = "White"
                break
            case 2:
                name = "Cyan"
                break
            case 3:
                name = "Ocean"
                break
            case 4:
                name = "Blue"
                break
            case 5:
                name = "Violet"
                break
            case 6:
                name = "Magenta"
                break
            case 7:
                name = "Raspberry"
                break
            case 8:
                name = "Red"
            break
            case 9:
                name = "Orange"
                break
            case 10:
                name = "Yellow"
                break
            case 11:
                name = "SpringGreen"
                break
            case 12:
                name = "Green"
                break
            case 13:
                name = "Turquoise"
                break
            default:
                break
        }
        return name
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
