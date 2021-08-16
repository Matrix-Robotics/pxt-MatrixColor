MxColor.init(ColorLogic.Open, ColorLogic.Open, ColorLightMode.PWM)
MxColor.setLight(200)
basic.forever(function () {
    serial.writeString("R=")
    serial.writeLine("" + (MxColor.readColor(ColorType.R)))
    serial.writeString("G=")
    serial.writeLine("" + (MxColor.readColor(ColorType.G)))
    serial.writeString("B=")
    serial.writeLine("" + (MxColor.readColor(ColorType.B)))
    serial.writeString("C=")
    serial.writeLine("" + (MxColor.readColor(ColorType.C)))
    serial.writeString("M=")
    serial.writeLine("" + (MxColor.readColor(ColorType.M)))
    serial.writeString("Y=")
    serial.writeLine("" + (MxColor.readColor(ColorType.Y)))
    serial.writeString("K=")
    serial.writeLine("" + (MxColor.readColor(ColorType.K)))
    if (MxColor.isColorDetected(0xFFFF00)) {
        serial.writeLine("Yellow!")
    }
})
    