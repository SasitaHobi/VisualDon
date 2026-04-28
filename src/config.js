var baseColor = {
    r: 150,
    g:  50,
    b:  200
}

var mainConfig = {
    flowers: {
        color: {
            r: baseColor.r,
            g: baseColor.g,
            b: baseColor.b,
            brightOff: {
                max: 200,
                min: -200
            },
            colorOff: 20,
            pistilColor: [baseColor.r + 200, baseColor.g + 200, baseColor.b + 55],
        },
        scale: {
            min: 10,
            max: 25
        },
        density: 1,
        petalControlPoints: {
            cp1x: 45,
            cp1y: 0,
            cp2x: 30,
            cp2y: 35,
            cp3x: -35,
            cp3y: -35,
            cp4x: 0,
            cp4y: 0,
        },
        petalCount: {
            min: 1,
            max: 4,
            randomOffset: 1
        },
        pistilRadius: 15,
    },
    stems: {
        angle : {
            max: 32,
            min: 18
        },
        color: {
            r: 130,
            g: 130,
            b: 80
        },
        count: 2,
        randomSeed: 2.25,
        strokeWeight: 2
    }
}