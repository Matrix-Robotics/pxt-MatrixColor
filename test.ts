MxColor.init(true, true, ColorLight.PWM)
basic.forever(function () {
    serial.writeLine(MxColor.readColorNumber())
})
