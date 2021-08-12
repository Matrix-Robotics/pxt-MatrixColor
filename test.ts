MxColor.init(1, 1, ColorLightMode.PWM)
basic.forever(function () {
    serial.writeLine(MxColor.readColorNumber())
})
