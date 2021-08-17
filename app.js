function initSplash() {
    gameState = "splash",
    resizeCanvas(),
    1 != audioType || muted || music.play(),
    initStartScreen()
}
function initStartScreen() {
    gameState = "start",
    userInput.removeHitArea("moreGames"),
    1 == audioType && (musicTween && musicTween.kill(), musicTween = TweenLite.to(music, 1, {
        volume: .2,
        ease: "Linear.easeNone"
    })),
    background = new Elements.Background(assetLib.getData("mainBackground"), canvas.width, canvas.height),
    userInput.addHitArea("mute", butEventHandler, null, "rect", {
        aRect: [644, 0, canvas.width, 54]
    },
    !0);
    var a = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [620, 340],
        id: "play"
    },
    b = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [98, 359],
        id: "credits"
    };
    userInput.addHitArea("showMapScreen", butEventHandler, null, "image", a),
    userInput.addHitArea("credits", butEventHandler, null, "image", b);
    var c = new Array(a, b);
    panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("uiElements"), assetLib.getData("position"), assetLib.getData("numbers"), gameState, c, canvas.width, canvas.height),
    panel.startTween1(),
    previousTime = (new Date).getTime(),
    updateStartScreenEvent()
}
function initCreditsScreen() {
    gameState = "credits";
    var a = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [61, 359],
        id: "back"
    };
    userInput.addHitArea("backFromCredits", butEventHandler, null, "image", a);
    var b = new Array(a);
    panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("uiElements"), assetLib.getData("position"), assetLib.getData("numbers"), gameState, b, canvas.width, canvas.height),
    panel.startTween2(),
    previousTime = (new Date).getTime(),
    updateCreditsScreenEvent()
}
function initMapScreen() {
    gameState = "map",
    background = new Elements.Background(assetLib.getData("mainBackground"), canvas.width, canvas.height);
    var a = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [620, 340],
        id: "play"
    },
    b = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [61, 359],
        id: "back"
    },
    c = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [165, 359],
        id: "resetScores"
    };
    userInput.addHitArea("startGame", butEventHandler, null, "image", a),
    userInput.addHitArea("backFromMap", butEventHandler, null, "image", b),
    userInput.addHitArea("resetScores", butEventHandler, null, "image", c);
    var d = new Array(a, b, c),
    e = aMapPointData[8][0],
    f = aMapPointData[8][1];
    totalScore = 0,
    levelTheme = "desert",
    levelNum = 8;
    for (var g = 0; g < aMapPointData.length; g++) if (2 == saveDataHandler.aLevelStore[3 * g]) {
        var h = {
            oImgData: assetLib.getData("uiElements"),
            aPos: aMapPointData[g],
            id: "completedLevel",
            noFloat: !0
        };
        userInput.addHitArea("selectLevel", butEventHandler, {
            id: g
        },
        "image", h),
        d.push(h),
        totalScore += saveDataHandler.aLevelStore[3 * g + 2]
    } else if (1 == saveDataHandler.aLevelStore[3 * g]) {
        levelTheme = "city",
        3 > g ? levelTheme = "forest": g > 5 && (levelTheme = "desert");
        var h = {
            oImgData: assetLib.getData("uiElements"),
            aPos: aMapPointData[g],
            id: levelTheme,
            noFloat: !0
        };
        userInput.addHitArea("selectLevel", butEventHandler, {
            id: g
        },
        "image", h),
        d.push(h),
        e = aMapPointData[g][0],
        f = aMapPointData[g][1],
        levelNum = g,
        g > 1 && (firstPlay = !1)
    }
    for (var g = 0; g < aPowerUpBarData.length; g++) aPowerUpBarData[g] = saveDataHandler.aLevelStore[27 + g];
    winnings = saveDataHandler.aLevelStore[31],
    panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("uiElements"), assetLib.getData("position"), assetLib.getData("numbers"), gameState, d, canvas.width, canvas.height),
    panel.highlight.x = e,
    panel.highlight.y = f,
    panel.oScoreData.totalScore = totalScore,
    panel.startTween1(),
    previousTime = (new Date).getTime(),
    updateMapEvent()
}
function initGame() {
    gameState = "game",
    1 == audioType && (musicTween.kill(), musicTween = TweenLite.to(music, 1, {
        volume: .5,
        ease: "Linear.easeNone"
    })),
    userInput.addHitArea("pause", butEventHandler, null, "rect", {
        aRect: [587, 0, 635, 54]
    },
    !0),
    userInput.addHitArea("steerLeft", butEventHandler, {
        multiTouch: !0
    },
    "rect", {
        aRect: [0, 60, canvas.width / 2, canvas.height]
    },
    !0),
    userInput.addHitArea("steerRight", butEventHandler, {
        multiTouch: !0
    },
    "rect", {
        aRect: [canvas.width / 2, 60, canvas.width, canvas.height]
    },
    !0),
    userInput.addKey("steerRight", butEventHandler, null, 39),
    userInput.addKey("steerLeft", butEventHandler, null, 37),
    road = new Elements.Road(assetLib.getData(levelTheme + "Skyline"), assetLib.getData(levelTheme + "Fog"), assetLib.getData(levelTheme + "Road"), assetLib.getData(levelTheme + "Ground"), levelTheme, levelNum, canvas.width, canvas.height, roadCallback),
    hud = new Elements.Hud(assetLib.getData("hud"), assetLib.getData("uiElements"), assetLib.getData("position"), canvas.width, canvas.height),
    userCar = new Elements.UserCar(assetLib.getData("userCar"), canvas.width, canvas.height),
    enemySpeed = 390 + 7.2 * levelNum,
    raceLength = 4e4 + 1e3 * levelNum,
    maxSpeed = 475 + 6.75 * aPowerUpBarData[1],
    accRate = 4 - .32 * aPowerUpBarData[2],
    turnRate = 1.8 + .375 * aPowerUpBarData[0],
    nitroLength = 3 + .6 * aPowerUpBarData[3],
    speed = 200,
    steerX = 0,
    rightSteer = 0,
    leftSteer = 0,
    curveAmount = 0,
    hillAmount = 0,
    tweenScaleTimer = 0,
    levelScore = 0,
    raceProgress = 0,
    leadProgress = raceLength * leadHeadStart,
    racePos = 19,
    carReleasedNum = 19,
    carReleaseDelay = 0,
    speedDifferencial = 0,
    overtakenInc = 1,
    bridgeDistanceTarg = raceLength / 4,
    startTimer = 0,
    endSoundPlayed = !1,
    offRoad = !1,
    startStage = 0,
    justSkid = !1,
    nitroMode = !1,
    curveTween = TweenMax.to(this, 10, {
        curveAmount: 0,
        ease: "Cubic.easeInOut",
        onComplete: setNewCurve,
        onCompleteParams: [this]
    }),
    hillTween = TweenMax.to(this, 2 * Math.random() + 2, {
        hillAmount: -.5,
        ease: "Quad.easeInOut",
        onComplete: setNewHill,
        onCompleteParams: [this]
    }),
    previousTime = (new Date).getTime(),
    updateGameEvent()
}
function setNewCurve(a) {
    var b = .2 * Math.random() - .1;
    1 * Math.random() > .5 && speed > 400 && (b = 2 * Math.random() - 1),
    "forest" == levelTheme ? a.curveTween = TweenMax.to(a, 2 * Math.random() + 4, {
        curveAmount: b,
        ease: "Cubic.easeInOut",
        onComplete: setNewCurve,
        onCompleteParams: [a]
    }) : "city" == levelTheme ? a.curveTween = TweenMax.to(a, 2 * Math.random() + 3, {
        curveAmount: b,
        ease: "Cubic.easeInOut",
        onComplete: setNewCurve,
        onCompleteParams: [a]
    }) : "desert" == levelTheme && (a.curveTween = TweenMax.to(a, 2 * Math.random() + 2, {
        curveAmount: b,
        ease: "Cubic.easeInOut",
        onComplete: setNewCurve,
        onCompleteParams: [a]
    })),
    a.curveTween.timeScale = speed * speed * speed / (flexMaxSpeed * flexMaxSpeed * flexMaxSpeed)
}
function setNewHill(a) {
    a.hillTween = TweenMax.to(a, 2 * Math.random() + 2, {
        hillAmount: 2 * Math.random() - 1.5,
        ease: "Quad.easeInOut",
        onComplete: setNewHill,
        onCompleteParams: [a]
    }),
    a.hillTween.timeScale = speed * speed * speed / (flexMaxSpeed * flexMaxSpeed * flexMaxSpeed)
}
function butEventHandler(a, b) {
    switch (a) {
    case "langSelect":
        curLang = b.lang,
        ctx.clearRect(0, 0, canvas.width, canvas.height),
        userInput.removeHitArea("langSelect"),
        preAssetLib = new Utils.AssetLoader(curLang, [{
            id: "preloadImage",
            file: "images/" + curLang + "/preloadImage.jpg"
        }], ctx, canvas.width, canvas.height, !1),
        preAssetLib.onReady(initLoadAssets);
        break;
    case "showMapScreen":
        playSound("click"),
        userInput.removeHitArea("showMapScreen"),
        userInput.removeHitArea("moreGames"),
        userInput.removeHitArea("credits"),
        initMapScreen();
        break;
    case "credits":
        playSound("click"),
        userInput.removeHitArea("showMapScreen"),
        userInput.removeHitArea("moreGames"),
        userInput.removeHitArea("credits"),
        initCreditsScreen();
        break;
    case "backFromCredits":
        playSound("click"),
        userInput.removeHitArea("backFromCredits"),
        initStartScreen();
        break;
    case "moreGames":
    case "moreGamesPause":
        break;
    case "startGame":
        playSound("click"),
        userInput.removeHitArea("startGame"),
        userInput.removeHitArea("backFromMap"),
        userInput.removeHitArea("resetScores"),
        userInput.removeHitArea("selectLevel"),
        initGame();
        break;
    case "backFromMap":
        playSound("click"),
        userInput.removeHitArea("startGame"),
        userInput.removeHitArea("backFromMap"),
        userInput.removeHitArea("resetScores"),
        userInput.removeHitArea("selectLevel"),
        initStartScreen();
        break;
    case "selectLevel":
        playSound("click"),
        panel.highlight.x = aMapPointData[b.id][0],
        panel.highlight.y = aMapPointData[b.id][1],
        levelNum = b.id,
        levelTheme = "city",
        3 > levelNum ? levelTheme = "forest": levelNum > 5 && (levelTheme = "desert");
        break;
    case "resetScores":
        playSound("click"),
        saveDataHandler.clearData(),
        saveDataHandler.saveData(),
        userInput.removeHitArea("startGame"),
        userInput.removeHitArea("backFromMap"),
        userInput.removeHitArea("resetScores"),
        userInput.removeHitArea("selectLevel"),
        initMapScreen();
        break;
    case "steerLeft":
        b.isDown ? (leftSteer = 300 + speed, leftSteerSimple = 1, rightSteer = 0, rightSteerSimple = 0) : (leftSteer = 0, leftSteerSimple = 0);
        break;
    case "steerRight":
        b.isDown ? (rightSteer = -(300 + speed), rightSteerSimple = -1, leftSteer = 0, leftSteerSimple = 0) : (rightSteer = 0, rightSteerSimple = 0);
        break;
    case "quitFromLevelEnd":
        playSound("click"),
        userInput.removeHitArea("quitFromLevelEnd"),
        userInput.removeHitArea("upgradeScreen"),
        initStartScreen();
        break;
    case "upgradeScreen":
        playSound("click"),
        userInput.removeHitArea("quitFromLevelEnd"),
        userInput.removeHitArea("upgradeScreen"),
        initUpgradeScreen();
        break;
    case "powerUp0":
        winnings >= aPowerUpButsData[aPowerUpBarData[0]] && aPowerUpBarData[0] < 8 && (playSound("upgrade"), winnings -= aPowerUpButsData[aPowerUpBarData[0]], aPowerUpBarData[0]++, panel.oScoreData = {
            winnings: winnings,
            totalScore: totalScore,
            aPowerUpBarData: aPowerUpBarData
        },
        setPowerUpButs(), saveDataHandler.aLevelStore[27] = aPowerUpBarData[0], saveDataHandler.aLevelStore[31] = winnings, saveDataHandler.saveData());
        break;
    case "powerUp1":
        winnings >= aPowerUpButsData[aPowerUpBarData[1]] && aPowerUpBarData[1] < 8 && (playSound("upgrade"), winnings -= aPowerUpButsData[aPowerUpBarData[1]], aPowerUpBarData[1]++, panel.oScoreData = {
            winnings: winnings,
            totalScore: totalScore,
            aPowerUpBarData: aPowerUpBarData
        },
        setPowerUpButs(), saveDataHandler.aLevelStore[28] = aPowerUpBarData[1], saveDataHandler.aLevelStore[31] = winnings, saveDataHandler.saveData());
        break;
    case "powerUp2":
        winnings >= aPowerUpButsData[aPowerUpBarData[2]] && aPowerUpBarData[2] < 8 && (playSound("upgrade"), winnings -= aPowerUpButsData[aPowerUpBarData[2]], aPowerUpBarData[2]++, panel.oScoreData = {
            winnings: winnings,
            totalScore: totalScore,
            aPowerUpBarData: aPowerUpBarData
        },
        setPowerUpButs(), saveDataHandler.aLevelStore[29] = aPowerUpBarData[2], saveDataHandler.aLevelStore[31] = winnings, saveDataHandler.saveData());
        break;
    case "powerUp3":
        winnings >= aPowerUpButsData[aPowerUpBarData[3]] && aPowerUpBarData[3] < 8 && (playSound("upgrade"), winnings -= aPowerUpButsData[aPowerUpBarData[3]], aPowerUpBarData[3]++, panel.oScoreData = {
            winnings: winnings,
            totalScore: totalScore,
            aPowerUpBarData: aPowerUpBarData
        },
        setPowerUpButs(), saveDataHandler.aLevelStore[30] = aPowerUpBarData[3], saveDataHandler.aLevelStore[31] = winnings, saveDataHandler.saveData());
        break;
    case "nextFromUpgrades":
        playSound("click"),
        userInput.removeHitArea("nextFromUpgrades"),
        userInput.removeHitArea("quitFromUpgrades"),
        userInput.removeHitArea("powerUp0"),
        userInput.removeHitArea("powerUp1"),
        userInput.removeHitArea("powerUp2"),
        userInput.removeHitArea("powerUp3"),
        initMapScreen();
        break;
    case "quitFromUpgrades":
        playSound("click"),
        userInput.removeHitArea("nextFromUpgrades"),
        userInput.removeHitArea("quitFromUpgrades"),
        userInput.removeHitArea("powerUp0"),
        userInput.removeHitArea("powerUp1"),
        userInput.removeHitArea("powerUp2"),
        userInput.removeHitArea("powerUp3"),
        initStartScreen();
        break;
    case "mute":
        playSound("click"),
        toggleMute();
        break;
    case "pause":
    case "resumeFromPause":
        playSound("click"),
        toggleManualPause();
        break;
    case "quitFromPause":
        playSound("click"),
        toggleManualPause(),
        userInput.removeHitArea("pause"),
        userInput.removeHitArea("steerLeft"),
        userInput.removeHitArea("steerRight"),
        userInput.removeHitArea("steerRight"),
        userInput.removeHitArea("steerLeft"),
        userInput.removeHitArea("quitFromPause"),
        userInput.removeHitArea("resumeFromPause"),
        userInput.removeHitArea("moreGamesPause"),
        curveTween.kill(),
        hillTween.kill(),
        levelScore = 0,
        initStartScreen()
    }
}
function initLevelComplete() {
    gameState = "levelComplete",
    1 == audioType && (musicTween.kill(), musicTween = TweenLite.to(music, 2, {
        volume: .2,
        ease: "Linear.easeNone"
    })),
    curveTween.kill(),
    hillTween.kill(),
    background = new Elements.Background(assetLib.getData("finishBackground"), canvas.width, canvas.height),
    userInput.removeHitArea("pause"),
    userInput.removeHitArea("steerLeft"),
    userInput.removeHitArea("steerRight");
    var a = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [620, 340],
        id: "play"
    },
    b = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [98, 359],
        id: "quit"
    };
    userInput.addHitArea("upgradeScreen", butEventHandler, null, "image", a),
    userInput.addHitArea("quitFromLevelEnd", butEventHandler, null, "image", b);
    var c = new Array(a, b);
    panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("uiElements"), assetLib.getData("position"), assetLib.getData("numbers"), gameState, c, canvas.width, canvas.height),
    panel.startTween1(),
    levelScore += 50,
    levelScore += 300 * (levelNum + 1),
    levelScore += 200 * (20 - racePos),
    2 == racePos ? levelScore += 250 : 1 == racePos ? levelScore += 500 : 0 == racePos && (levelScore += 1e3),
    levelScore = Math.max(levelScore, 100),
    totalScore += levelScore,
    winnings += Math.round(levelScore / 10),
    panel.oScoreData = {
        racePos: racePos,
        winnings: Math.round(levelScore / 10),
        levelScore: levelScore,
        totalScore: totalScore
    },
    saveDataHandler.aLevelStore[3 * levelNum] = 2,
    saveDataHandler.aLevelStore[3 * levelNum + 1] > racePos && (saveDataHandler.aLevelStore[3 * levelNum + 1] = racePos),
    saveDataHandler.aLevelStore[3 * levelNum + 2] < levelScore && (saveDataHandler.aLevelStore[3 * levelNum + 2] = levelScore),
    saveDataHandler.aLevelStore[31] = winnings,
    8 > levelNum && 0 == saveDataHandler.aLevelStore[3 * (levelNum + 1)] && (saveDataHandler.aLevelStore[3 * (levelNum + 1)] = 1),
    saveDataHandler.saveData(),
    previousTime = (new Date).getTime(),
    updateLevelComplete();
    loadmeover();
    var mescore = levelScore;
    var mefont = "ио";
    var melevel = "";
    Getscore(mescore, 387, mefont, melevel);
}
function initUpgradeScreen() {
    gameState = "upgrade",
    background = new Elements.Background(assetLib.getData("upgradeBackground"), canvas.width, canvas.height);
    var a = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [620, 340],
        id: "play"
    },
    b = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [98, 359],
        id: "quit"
    },
    c = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [141, 248],
        id: "cost" + aPowerUpButsData[aPowerUpBarData[0]] + "On",
        num: 0,
        noFloat: !0
    },
    d = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [311, 178],
        id: "cost" + aPowerUpButsData[aPowerUpBarData[1]] + "On",
        num: 1,
        noFloat: !0
    },
    e = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [481, 248],
        id: "cost" + aPowerUpButsData[aPowerUpBarData[2]] + "On",
        num: 2,
        noFloat: !0
    },
    f = {
        oImgData: assetLib.getData("uiButs"),
        aPos: [651, 178],
        id: "cost" + aPowerUpButsData[aPowerUpBarData[3]] + "On",
        num: 3,
        noFloat: !0
    };
    userInput.addHitArea("nextFromUpgrades", butEventHandler, null, "image", a),
    userInput.addHitArea("quitFromUpgrades", butEventHandler, null, "image", b),
    userInput.addHitArea("powerUp0", butEventHandler, null, "image", c),
    userInput.addHitArea("powerUp1", butEventHandler, null, "image", d),
    userInput.addHitArea("powerUp2", butEventHandler, null, "image", e),
    userInput.addHitArea("powerUp3", butEventHandler, null, "image", f);
    var g = new Array(c, d, e, f, a, b);
    panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("uiElements"), assetLib.getData("position"), assetLib.getData("numbers"), gameState, g, canvas.width, canvas.height),
    setPowerUpButs(),
    panel.startTween1(),
    panel.oScoreData = {
        winnings: winnings,
        totalScore: totalScore,
        aPowerUpBarData: aPowerUpBarData
    },
    previousTime = (new Date).getTime(),
    updateUpgradeScreen()
}
function setPowerUpButs() {
    panel.aButs[0].id = aPowerUpButsData[aPowerUpBarData[0]] > winnings || aPowerUpBarData[0] >= 8 ? "cost" + aPowerUpButsData[aPowerUpBarData[0]] + "Off": "cost" + aPowerUpButsData[aPowerUpBarData[0]] + "On",
    panel.aButs[1].id = aPowerUpButsData[aPowerUpBarData[1]] > winnings || aPowerUpBarData[1] >= 8 ? "cost" + aPowerUpButsData[aPowerUpBarData[1]] + "Off": "cost" + aPowerUpButsData[aPowerUpBarData[1]] + "On",
    panel.aButs[2].id = aPowerUpButsData[aPowerUpBarData[2]] > winnings || aPowerUpBarData[2] >= 8 ? "cost" + aPowerUpButsData[aPowerUpBarData[2]] + "Off": "cost" + aPowerUpButsData[aPowerUpBarData[2]] + "On",
    panel.aButs[3].id = aPowerUpButsData[aPowerUpBarData[3]] > winnings || aPowerUpBarData[3] >= 8 ? "cost" + aPowerUpButsData[aPowerUpBarData[3]] + "Off": "cost" + aPowerUpButsData[aPowerUpBarData[3]] + "On"
}
function roadCallback(a, b) {
    switch ("undefined" == typeof b && (b = null), a) {
    case "hitEnemyCar":
        nitroMode && (speed = maxSpeed, nitroMode = !1),
        speed *= .75,
        steerX += 1e3 * b.bounceX,
        4 >= startTimer && (levelScore -= 100),
        playSound("crash" + Math.ceil(3 * Math.random()));
        break;
    case "hitNitro":
        nitroMode = !0,
        setNewCurve(this),
        nitroTimer = 0,
        playSound("nitroStart"),
        4 >= startTimer && (levelScore += 500)
    }
}
function updateGameEvent() {
    if (!manualPause && !rotatePause && "game" == gameState) {
        var a = getDelta();
        if (road.steerX > 500 / road.roadScaleMultiplier || road.steerX < -500 / road.roadScaleMultiplier ? (speed = Math.max(speed -= 250 * a, 200), 4 >= startTimer && (levelScore -= Math.round(25 * a)), offRoad || (playSound("offRoad"), offRoad = !0)) : (offRoad = !1, nitroMode ? (flexMaxSpeed = nitroSpeed - Math.abs(steerX) / 4, speed += a * ((flexMaxSpeed - speed) / 3), nitroTimer += a, nitroTimer > nitroLength && (nitroMode = !1, playSound("nitroEnd"))) : (flexMaxSpeed = maxSpeed - Math.abs(steerX) / (3 + turnRate), speed += a * ((flexMaxSpeed - speed) / accRate))), hud.speed = Math.round(speed / 4), raceProgress += speed * a, leadProgress += enemySpeed * a, hud.raceProgress = raceProgress / raceLength, carReleaseDelay += speed * a, raceProgress > raceLength ? (road.bridgeType = 5, road.bridgeRow = 0, hud.raceProgress = 1) : raceProgress > bridgeDistanceTarg && (road.bridgeType = 4, road.bridgeRow = 0, bridgeDistanceTarg += raceLength / 4), carReleasedNum > 0 && road.freeToAddCar() && raceProgress > leadProgress - carReleasedNum / 19 * .9 * leadProgress && (road.addEnemyCar(), carReleasedNum--, overtakenInc = 1, carReleaseDelay = 0), 19 > racePos && enemySpeed > speed ? (speedDifferencial += enemySpeed - speed, speedDifferencial > 5e3 * overtakenInc && (overtakenInc++, road.addEnemyCar(!1), 4 >= startTimer && (racePos++, playSound("undertake")), speedDifferencial = 0)) : speedDifferencial = 0, tweenScaleTimer += a, tweenScaleTimer > .5 && (tweenScaleTimer = 0, curveTween.timeScale = hillTween.timeScale = speed * speed * speed / (maxSpeed * maxSpeed * maxSpeed)), targSteerX = rightSteer + leftSteer + curveAmount * speed * (1.3 + (.96 - turnRate / 5)), steerX += (targSteerX - steerX) * turnRate * a, !justSkid && (steerX > 525 || -525 > steerX) ? (playSound("skid" + Math.ceil(3 * Math.random())), justSkid = !0) : steerX > -100 && 100 > steerX && (justSkid = !1), road.update(speed, steerX, curveAmount, hillAmount, a), road.render(ctx), userCar.update(speed, steerX, curveAmount, hillAmount, rightSteerSimple + leftSteerSimple, a), userCar.render(ctx), hud.render(ctx), firstPlay) {
            var b = assetLib.getData("uiElements"),
            c = "tutorial0";
            0 == Math.floor(startTimer) % 2 && (c = "tutorial1");
            var d = b.oData.oAtlasData[c].x,
            e = b.oData.oAtlasData[c].y,
            f = b.oData.oAtlasData[c].width,
            g = b.oData.oAtlasData[c].height;
            ctx.drawImage(b.img, d, e, f, g, 0, 70, f, g),
            startTimer += a,
            startTimer > 4 && (firstPlay = !1, playSound("start2"), startTimer = 4)
        } else if (2 > startTimer) {
            var b = assetLib.getData("uiElements");
            0 == startStage ? (playSound("start1"), startStage = 1) : 1 == startStage && 2 * startTimer > 1 ? (playSound("start1"), startStage = 2) : 2 == startStage && 2 * startTimer > 2 ? (playSound("start1"), startStage = 3) : 3 == startStage && 2 * startTimer > 3 && (playSound("start2"), startStage = 4);
            var d = b.oData.oAtlasData["start" + Math.floor(2 * startTimer)].x,
            e = b.oData.oAtlasData["start" + Math.floor(2 * startTimer)].y,
            f = b.oData.oAtlasData["start" + Math.floor(2 * startTimer)].width,
            g = b.oData.oAtlasData["start" + Math.floor(2 * startTimer)].height;
            ctx.drawImage(b.img, d, e, f, g, canvas.width / 2 - f / 2, 75, f, g),
            startTimer += a,
            startTimer >= 2 && (setNewCurve(this), setNewHill(this), startTimer = 4)
        } else if (1 == hud.raceProgress) {
            var b = assetLib.getData("uiElements"),
            d = b.oData.oAtlasData.finish.x,
            e = b.oData.oAtlasData.finish.y,
            f = b.oData.oAtlasData.finish.width,
            g = b.oData.oAtlasData.finish.height;
            ctx.drawImage(b.img, d, e, f, g, canvas.width / 2 - f / 2, 100 + 10 * Math.sin(10 * startTimer), f, g),
            startTimer += a,
            endSoundPlayed || (playSound("raceEnd"), endSoundPlayed = !0),
            startTimer > 8 && initLevelComplete()
        }
        renderMuteBut(),
        requestAnimFrame(updateGameEvent)
    }
}
function updateCreditsScreenEvent() {
    if (!rotatePause && "credits" == gameState) {
        var a = getDelta();
        panel.update(a),
        panel.render(ctx),
        renderMuteBut(),
        requestAnimFrame(updateCreditsScreenEvent)
    }
}
function updateLevelComplete() {
    if (!rotatePause && "levelComplete" == gameState) {
        var a = getDelta();
        background.updateScroll(a),
        background.renderScroll(ctx),
        panel.update(a),
        panel.render(ctx),
        renderMuteBut(),
        requestAnimFrame(updateLevelComplete)
    }
}
function updateUpgradeScreen() {
    if (!rotatePause && "upgrade" == gameState) {
        var a = getDelta();
        background.render(ctx),
        panel.update(a),
        panel.render(ctx),
        renderMuteBut(),
        requestAnimFrame(updateUpgradeScreen)
    }
}
function updateSplashScreenEvent() {
    if (!rotatePause && "splash" == gameState) {
        var a = getDelta();
        if (splashTimer += a, splashTimer > 2.5) return 1 != audioType || muted || music.play(),
        initStartScreen(),
        void 0;
        splash.render(ctx, a),
        requestAnimFrame(updateSplashScreenEvent)
    }
}
function updateStartScreenEvent() {
    if (!rotatePause && "start" == gameState) {
        var a = getDelta();
        background.updateScroll(a),
        background.renderScroll(ctx),
        panel.update(a),
        panel.render(ctx),
        renderMuteBut(),
        requestAnimFrame(updateStartScreenEvent)
    }
}
function updateMapEvent() {
    if (!rotatePause && "map" == gameState) {
        var a = getDelta();
        background.updateScroll(a),
        background.renderScroll(ctx),
        panel.update(a),
        panel.render(ctx),
        renderMuteBut(),
        requestAnimFrame(updateMapEvent)
    }
}
function getDelta() {
    var a = (new Date).getTime(),
    b = (a - previousTime) / 1e3;
    return previousTime = a,
    b > .5 && (b = 0),
    b
}
function checkSpriteCollision(a, b) {
    var c = a.x,
    d = a.y,
    e = b.x,
    f = b.y,
    g = (c - e) * (c - e) + (d - f) * (d - f),
    h = a.radius * b.radius;
    return h > g ? !0 : !1
}
function getScaleImageToMax(a, b) {
    var c;
    return c = a.isSpriteSheet ? b[0] / a.oData.spriteWidth < b[1] / a.oData.spriteHeight ? Math.min(b[0] / a.oData.spriteWidth, 1) : Math.min(b[1] / a.oData.spriteHeight, 1) : b[0] / a.img.width < b[1] / a.img.height ? Math.min(b[0] / a.img.width, 1) : Math.min(b[1] / a.img.height, 1)
}
function getCentreFromTopLeft(a, b, c) {
    var d = new Array;
    return d.push(a[0] + b.oData.spriteWidth / 2 * c),
    d.push(a[1] + b.oData.spriteHeight / 2 * c),
    d
}
function loadPreAssets() {
    aLangs.length > 1 ? (preAssetLib = new Utils.AssetLoader(curLang, [{
        id: "langSelect",
        file: "images/langSelect.jpg"
    }], ctx, canvas.width, canvas.height, !1), preAssetLib.onReady(initLangSelect)) : (curLang = aLangs[0], preAssetLib = new Utils.AssetLoader(curLang, [{
        id: "preloadImage",
        file: "images/" + curLang + "/preloadImage.jpg"
    }], ctx, canvas.width, canvas.height, !1), preAssetLib.onReady(initLoadAssets))
}
function initLangSelect() {
    var a = preAssetLib.getData("langSelect");
    ctx.drawImage(a.img, canvas.width / 2 - a.img.width / 2, canvas.height / 2 - a.img.height / 2);
    for (var b = 140,
    c = 0; c < aLangs.length; c++) {
        var d = canvas.width / 2 - b * aLangs.length / 2 + c * b,
        e = canvas.height / 2 - b / 2;
        userInput.addHitArea("langSelect", butEventHandler, {
            lang: aLangs[c]
        },
        "rect", {
            aRect: [d, e, d + b, e + 140]
        })
    }
}
function initLoadAssets() {
    var a = preAssetLib.getData("preloadImage");
    ctx.drawImage(a.img, 0, 0),
    loadAssets()
}
function loadAssets() {
    assetLib = new Utils.AssetLoader(curLang, [{
        id: "mainBackground",
        file: "images/mainBackground.jpg"
    },
    {
        id: "finishBackground",
        file: "images/finishBackground.jpg"
    },
    {
        id: "upgradeBackground",
        file: "images/upgradeBackground.jpg"
    },
    {
        id: "rotateDeviceMessage",
        file: "images/rotateDeviceMessage.jpg"
    },
    {
        id: "splash",
        file: "images/splashScreen.jpg"
    },
    {
        id: "numbers",
        file: "images/numbers_41x47.png"
    },
    {
        id: "forestRoad",
        file: "images/forestRoad.jpg"
    },
    {
        id: "cityRoad",
        file: "images/cityRoad.jpg"
    },
    {
        id: "desertRoad",
        file: "images/desertRoad.jpg"
    },
    {
        id: "forestSkyline",
        file: "images/forestSkyline.jpg"
    },
    {
        id: "forestGround",
        file: "images/forestGround.jpg"
    },
    {
        id: "forestFog",
        file: "images/forestFog.png"
    },
    {
        id: "citySkyline",
        file: "images/citySkyline.jpg"
    },
    {
        id: "cityGround",
        file: "images/cityGround.jpg"
    },
    {
        id: "cityFog",
        file: "images/cityFog.png"
    },
    {
        id: "desertSkyline",
        file: "images/desertSkyline.jpg"
    },
    {
        id: "desertGround",
        file: "images/desertGround.jpg"
    },
    {
        id: "desertFog",
        file: "images/desertFog.png"
    },
    {
        id: "hud",
        file: "images/hud_700x400.png"
    },
    {
        id: "uiButs",
        file: "images/" + curLang + "/uiButs.png",
        oAtlasData: {
            play: {
                x: 0,
                y: 258,
                width: 167,
                height: 123
            },
            credits: {
                x: 0,
                y: 0,
                width: 186,
                height: 84
            },
            moreGames: {
                x: 0,
                y: 86,
                width: 186,
                height: 84
            },
            back: {
                x: 169,
                y: 258,
                width: 111,
                height: 86
            },
            quit: {
                x: 0,
                y: 172,
                width: 186,
                height: 84
            },
            cost100On: {
                x: 282,
                y: 242,
                width: 95,
                height: 75
            },
            cost250On: {
                x: 188,
                y: 165,
                width: 95,
                height: 75
            },
            cost500On: {
                x: 282,
                y: 319,
                width: 95,
                height: 75
            },
            cost1000On: {
                x: 188,
                y: 88,
                width: 95,
                height: 75
            },
            resetScores: {
                x: 188,
                y: 0,
                width: 111,
                height: 86
            },
            cost100Off: {
                x: 285,
                y: 88,
                width: 93,
                height: 73
            },
            cost250Off: {
                x: 169,
                y: 346,
                width: 93,
                height: 73
            },
            cost500Off: {
                x: 301,
                y: 0,
                width: 93,
                height: 73
            },
            cost1000Off: {
                x: 285,
                y: 163,
                width: 93,
                height: 73
            }
        }
    },
    {
        id: "scenery",
        file: "images/scenery.png",
        oAtlasData: {
            forest0: {
                x: 529,
                y: 286,
                width: 201,
                height: 244
            },
            forest1: {
                x: 696,
                y: 0,
                width: 118,
                height: 223
            },
            forest2: {
                x: 0,
                y: 780,
                width: 154,
                height: 87
            },
            nitro: {
                x: 294,
                y: 780,
                width: 109,
                height: 111
            },
            city0: {
                x: 528,
                y: 542,
                width: 204,
                height: 204
            },
            city1: {
                x: 156,
                y: 780,
                width: 136,
                height: 112
            },
            city2: {
                x: 734,
                y: 414,
                width: 102,
                height: 214
            },
            desert0: {
                x: 732,
                y: 225,
                width: 117,
                height: 187
            },
            desert1: {
                x: 734,
                y: 630,
                width: 98,
                height: 226
            },
            desert2: {
                x: 528,
                y: 748,
                width: 173,
                height: 125
            },
            start: {
                x: 0,
                y: 542,
                width: 526,
                height: 236
            },
            finish: {
                x: 0,
                y: 286,
                width: 527,
                height: 254
            },
            bridge: {
                x: 0,
                y: 0,
                width: 694,
                height: 284
            }
        }
    },
    {
        id: "uiElements",
        file: "images/" + curLang + "/uiElements.png",
        oAtlasData: {
            needle: {
                x: 398,
                y: 664,
                width: 66,
                height: 24
            },
            helmet: {
                x: 704,
                y: 717,
                width: 38,
                height: 35
            },
            completedLevel: {
                x: 702,
                y: 211,
                width: 92,
                height: 93
            },
            forest: {
                x: 594,
                y: 664,
                width: 108,
                height: 109
            },
            city: {
                x: 702,
                y: 0,
                width: 108,
                height: 109
            },
            desert: {
                x: 596,
                y: 528,
                width: 108,
                height: 109
            },
            levelHighlight: {
                x: 702,
                y: 111,
                width: 98,
                height: 98
            },
            finish: {
                x: 0,
                y: 528,
                width: 396,
                height: 163
            },
            start0: {
                x: 396,
                y: 693,
                width: 196,
                height: 134
            },
            start1: {
                x: 198,
                y: 693,
                width: 196,
                height: 134
            },
            start2: {
                x: 398,
                y: 528,
                width: 196,
                height: 134
            },
            start3: {
                x: 0,
                y: 693,
                width: 196,
                height: 134
            },
            tutorial0: {
                x: 0,
                y: 0,
                width: 700,
                height: 262
            },
            tutorial1: {
                x: 0,
                y: 264,
                width: 700,
                height: 262
            },
            upgrade0: {
                x: 704,
                y: 679,
                width: 77,
                height: 36
            },
            upgrade1: {
                x: 702,
                y: 386,
                width: 78,
                height: 38
            },
            upgrade2: {
                x: 702,
                y: 426,
                width: 78,
                height: 38
            },
            upgrade3: {
                x: 702,
                y: 306,
                width: 78,
                height: 38
            },
            upgrade4: {
                x: 702,
                y: 466,
                width: 78,
                height: 38
            },
            upgrade5: {
                x: 704,
                y: 639,
                width: 78,
                height: 38
            },
            upgrade6: {
                x: 675,
                y: 775,
                width: 78,
                height: 38
            },
            upgrade7: {
                x: 702,
                y: 346,
                width: 78,
                height: 38
            },
            upgrade8: {
                x: 594,
                y: 775,
                width: 79,
                height: 38
            }
        }
    },
    {
        id: "panels",
        file: "images/" + curLang + "/panels_700x400.png"
    },
    {
        id: "position",
        file: "images/position_58x42.png"
    },
    {
        id: "muteBut",
        file: "images/mute_55x55.png"
    },
    {
        id: "userCar",
        file: "images/userCar_122x82.png"
    },
    {
        id: "enemyCar",
        file: "images/enemyCar_122x82.png"
    }], ctx, canvas.width, canvas.height),
    assetLib.onReady(initSplash)
}
function resizeCanvas() {
    var a = window.innerWidth,
    b = window.innerHeight;
    a > 480 && (a -= 1, b -= 1),
    window.innerWidth < window.innerHeight && isMobile ? ("loading" != gameState && rotatePauseOn(), canvas.style.width = a + "px", canvas.style.height = a / canvas.width * canvas.height + "px", canvasX = 0, canvasY = (b - a / canvas.width * canvas.height) / 2, canvasScaleX = canvasScaleY = canvas.width / a, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px") : isMobile ? (rotatePause && rotatePauseOff(), canvasX = canvasY = 0, canvasScaleX = canvas.width / a, canvasScaleY = canvas.height / b, canvas.style.width = a + "px", canvas.style.height = b + "px", div.style.marginTop = "0px", div.style.marginLeft = "0px") : (rotatePause && rotatePauseOff(), a / canvas.width < b / canvas.height ? (canvas.style.width = a + "px", canvas.style.height = a / canvas.width * canvas.height + "px", canvasX = 0, canvasY = (b - a / canvas.width * canvas.height) / 2, canvasScaleX = canvasScaleY = canvas.width / a, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px") : (canvas.style.width = b / canvas.height * canvas.width + "px", canvas.style.height = b + "px", canvasX = (a - b / canvas.height * canvas.width) / 2, canvasY = 0, canvasScaleX = canvasScaleY = canvas.height / b, div.style.marginTop = canvasY + "px", div.style.marginLeft = canvasX + "px")),
    userInput.setCanvas(canvasX, canvasY, canvasScaleX, canvasScaleY)
}
function playSound(a) {
    1 == audioType && sound.play(a)
}
function toggleMute() {
    muted = !muted,
    1 == audioType ? muted ? Howler.mute() : Howler.unmute() : 2 == audioType && (muted ? music.pause() : music.play()),
    renderMuteBut()
}
function renderMuteBut() {
    if (0 != audioType) {
        var a = assetLib.getData("muteBut"),
        b = 0;
        muted && (b = 1);
        var c = b * a.oData.spriteWidth % a.img.width,
        d = Math.floor(b / (a.img.width / a.oData.spriteWidth)) * a.oData.spriteHeight;
        ctx.drawImage(a.img, c, d, a.oData.spriteWidth, a.oData.spriteHeight, 645, 2, a.oData.spriteWidth, a.oData.spriteHeight)
    }
}
function toggleManualPause() {
    if (manualPause) manualPause = !1,
    userInput.removeHitArea("quitFromPause"),
    userInput.removeHitArea("resumeFromPause"),
    userInput.removeHitArea("moreGamesPause"),
    pauseCoreOff();
    else {
        manualPause = !0,
        pauseCoreOn();
        var a = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [140, canvas.height / 2],
            id: "quit"
        },
        b = {
            oImgData: assetLib.getData("uiButs"),
            aPos: [canvas.width / 2, canvas.height / 2],
            id: "play"
        },
        c = new Array(a, b);
        userInput.addHitArea("quitFromPause", butEventHandler, null, "image", a),
        userInput.addHitArea("resumeFromPause", butEventHandler, null, "image", b),
        panel = new Elements.Panel(assetLib.getData("panels"), assetLib.getData("uiElements"), assetLib.getData("position"), assetLib.getData("numbers"), "pause", c, canvas.width, canvas.height),
        panel.render(ctx),
        userInput.addHitArea("pause", butEventHandler, null, "rect", {
            aRect: [587, 0, 635, 54]
        },
        !0)
    }
}
function rotatePauseOn() {
    rotatePause = !0,
    ctx.drawImage(assetLib.getImg("rotateDeviceMessage"), 0, 0),
    userInput.pauseIsOn = !0,
    pauseCoreOn()
}
function rotatePauseOff() {
    rotatePause = !1,
    userInput.removeHitArea("quitFromPause"),
    userInput.removeHitArea("resumeFromPause"),
    userInput.removeHitArea("moreGamesPause"),
    pauseCoreOff()
}
function pauseCoreOn() {
    switch (1 == audioType ? Howler.mute() : 2 == audioType && music.pause(), gameState) {
    case "start":
        break;
    case "help":
        break;
    case "game":
        userInput.removeHitArea("steerLeft"),
        userInput.removeHitArea("steerRight"),
        curveTween.pause(),
        hillTween.pause();
        break;
    case "end":
    }
}
function pauseCoreOff() {
    switch (1 == audioType ? muted || Howler.unmute() : 2 == audioType && (muted || music.play()), previousTime = (new Date).getTime(), userInput.pauseIsOn = !1, gameState) {
    case "splash":
        updateSplashScreenEvent();
        break;
    case "start":
        initStartScreen();
        break;
    case "credits":
        initCreditsScreen();
        break;
    case "map":
        initMapScreen();
        break;
    case "game":
        manualPause = !1,
        userInput.addHitArea("steerLeft", butEventHandler, {
            multiTouch: !0
        },
        "rect", {
            aRect: [0, 60, canvas.width / 2, canvas.height]
        },
        !0),
        userInput.addHitArea("steerRight", butEventHandler, {
            multiTouch: !0
        },
        "rect", {
            aRect: [canvas.width / 2, 60, canvas.width, canvas.height]
        },
        !0),
        userInput.addKey("steerRight", butEventHandler, null, 39),
        userInput.addKey("steerLeft", butEventHandler, null, 37),
        curveTween.resume(),
        hillTween.resume(),
        updateGameEvent();
        break;
    case "levelComplete":
        initLevelComplete();
        break;
    case "upgrade":
        initUpgradeScreen()
    }
}
var Utils; !
function(a) {
    var b = function() {
        function a(a, b, c, d, e, f) {
            "undefined" == typeof f && (f = !0),
            this.oAssetData = {},
            this.assetsLoaded = 0,
            this.totalAssets = b.length,
            this.ctx = c,
            this.canvasWidth = d,
            this.canvasHeight = e,
            this.showBar = f,
            this.topLeftX = this.canvasWidth / 2 - d / 8,
            this.topLeftY = 230,
            this.showBar && (ctx.strokeStyle = "#333646", ctx.lineWidth = 2, ctx.fillStyle = "#F5A343", ctx.moveTo(this.topLeftX, this.topLeftY), ctx.lineTo(this.topLeftX + d / 4, this.topLeftY + 0), ctx.lineTo(this.topLeftX + d / 4, this.topLeftY + 20), ctx.lineTo(this.topLeftX + 0, this.topLeftY + 20), ctx.lineTo(this.topLeftX + 0, this.topLeftY + 0), ctx.stroke());
            for (var g = 0; g < b.length; g++) this.loadImage(b[g])
        }
        return a.prototype.loadImage = function(a) {
            var b = this,
            c = new Image;
            c.onload = function() {
                b.oAssetData[a.id] = {},
                b.oAssetData[a.id].img = c,
                b.oAssetData[a.id].oData = {};
                var d = b.getSpriteSize(a.file);
                0 != d[0] ? (b.oAssetData[a.id].oData.spriteWidth = d[0], b.oAssetData[a.id].oData.spriteHeight = d[1]) : (b.oAssetData[a.id].oData.spriteWidth = b.oAssetData[a.id].img.width, b.oAssetData[a.id].oData.spriteHeight = b.oAssetData[a.id].img.height),
                a.oAnims && (b.oAssetData[a.id].oData.oAnims = a.oAnims),
                a.oAtlasData && (b.oAssetData[a.id].oData.oAtlasData = a.oAtlasData),
                ++b.assetsLoaded,
                b.showBar && ctx.fillRect(b.topLeftX + 2, b.topLeftY + 2, (b.canvasWidth / 4 - 4) / b.totalAssets * b.assetsLoaded, 16),
                b.checkLoadComplete()
            },
            c.src = a.file
        },
        a.prototype.getSpriteSize = function(a) {
            for (var b = new Array,
            c = "",
            d = "",
            e = 0,
            f = a.lastIndexOf("."), g = !0; g;) f--,
            0 == e && this.isNumber(a.charAt(f)) ? c = a.charAt(f) + c: 0 == e && c.length > 0 && "x" == a.charAt(f) ? (f--, e = 1, d = a.charAt(f) + d) : 1 == e && this.isNumber(a.charAt(f)) ? d = a.charAt(f) + d: 1 == e && d.length > 0 && "_" == a.charAt(f) ? (g = !1, b = [parseInt(d), parseInt(c)]) : (g = !1, b = [0, 0]);
            return b
        },
        a.prototype.isNumber = function(a) {
            return ! isNaN(parseFloat(a)) && isFinite(a)
        },
        a.prototype.checkLoadComplete = function() {
            this.assetsLoaded == this.totalAssets && this.loadedCallback()
        },
        a.prototype.onReady = function(a) {
            this.loadedCallback = a
        },
        a.prototype.getImg = function(a) {
            return this.oAssetData[a].img
        },
        a.prototype.getData = function(a) {
            return this.oAssetData[a]
        },
        a
    } ();
    a.AssetLoader = b
} (Utils || (Utils = {}));
var Utils; !
function(a) {
    var b = function() {
        function a(a, b, c, d) {
            this.x = 0,
            this.y = 0,
            this.rotation = 0,
            this.radius = 10,
            this.removeMe = !1,
            this.frameInc = 0,
            this.animType = "loop",
            this.offsetX = 0,
            this.offsetY = 0,
            this.scaleX = 1,
            this.scaleY = 1,
            this.oImgData = a,
            this.oAnims = this.oImgData.oData.oAnims,
            this.fps = b,
            this.radius = c,
            this.animId = d,
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2),
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2)
        }
        return a.prototype.updateAnimation = function(a) {
            this.frameInc += this.fps * a
        },
        a.prototype.changeImgData = function(a, b) {
            this.oImgData = a,
            this.oAnims = this.oImgData.oData.oAnims,
            this.animId = b,
            this.centreX = Math.round(this.oImgData.oData.spriteWidth / 2),
            this.centreY = Math.round(this.oImgData.oData.spriteHeight / 2),
            this.resetAnim()
        },
        a.prototype.resetAnim = function() {
            this.frameInc = 0
        },
        a.prototype.setFrame = function(a) {
            this.fixedFrame = a
        },
        a.prototype.setAnimType = function(a, b, c) {
            switch ("undefined" == typeof c && (c = !0), this.animId = b, this.animType = a, c && this.resetAnim(), a) {
            case "loop":
                break;
            case "once":
                this.maxIdx = this.oAnims[this.animId].length - 1
            }
        },
        a.prototype.render = function(a) {
            if (a.save(), a.translate(this.x, this.y), a.rotate(this.rotation), a.scale(this.scaleX, this.scaleY), null != this.animId) {
                var b = this.oAnims[this.animId].length,
                c = Math.floor(this.frameInc);
                this.curFrame = this.oAnims[this.animId][c % b];
                var d = this.curFrame * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
                e = Math.floor(this.curFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
                if ("once" == this.animType && c > this.maxIdx) {
                    if (this.fixedFrame = this.oAnims[this.animId][b - 1], this.animId = null, null != this.animEndedFunc) return this.animEndedFunc(),
                    a.restore(),
                    void 0;
                    var d = this.fixedFrame * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
                    e = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight
                }
            } else var d = this.fixedFrame * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
            e = Math.floor(this.fixedFrame / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            a.drawImage(this.oImgData.img, d, e, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.centreX + this.offsetX, -this.centreY + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight),
            a.restore()
        },
        a
    } ();
    a.AnimSprite = b
} (Utils || (Utils = {}));
var Utils; !
function(a) {
    var b = function() {
        function a(a, b, c) {
            "undefined" == typeof c && (c = 0),
            this.x = 0,
            this.y = 0,
            this.rotation = 0,
            this.radius = 10,
            this.removeMe = !1,
            this.offsetX = 0,
            this.offsetY = 0,
            this.scaleX = 1,
            this.scaleY = 1,
            this.oImgData = a,
            this.radius = b,
            this.setFrame(c)
        }
        return a.prototype.setFrame = function(a) {
            this.frameNum = a
        },
        a.prototype.render = function(a) {
            a.save(),
            a.translate(this.x, this.y),
            a.rotate(this.rotation),
            a.scale(this.scaleX, this.scaleY);
            var b = this.frameNum * this.oImgData.oData.spriteWidth % this.oImgData.img.width,
            c = Math.floor(this.frameNum / (this.oImgData.img.width / this.oImgData.oData.spriteWidth)) * this.oImgData.oData.spriteHeight;
            a.drawImage(this.oImgData.img, b, c, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight, -this.oImgData.oData.spriteWidth / 2 + this.offsetX, -this.oImgData.oData.spriteHeight / 2 + this.offsetY, this.oImgData.oData.spriteWidth, this.oImgData.oData.spriteHeight),
            a.restore()
        },
        a
    } ();
    a.BasicSprite = b
} (Utils || (Utils = {}));
var Utils; !
function(a) {
    var b = function() {
        function a(a, b) {
            var c = this;
            this.canvasX = 0,
            this.canvasY = 0,
            this.canvasScaleX = 1,
            this.canvasScaleY = 1,
            this.prevHitTime = 0,
            this.pauseIsOn = !1,
            this.isDown = !1,
            this.isDetectingKeys = !1,
            this.isBugBrowser = b,
            a.addEventListener("touchstart",
            function(a) {
                for (var b = 0; b < a.changedTouches.length; b++) c.hitDown(a, a.changedTouches[b].pageX, a.changedTouches[b].pageY, a.changedTouches[b].identifier)
            },
            !1),
            a.addEventListener("touchend",
            function(a) {
                for (var b = 0; b < a.changedTouches.length; b++) c.hitUp(a, a.changedTouches[b].pageX, a.changedTouches[b].pageY, a.changedTouches[b].identifier)
            },
            !1),
            a.addEventListener("touchmove",
            function(a) {
                for (var b = 0; b < c.aHitAreas.length; b++) c.move(a, a.changedTouches[b].pageX, a.changedTouches[b].pageY, a.changedTouches[b].identifier, !0)
            },
            !1),
            a.addEventListener("mousedown",
            function(a) {
                c.isDown = !0,
                c.hitDown(a, a.pageX, a.pageY, 1)
            },
            !1),
            a.addEventListener("mouseup",
            function(a) {
                c.isDown = !1,
                c.hitUp(a, a.pageX, a.pageY, 1)
            },
            !1),
            a.addEventListener("mousemove",
            function(a) {
                c.move(a, a.pageX, a.pageY, 1, c.isDown)
            },
            !1),
            this.aHitAreas = new Array,
            this.aKeys = new Array
        }
        return a.prototype.setCanvas = function(a, b, c, d) {
            this.canvasX = a,
            this.canvasY = b,
            this.canvasScaleX = c,
            this.canvasScaleY = d
        },
        a.prototype.hitDown = function(a, b, c, d) {
            if (!this.pauseIsOn) {
                var e = (new Date).getTime();
                e - this.prevHitTime < 500 && this.isBugBrowser,
                this.prevHitTime = e,
                a.preventDefault(),
                a.stopPropagation(),
                b = (b - this.canvasX) * this.canvasScaleX,
                c = (c - this.canvasY) * this.canvasScaleY;
                for (var f = 0; f < this.aHitAreas.length; f++) if (this.aHitAreas[f].rect && b > this.aHitAreas[f].area[0] && c > this.aHitAreas[f].area[1] && b < this.aHitAreas[f].area[2] && c < this.aHitAreas[f].area[3]) {
                    this.aHitAreas[f].aTouchIdentifiers.push(d),
                    this.aHitAreas[f].oData.hasLeft = !1,
                    this.aHitAreas[f].oData.isDown || (this.aHitAreas[f].oData.isDown = !0, this.aHitAreas[f].oData.x = b, this.aHitAreas[f].oData.y = c, this.aHitAreas[f].callback(this.aHitAreas[f].id, this.aHitAreas[f].oData));
                    break
                }
            }
        },
        a.prototype.hitUp = function(a, b, c, d) {
            if (!this.pauseIsOn) {
                a.preventDefault(),
                a.stopPropagation(),
                b = (b - this.canvasX) * this.canvasScaleX,
                c = (c - this.canvasY) * this.canvasScaleY;
                for (var e = 0; e < this.aHitAreas.length; e++) if (this.aHitAreas[e].rect && b > this.aHitAreas[e].area[0] && c > this.aHitAreas[e].area[1] && b < this.aHitAreas[e].area[2] && c < this.aHitAreas[e].area[3]) {
                    for (var f = 0; f < this.aHitAreas[e].aTouchIdentifiers.length; f++) this.aHitAreas[e].aTouchIdentifiers[f] == d && (this.aHitAreas[e].aTouchIdentifiers.splice(f, 1), f -= 1);
                    0 == this.aHitAreas[e].aTouchIdentifiers.length && (this.aHitAreas[e].oData.isDown = !1, this.aHitAreas[e].oData.multiTouch && this.aHitAreas[e].callback(this.aHitAreas[e].id, this.aHitAreas[e].oData));
                    break
                }
            }
        },
        a.prototype.move = function(a, b, c, d, e) {
            if (!this.pauseIsOn && e) {
                b = (b - this.canvasX) * this.canvasScaleX,
                c = (c - this.canvasY) * this.canvasScaleY;
                for (var f = 0; f < this.aHitAreas.length; f++) if (this.aHitAreas[f].rect) if (b > this.aHitAreas[f].area[0] && c > this.aHitAreas[f].area[1] && b < this.aHitAreas[f].area[2] && c < this.aHitAreas[f].area[3]) this.aHitAreas[f].oData.hasLeft = !1,
                this.aHitAreas[f].oData.isDown || (this.aHitAreas[f].oData.isDown = !0, this.aHitAreas[f].oData.x = b, this.aHitAreas[f].oData.y = c, this.aHitAreas[f].aTouchIdentifiers.push(d), this.aHitAreas[f].oData.multiTouch && this.aHitAreas[f].callback(this.aHitAreas[f].id, this.aHitAreas[f].oData)),
                this.aHitAreas[f].oData.isDraggable && (this.aHitAreas[f].oData.isBeingDragged = !0, this.aHitAreas[f].oData.x = b, this.aHitAreas[f].oData.y = c, this.aHitAreas[f].callback(this.aHitAreas[f].id, this.aHitAreas[f].oData), this.aHitAreas[f].oData.isBeingDragged = !1);
                else if (this.aHitAreas[f].oData.isDown && !this.aHitAreas[f].oData.hasLeft) {
                    for (var g = 0; g < this.aHitAreas[f].aTouchIdentifiers.length; g++) this.aHitAreas[f].aTouchIdentifiers[g] == d && (this.aHitAreas[f].aTouchIdentifiers.splice(g, 1), g -= 1);
                    0 == this.aHitAreas[f].aTouchIdentifiers.length && (this.aHitAreas[f].oData.hasLeft = !0, this.aHitAreas[f].oData.isBeingDragged || (this.aHitAreas[f].oData.isDown = !1), this.aHitAreas[f].oData.multiTouch && this.aHitAreas[f].callback(this.aHitAreas[f].id, this.aHitAreas[f].oData))
                }
            }
        },
        a.prototype.keyDown = function(a) {
            for (var b = 0; b < this.aKeys.length; b++) a.keyCode == this.aKeys[b].keyCode && (this.aKeys[b].oData.isDown = !0, this.aKeys[b].callback(this.aKeys[b].id, this.aKeys[b].oData))
        },
        a.prototype.keyUp = function(a) {
            for (var b = 0; b < this.aKeys.length; b++) a.keyCode == this.aKeys[b].keyCode && (this.aKeys[b].oData.isDown = !1, this.aKeys[b].callback(this.aKeys[b].id, this.aKeys[b].oData))
        },
        a.prototype.addKey = function(a, b, c, d) {
            var e = this;
            this.isDetectingKeys || (window.addEventListener("keydown",
            function(a) {
                e.keyDown(a)
            },
            !1), window.addEventListener("keyup",
            function(a) {
                e.keyUp(a)
            },
            !1), this.isDetectingKeys = !0),
            null == c && (c = new Object),
            this.aKeys.push({
                id: a,
                callback: b,
                oData: c,
                keyCode: d
            })
        },
        a.prototype.removeKey = function(a) {
            for (var b = 0; b < this.aKeys.length; b++) this.aKeys[b].id == a && (this.aKeys.splice(b, 1), b -= 1)
        },
        a.prototype.addHitArea = function(a, b, c, d, e, f) {
            "undefined" == typeof f && (f = !1),
            null == c && (c = new Object),
            f && this.removeHitArea(a);
            var g = new Array;
            switch (d) {
            case "image":
                var h;
                h = new Array(e.aPos[0] - e.oImgData.oData.oAtlasData[e.id].width / 2, e.aPos[1] - e.oImgData.oData.oAtlasData[e.id].height / 2, e.aPos[0] + e.oImgData.oData.oAtlasData[e.id].width / 2, e.aPos[1] + e.oImgData.oData.oAtlasData[e.id].height / 2),
                this.aHitAreas.push({
                    id: a,
                    aTouchIdentifiers: g,
                    callback: b,
                    oData: c,
                    rect: !0,
                    area: h
                });
                break;
            case "rect":
                this.aHitAreas.push({
                    id:
                    a,
                    aTouchIdentifiers: g,
                    callback: b,
                    oData: c,
                    rect: !0,
                    area: e.aRect
                })
            }
        },
        a.prototype.removeHitArea = function(a) {
            for (var b = 0; b < this.aHitAreas.length; b++) this.aHitAreas[b].id == a && (this.aHitAreas.splice(b, 1), b -= 1)
        },
        a
    } ();
    a.UserInput = b
} (Utils || (Utils = {}));
var Utils; !
function(a) {
    var b = function() {
        function a(a) {
            this.updateFreq = 10,
            this.updateInc = 0,
            this.frameAverage = 0,
            this.display = 1,
            this.log = "",
            this.render = function(a) {
                this.frameAverage += this.delta / this.updateFreq,
                ++this.updateInc >= this.updateFreq && (this.updateInc = 0, this.display = this.frameAverage, this.frameAverage = 0),
                a.textAlign = "left",
                ctx.font = "10px Helvetica",
                a.fillStyle = "#333333",
                a.beginPath(),
                a.rect(0, this.canvasHeight - 15, 40, 15),
                a.closePath(),
                a.fill(),
                a.fillStyle = "#ffffff",
                a.fillText(Math.round(1e3 / (1e3 * this.display)) + " fps " + this.log, 5, this.canvasHeight - 5)
            },
            this.canvasHeight = a
        }
        return a.prototype.update = function(a) {
            this.delta = a
        },
        a
    } ();
    a.FpsMeter = b
} (Utils || (Utils = {}));
var Elements; !
function(a) {
    var b = function() {
        function a(a, b, c) {
            this.x = 0,
            this.y = 0,
            this.targY = 0,
            this.incY = 0,
            this.oImgData = a,
            this.canvasWidth = b,
            this.canvasHeight = c
        }
        return a.prototype.updateScroll = function(a) {
            this.incY += 5 * a
        },
        a.prototype.renderScroll = function(a) {
            var b = 100;
            a.drawImage(this.oImgData.img, 0, 0);
            for (var c = 0; b > c; c++) a.drawImage(this.oImgData.img, c * (this.canvasWidth / b), 0, this.canvasWidth / b, this.canvasHeight, c * (this.canvasWidth / b), 5 * Math.sin(this.incY + c / 20), this.canvasWidth / b, this.canvasHeight)
        },
        a.prototype.render = function(a) {
            a.drawImage(this.oImgData.img, 0, 0)
        },
        a
    } ();
    a.Background = b
} (Elements || (Elements = {}));
var Elements; !
function(a) {
    var b = function() {
        function a(a, b, c) {
            this.inc = 0,
            this.oSplashScreenImgData = a,
            this.canvasWidth = b,
            this.canvasHeight = c,
            this.posY = -this.canvasHeight,
            TweenLite.to(this, .5, {
                posY: 0
            })
        }
        return a.prototype.render = function(a, b) {
            this.inc += 5 * b,
            a.drawImage(this.oSplashScreenImgData.img, 0, 0 - this.posY)
        },
        a
    } ();
    a.Splash = b
} (Elements || (Elements = {}));
var Elements; !
function(a) {
    var b = function() {
        function a(a, b, c, d, e, f, g, h) {
            this.timer = .3,
            this.endTime = 0,
            this.oScoreData = {},
            this.posY = 0,
            this.numberSpace = 30,
            this.incY = 0,
            this.highlight = {
                x: 0,
                y: 0
            },
            this.aPowerUpBarPos = new Array({
                x: 63,
                y: 245
            },
            {
                x: 233,
                y: 175
            },
            {
                x: 403,
                y: 245
            },
            {
                x: 573,
                y: 175
            }),
            this.oPanelsImgData = a,
            this.oUiElementsImgData = b,
            this.oPositionImgData = c,
            this.oNumbersImgData = d,
            this.panelType = e,
            this.aButs = f,
            this.canvasWidth = g,
            this.canvasHeight = h
        }
        return a.prototype.update = function(a) {
            this.incY += 5 * a
        },
        a.prototype.startTween1 = function() {
            this.posY = 550,
            TweenLite.to(this, .8, {
                posY: 0,
                ease: "Back.easeOut"
            })
        },
        a.prototype.startTween2 = function() {
            this.posY = 550,
            TweenLite.to(this, .5, {
                posY: 0,
                ease: "Quad.easeOut"
            })
        },
        a.prototype.render = function(a, b) {
            switch ("undefined" == typeof b && (b = !0), b || this.addButs(a), this.panelType) {
            case "start":
                var c = 0,
                d = c * this.oPanelsImgData.oData.spriteWidth % this.oPanelsImgData.img.width,
                e = Math.floor(c / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                a.drawImage(this.oPanelsImgData.img, d, e + 1, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight - 2, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                break;
            case "credits":
                var c = 4,
                d = c * this.oPanelsImgData.oData.spriteWidth % this.oPanelsImgData.img.width,
                e = Math.floor(c / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                a.drawImage(this.oPanelsImgData.img, d, e, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                break;
            case "levelComplete":
                var c = 2,
                d = c * this.oPanelsImgData.oData.spriteWidth % this.oPanelsImgData.img.width,
                e = Math.floor(c / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                a.drawImage(this.oPanelsImgData.img, d, e + 1, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight - 2, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight),
                c = this.oScoreData.racePos;
                var d = c * this.oPositionImgData.oData.spriteWidth % this.oPositionImgData.img.width,
                e = Math.floor(c / (this.oPositionImgData.img.width / this.oPositionImgData.oData.spriteWidth)) * this.oPositionImgData.oData.spriteHeight;
                a.drawImage(this.oPositionImgData.img, d, e, this.oPositionImgData.oData.spriteWidth, this.oPositionImgData.oData.spriteHeight, 352 - this.oPositionImgData.oData.spriteWidth / 2, 114 - this.oPositionImgData.oData.spriteHeight / 2 + this.posY, this.oPositionImgData.oData.spriteWidth, this.oPositionImgData.oData.spriteHeight);
                for (var f = this.oScoreData.winnings,
                g = 0; g < f.toString().length; g++) {
                    c = parseFloat(f.toString().charAt(g));
                    var d = c * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                    e = Math.floor(c / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                    a.drawImage(this.oNumbersImgData.img, d, e, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, 390 + g * this.numberSpace, 180 + this.posY, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight)
                }
                for (var f = this.oScoreData.levelScore,
                g = 0; g < f.toString().length; g++) {
                    c = parseFloat(f.toString().charAt(g));
                    var d = c * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                    e = Math.floor(c / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                    a.drawImage(this.oNumbersImgData.img, d, e, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, 355 + g * this.numberSpace, 236 + this.posY, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight)
                }
                for (var f = this.oScoreData.totalScore,
                g = 0; g < f.toString().length; g++) {
                    c = parseFloat(f.toString().charAt(g));
                    var d = c * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                    e = Math.floor(c / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                    a.drawImage(this.oNumbersImgData.img, d, e, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, 386 + g * (this.numberSpace / 2), 369 + this.posY, this.oNumbersImgData.oData.spriteWidth / 2, Math.round(this.oNumbersImgData.oData.spriteHeight / 2))
                }
                break;
            case "upgrade":
                var c = 3,
                d = c * this.oPanelsImgData.oData.spriteWidth % this.oPanelsImgData.img.width,
                e = Math.floor(c / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                a.drawImage(this.oPanelsImgData.img, d, e + 1, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight - 2, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                for (var f = this.oScoreData.winnings,
                g = 0; g < f.toString().length; g++) {
                    c = parseFloat(f.toString().charAt(g));
                    var d = c * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                    e = Math.floor(c / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                    a.drawImage(this.oNumbersImgData.img, d, e, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, 42 + g * this.numberSpace, 7 + this.posY, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight)
                }
                for (var f = this.oScoreData.totalScore,
                g = 0; g < f.toString().length; g++) {
                    c = parseFloat(f.toString().charAt(g));
                    var d = c * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                    e = Math.floor(c / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                    a.drawImage(this.oNumbersImgData.img, d, e, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, 386 + g * (this.numberSpace / 2), 369 + this.posY, this.oNumbersImgData.oData.spriteWidth / 2, Math.round(this.oNumbersImgData.oData.spriteHeight / 2))
                }
                for (var g = 0; g < this.oScoreData.aPowerUpBarData.length; g++) {
                    c = this.oScoreData.aPowerUpBarData[g];
                    var h = this.oUiElementsImgData.oData.oAtlasData["upgrade" + c].x,
                    i = this.oUiElementsImgData.oData.oAtlasData["upgrade" + c].y,
                    j = this.oUiElementsImgData.oData.oAtlasData["upgrade" + c].width,
                    k = this.oUiElementsImgData.oData.oAtlasData["upgrade" + c].height;
                    a.drawImage(this.oUiElementsImgData.img, h, i, j, k, this.aPowerUpBarPos[g].x - j / 2, this.aPowerUpBarPos[g].y - k / 2 + this.posY, j, k)
                }
                break;
            case "map":
                var c = 1,
                d = c * this.oPanelsImgData.oData.spriteWidth % this.oPanelsImgData.img.width,
                e = Math.floor(c / (this.oPanelsImgData.img.width / this.oPanelsImgData.oData.spriteWidth)) * this.oPanelsImgData.oData.spriteHeight;
                a.drawImage(this.oPanelsImgData.img, d, e + 1, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight - 2, 0, 0 + this.posY, this.oPanelsImgData.oData.spriteWidth, this.oPanelsImgData.oData.spriteHeight);
                for (var f = this.oScoreData.totalScore,
                g = 0; g < f.toString().length; g++) {
                    c = parseFloat(f.toString().charAt(g));
                    var d = c * this.oNumbersImgData.oData.spriteWidth % this.oNumbersImgData.img.width,
                    e = Math.floor(c / (this.oNumbersImgData.img.width / this.oNumbersImgData.oData.spriteWidth)) * this.oNumbersImgData.oData.spriteHeight;
                    a.drawImage(this.oNumbersImgData.img, d, e, this.oNumbersImgData.oData.spriteWidth, this.oNumbersImgData.oData.spriteHeight, 386 + g * (this.numberSpace / 2), 369 + this.posY, this.oNumbersImgData.oData.spriteWidth / 2, Math.round(this.oNumbersImgData.oData.spriteHeight / 2))
                }
                break;
            case "pause":
                a.fillStyle = "rgba(0, 0, 0, 0.75)",
                a.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
            }
            b && this.addButs(a)
        },
        a.prototype.addButs = function(a) {
            for (var b = 0; b < this.aButs.length; b++) {
                var c = this.posY,
                d = 0;
                this.aButs[b].noFloat ? (d = -this.posY, c = 0) : d = 3 * Math.sin(this.incY + 45 * b);
                var e = this.aButs[b].oImgData.oData.oAtlasData[this.aButs[b].id].x,
                f = this.aButs[b].oImgData.oData.oAtlasData[this.aButs[b].id].y,
                g = this.aButs[b].oImgData.oData.oAtlasData[this.aButs[b].id].width,
                h = this.aButs[b].oImgData.oData.oAtlasData[this.aButs[b].id].height;
                a.drawImage(this.aButs[b].oImgData.img, e, f, g, h, this.aButs[b].aPos[0] - g / 2 + c, this.aButs[b].aPos[1] - h / 2 - d, g, h)
            }
            if ("map" == this.panelType) {
                for (var i, b = 0; b < aMapPointData.length; b++) if (2 == saveDataHandler.aLevelStore[3 * b]) {
                    i = saveDataHandler.aLevelStore[3 * b + 1];
                    var j = i * this.oPositionImgData.oData.spriteWidth % this.oPositionImgData.img.width,
                    k = Math.floor(i / (this.oPositionImgData.img.width / this.oPositionImgData.oData.spriteWidth)) * this.oPositionImgData.oData.spriteHeight;
                    a.drawImage(this.oPositionImgData.img, j, k, this.oPositionImgData.oData.spriteWidth, this.oPositionImgData.oData.spriteHeight, aMapPointData[b][0] - this.oPositionImgData.oData.spriteWidth / 2 + c, aMapPointData[b][1] - this.oPositionImgData.oData.spriteHeight / 2 - d, this.oPositionImgData.oData.spriteWidth, this.oPositionImgData.oData.spriteHeight)
                }
                a.save(),
                a.translate(this.highlight.x - 2 + c, this.highlight.y - 2.5 - d),
                a.globalAlpha = Math.abs(Math.sin(this.incY / 1.5));
                var e = this.oUiElementsImgData.oData.oAtlasData.levelHighlight.x,
                f = this.oUiElementsImgData.oData.oAtlasData.levelHighlight.y,
                g = this.oUiElementsImgData.oData.oAtlasData.levelHighlight.width,
                h = this.oUiElementsImgData.oData.oAtlasData.levelHighlight.height;
                a.drawImage(this.oUiElementsImgData.img, e, f, g, h, -g / 2, -h / 2, g, h),
                a.restore()
            }
        },
        a
    } ();
    a.Panel = b
} (Elements || (Elements = {}));
var Elements; !
function(a) {
    var b = function() {
        function a(a, b, c, d, e) {
            this.speed = 0,
            this.raceProgress = 0,
            this.oHudImgData = a,
            this.oUiElementsImgData = b,
            this.oPositionImgData = c,
            this.canvasWidth = d,
            this.canvasHeight = e
        }
        return a.prototype.render = function(a) {
            nitroMode ? a.drawImage(this.oHudImgData.img, 0, this.oHudImgData.oData.spriteHeight, this.oHudImgData.oData.spriteWidth, this.oHudImgData.oData.spriteHeight, 0, 0, this.oHudImgData.oData.spriteWidth, this.oHudImgData.oData.spriteHeight) : a.drawImage(this.oHudImgData.img, 0, 0, this.oHudImgData.oData.spriteWidth, this.oHudImgData.oData.spriteHeight, 0, 0, this.oHudImgData.oData.spriteWidth, this.oHudImgData.oData.spriteHeight),
            a.save(),
            a.translate(71, 69),
            a.rotate(speed / 95 - 2.5);
            var b = this.oUiElementsImgData.oData.oAtlasData.needle.x,
            c = this.oUiElementsImgData.oData.oAtlasData.needle.y,
            d = this.oUiElementsImgData.oData.oAtlasData.needle.width,
            e = this.oUiElementsImgData.oData.oAtlasData.needle.height;
            a.drawImage(this.oUiElementsImgData.img, b, c, d, e, -d + 10, -e / 2, d, e),
            a.restore();
            var b = this.oUiElementsImgData.oData.oAtlasData.helmet.x,
            c = this.oUiElementsImgData.oData.oAtlasData.helmet.y,
            d = this.oUiElementsImgData.oData.oAtlasData.helmet.width,
            e = this.oUiElementsImgData.oData.oAtlasData.helmet.height;
            a.drawImage(this.oUiElementsImgData.img, b, c, d, e, 228 + 167 * this.raceProgress - d / 2, 30 - e / 2, d, e);
            var f = racePos * this.oPositionImgData.oData.spriteWidth % this.oPositionImgData.img.width,
            g = Math.floor(racePos / (this.oPositionImgData.img.width / this.oPositionImgData.oData.spriteWidth)) * this.oPositionImgData.oData.spriteHeight;
            a.drawImage(this.oPositionImgData.img, f, g, this.oPositionImgData.oData.spriteWidth, this.oPositionImgData.oData.spriteHeight, 169 - this.oPositionImgData.oData.spriteWidth / 2, 46 - this.oPositionImgData.oData.spriteHeight / 2, this.oPositionImgData.oData.spriteWidth, this.oPositionImgData.oData.spriteHeight)
        },
        a
    } ();
    a.Hud = b
} (Elements || (Elements = {}));
var Elements; !
function(a) {
    var b = function() {
        function b(a, b, c, d, e, f, g, h, i) {
            this.segNum = 400,
            this.minWidth = 100,
            this.maxWidth = 900,
            this.steerX = 0,
            this.horizon = 200,
            this.scrollY = 0,
            this.scrollX = 0,
            this.hillAmount = 0,
            this.curveAmount = 0,
            this.aScenery = new Array,
            this.aEnemyCars = new Array,
            this.sceneryInc = 0,
            this.enemyInc = 0,
            this.nitroInc = 0,
            this.aRowData = new Array,
            this.sceneryDir = 0,
            this.enemyIncTarg = 1e3 * Math.random() + 500,
            this.nitro = null,
            this.bridgeRow = 0,
            this.bridgeType = 3,
            this.carSpace = 100 * Math.random() + 50,
            this.roadScaleMultiplier = 1,
            this.oSkylineImgData = a,
            this.oFogImgData = b,
            this.oRoadImgData = c,
            this.oGroundImgData = d,
            this.levelTheme = e,
            this.levelNum = f,
            this.canvasWidth = g,
            this.canvasHeight = h,
            "city" == this.levelTheme ? this.roadScaleMultiplier = 1.176 : "desert" == this.levelTheme && (this.roadScaleMultiplier = 1.429),
            this.callback = i;
            for (var j = 0; j < this.segNum; j++) this.aRowData.push({
                y: 0,
                scale: 0
            });
            for (var j = 0; 20 > j; j++) this.addScenery(),
            this.aScenery[j].rowNum = Math.floor(this.segNum / 20) * j
        }
        return b.prototype.addNitro = function() {
            this.nitro = new a.Nitro(assetLib.getData("scenery"), "nitro", canvas.width, canvas.height),
            this.nitro.y = this.horizon + 100 * this.hillAmount
        },
        b.prototype.addScenery = function() {
            var c, b = Math.floor(3 * Math.random());
            switch (this.sceneryDir++, this.bridgeRow < 20 && 0 == this.sceneryDir % 10 && (this.bridgeRow++, b = this.bridgeType), b) {
            case 0:
                c = new a.Scenery(assetLib.getData("scenery"), this.levelTheme + "0", this.sceneryDir % 2, canvas.width, canvas.height);
                break;
            case 1:
                c = new a.Scenery(assetLib.getData("scenery"), this.levelTheme + "1", this.sceneryDir % 2, canvas.width, canvas.height);
                break;
            case 2:
                c = new a.Scenery(assetLib.getData("scenery"), this.levelTheme + "2", this.sceneryDir % 2, canvas.width, canvas.height);
                break;
            case 3:
                c = new a.Scenery(assetLib.getData("scenery"), "start", 2, canvas.width, canvas.height);
                break;
            case 4:
                c = new a.Scenery(assetLib.getData("scenery"), "bridge", 2, canvas.width, canvas.height);
                break;
            case 5:
                c = new a.Scenery(assetLib.getData("scenery"), "finish", 2, canvas.width, canvas.height)
            }
            c.y = this.horizon + 100 * this.hillAmount,
            this.aScenery.push(c)
        },
        b.prototype.addEnemyCar = function(b) {
            "undefined" == typeof b && (b = !0);
            var c;
            c = new a.EnemyCar(assetLib.getData("enemyCar"), canvas.width, canvas.height),
            b || (c.rowNum = this.segNum - 1, c.driftInc = this.steerX < 0 ? 30 : -30, c.driftPower = 1e3),
            this.carSpace = 100 * Math.random() + 50,
            this.aEnemyCars.push(c)
        },
        b.prototype.update = function(a, b, c, d, e) {
            this.steerX += b * e,
            this.speed = a,
            this.delta = e,
            this.sceneryInc += this.speed * this.delta,
            this.sceneryInc > 5 && (this.sceneryInc = 0, this.addScenery()),
            nitroMode ? this.nitroInc = 0 : this.nitroInc += this.speed * this.delta,
            this.nitroInc > 5e3 && (this.nitroInc = 0, this.addNitro()),
            this.steerX > 600 / this.roadScaleMultiplier ? (this.steerX = 600 / this.roadScaleMultiplier, nitroMode = !1) : this.steerX < -600 / this.roadScaleMultiplier && (this.steerX = -600 / this.roadScaleMultiplier, nitroMode = !1),
            this.scrollY -= a * e,
            this.scrollY < 0 && (this.scrollY += 500),
            this.hillAmount = d,
            this.curveAmount = c,
            this.scrollX += this.curveAmount * (a / 1.5) * e,
            this.scrollX < 0 && (this.scrollX += 700)
        },
        b.prototype.freeToAddCar = function() {
            for (var a = this.aEnemyCars.length - 1; a >= 0; a--) if (this.aEnemyCars[a].rowNum < this.carSpace) return ! 1;
            return ! 0
        },
        b.prototype.render = function(a) {
            a.drawImage(this.oSkylineImgData.img, this.scrollX % this.canvasWidth, 0, this.canvasWidth, this.canvasHeight, 0, 130 * this.hillAmount - 120, this.canvasWidth, this.canvasHeight),
            a.drawImage(this.oGroundImgData.img, 0, 0, this.canvasWidth, this.canvasHeight, 0, this.horizon + 100 * this.hillAmount, this.canvasWidth, this.canvasHeight);
            for (var b = 500 / this.segNum,
            c = 0,
            d = 0; d < this.segNum; d++) this.tempInc = d,
            this.easeInc = 1 * (this.tempInc /= this.segNum) * this.tempInc * this.tempInc * this.tempInc * this.tempInc * this.tempInc + 0,
            this.nextRow = d + 1,
            this.segHeightAfter = 1 * (this.nextRow /= this.segNum) * this.nextRow * this.nextRow * this.nextRow * this.nextRow * this.nextRow + 0 - this.easeInc,
            this.curve = 1.5 * (this.segNum - d) * this.curveAmount,
            this.aRowData[d].x = this.steerX * this.easeInc + this.canvasWidth / 2 - 2 * (this.easeInc + this.segHeightAfter) * this.oRoadImgData.oData.spriteWidth / 2 + this.curve - 10 * (this.hillAmount + 1) - 5,
            this.aRowData[d].y = this.horizon + 100 * this.hillAmount + this.easeInc * (250 + -100 * this.hillAmount),
            this.aRowData[d].scale = 2 * (this.easeInc + this.segHeightAfter) * this.oRoadImgData.oData.spriteWidth + 30,
            0 == c && (this.rowId = d),
            c += this.segHeightAfter * (250 + -100 * this.hillAmount),
            c > 1 && (a.drawImage(this.oRoadImgData.img, 0, this.rowId * b + this.scrollY, this.oRoadImgData.oData.spriteWidth, b, this.aRowData[this.rowId].x, this.aRowData[this.rowId].y, this.aRowData[this.rowId].scale, c + 1), c = 0);
            var e = this.canvasHeight - (this.horizon + 100 * this.hillAmount);
            a.drawImage(this.oFogImgData.img, 0, 0, this.canvasWidth, this.canvasHeight / 2, 0, this.horizon + 100 * this.hillAmount - 8 * (e / (this.canvasHeight / 2)), this.canvasWidth, e + 8 * (e / (this.canvasHeight / 2)));
            for (var d = this.aEnemyCars.length - 1; d >= 0; d--) this.aEnemyCars[d].x = this.aRowData[Math.floor(this.aEnemyCars[d].rowNum)].x + this.aRowData[Math.floor(this.aEnemyCars[d].rowNum)].scale * this.aEnemyCars[d].sideMultiplier,
            this.aEnemyCars[d].y = this.aRowData[Math.floor(this.aEnemyCars[d].rowNum)].y,
            this.aEnemyCars[d].scale = ((this.aRowData[Math.floor(this.aEnemyCars[d].rowNum)].scale - 30) * this.roadScaleMultiplier + 30) / 780,
            this.aEnemyCars[d].update(this.steerX, this.curveAmount, this.hillAmount, this.delta),
            this.aEnemyCars[d].render(a),
            this.aEnemyCars[d].rowNum += .6 * (this.speed - this.aEnemyCars[d].speed) * this.delta,
            this.aEnemyCars[d].y > 345 + 20 * this.hillAmount && this.aEnemyCars[d].x < this.canvasWidth / 2 + 80 && this.aEnemyCars[d].x > this.canvasWidth / 2 - 80 ? this.aEnemyCars[d].canHit && (this.aEnemyCars[d].canHit = !1, this.aEnemyCars[d].y > 380 + 20 * this.hillAmount && (this.aEnemyCars[d].speed = 0), this.callback("hitEnemyCar", {
                bounceX: 1 / 75 * (this.aEnemyCars[d].x - this.canvasWidth / 2)
            })) : this.aEnemyCars[d].canHit = !0,
            this.aEnemyCars[d].rowNum >= this.segNum ? (this.aEnemyCars.splice(d, 1), 4 >= startTimer && (racePos--, playSound("overtake"))) : this.aEnemyCars[d].rowNum < 0 && (this.aEnemyCars.splice(d, 1), carReleasedNum++);
            this.nitro && (this.nitro.x = this.aRowData[Math.floor(this.nitro.rowNum)].x + this.aRowData[Math.floor(this.nitro.rowNum)].scale * this.nitro.sideMultiplier, this.nitro.y = this.aRowData[Math.floor(this.nitro.rowNum)].y, this.nitro.scale = ((this.aRowData[Math.floor(this.nitro.rowNum)].scale - 30) * this.roadScaleMultiplier + 30) / 730, this.nitro.render(a), this.nitro.rowNum += .6 * (this.speed - this.nitro.speed) * this.delta, this.nitro.y > 345 + 20 * this.hillAmount && this.nitro.x < this.canvasWidth / 2 + 65 && this.nitro.x > this.canvasWidth / 2 - 65 && (this.nitro.rowNum = -1, this.callback("hitNitro")), (this.nitro.rowNum >= this.segNum || this.nitro.rowNum < 0) && (this.nitro = null));
            for (var d = this.aScenery.length - 1; d >= 0; d--) this.aScenery[d].x = this.aRowData[Math.floor(this.aScenery[d].rowNum)].x + this.aRowData[Math.floor(this.aScenery[d].rowNum)].scale * this.aScenery[d].sideMultiplier,
            this.aScenery[d].y = this.aRowData[Math.floor(this.aScenery[d].rowNum)].y,
            this.aScenery[d].scale = ((this.aRowData[Math.floor(this.aScenery[d].rowNum)].scale - 30) * this.roadScaleMultiplier + 30 - 10) / 450,
            this.aScenery[d].render(a),
            this.aScenery[d].rowNum += .8 * this.speed * this.delta,
            this.aScenery[d].rowNum >= this.segNum && this.aScenery.splice(d, 1)
        },
        b
    } ();
    a.Road = b
} (Elements || (Elements = {}));
var Elements; !
function(a) {
    var b = function() {
        function a(a, b, c) {
            this.offsetX = 0,
            this.offsetY = 0,
            this.steerFrame = 1,
            this.oCarImgData = a,
            this.canvasWidth = b,
            this.canvasHeight = c,
            this.x = this.canvasWidth / 2,
            this.y = 360
        }
        return a.prototype.update = function(a, b, c, d, e) {
            this.offsetY = 8 * d,
            this.offsetX = -b / 120 + 20 * c,
            this.steerFrame = e + 1,
            this.y = 360 + 10 * d
        },
        a.prototype.render = function(a) {
            a.drawImage(this.oCarImgData.img, this.steerFrame * this.oCarImgData.oData.spriteWidth, 0, this.oCarImgData.oData.spriteWidth, this.oCarImgData.oData.spriteHeight, this.x - this.oCarImgData.oData.spriteWidth / 2 + 1.7 * this.offsetX, this.y - this.oCarImgData.oData.spriteHeight / 2 + 2 * this.offsetY, this.oCarImgData.oData.spriteWidth, this.oCarImgData.oData.spriteHeight),
            a.drawImage(this.oCarImgData.img, 3 * this.oCarImgData.oData.spriteWidth, 0, this.oCarImgData.oData.spriteWidth, this.oCarImgData.oData.spriteHeight, this.x - this.oCarImgData.oData.spriteWidth / 2 + this.offsetX, this.y - this.oCarImgData.oData.spriteHeight / 2 + this.offsetY, this.oCarImgData.oData.spriteWidth, this.oCarImgData.oData.spriteHeight);
            var b = 4;
            nitroMode && (b = 5),
            a.drawImage(this.oCarImgData.img, b * this.oCarImgData.oData.spriteWidth, 0, this.oCarImgData.oData.spriteWidth, this.oCarImgData.oData.spriteHeight, this.x - this.oCarImgData.oData.spriteWidth / 2, this.y - this.oCarImgData.oData.spriteHeight / 2, this.oCarImgData.oData.spriteWidth, this.oCarImgData.oData.spriteHeight)
        },
        a
    } ();
    a.UserCar = b
} (Elements || (Elements = {}));
var Elements; !
function(a) {
    var b = function() {
        function a(a, b, c) {
            this.offsetX = 0,
            this.offsetY = 0,
            this.canHit = !0,
            this.driftInc = 100 * Math.random(),
            this.driftPower = 3 * Math.random() + 1,
            this.colour = Math.floor(4 * Math.random()),
            this.oCarImgData = a,
            this.canvasWidth = b,
            this.canvasHeight = c,
            this.scale = .01,
            this.rowNum = 0,
            this.speed = enemySpeed
        }
        return a.prototype.update = function(a, b, c, d) {
            this.offsetY = -8 * c * this.scale,
            this.offsetX = (a + 1200 * (this.sideMultiplier - .5)) / 20 + -15 * b,
            this.driftInc += d / this.driftPower,
            this.sideMultiplier = .2 * (Math.sin(this.driftInc) + 1) + .3
        },
        a.prototype.render = function(a) {
            var b = this.colour * this.oCarImgData.oData.spriteWidth % this.oCarImgData.img.width,
            c = Math.floor(this.colour / (this.oCarImgData.img.width / this.oCarImgData.oData.spriteWidth)) * this.oCarImgData.oData.spriteHeight;
            a.drawImage(this.oCarImgData.img, b, c, this.oCarImgData.oData.spriteWidth, this.oCarImgData.oData.spriteHeight, this.x - this.scale * (this.oCarImgData.oData.spriteWidth / 2 + 1.7 * this.offsetX), this.y - this.scale * (.75 * this.oCarImgData.oData.spriteHeight + 2 * this.offsetY), this.scale * this.oCarImgData.oData.spriteWidth, this.scale * this.oCarImgData.oData.spriteHeight);
            var b = (this.colour + 4) * this.oCarImgData.oData.spriteWidth % this.oCarImgData.img.width,
            c = Math.floor((this.colour + 4) / (this.oCarImgData.img.width / this.oCarImgData.oData.spriteWidth)) * this.oCarImgData.oData.spriteHeight;
            a.drawImage(this.oCarImgData.img, b, c, this.oCarImgData.oData.spriteWidth, this.oCarImgData.oData.spriteHeight, this.x - this.scale * (this.oCarImgData.oData.spriteWidth / 2 + this.offsetX), this.y - this.scale * (.75 * this.oCarImgData.oData.spriteHeight + this.offsetY), this.scale * this.oCarImgData.oData.spriteWidth, this.scale * this.oCarImgData.oData.spriteHeight);
            var b = (this.colour + 8) * this.oCarImgData.oData.spriteWidth % this.oCarImgData.img.width,
            c = Math.floor((this.colour + 8) / (this.oCarImgData.img.width / this.oCarImgData.oData.spriteWidth)) * this.oCarImgData.oData.spriteHeight;
            a.drawImage(this.oCarImgData.img, b, c, this.oCarImgData.oData.spriteWidth, this.oCarImgData.oData.spriteHeight, this.x - this.scale * (this.oCarImgData.oData.spriteWidth / 2), this.y - this.scale * .75 * this.oCarImgData.oData.spriteHeight, this.scale * this.oCarImgData.oData.spriteWidth, Math.round(this.scale * this.oCarImgData.oData.spriteHeight))
        },
        a
    } ();
    a.EnemyCar = b
} (Elements || (Elements = {}));
var Elements; !
function(a) {
    var b = function() {
        function a(a, b, c, d, e) {
            this.oImgData = a,
            this.canvasWidth = d,
            this.canvasHeight = e,
            this.sideMultiplier = 0 == c ? .8 * -Math.random() - .15 : 1 == c ? .8 * Math.random() + 1.15 : .5,
            this.id = b,
            this.scale = .01,
            this.rowNum = 0
        }
        return a.prototype.render = function(a) {
            var b = this.oImgData.oData.oAtlasData[this.id].x,
            c = this.oImgData.oData.oAtlasData[this.id].y,
            d = this.oImgData.oData.oAtlasData[this.id].width,
            e = this.oImgData.oData.oAtlasData[this.id].height;
            a.drawImage(this.oImgData.img, b, c, d, e, this.x - this.scale * d / 2, this.y - this.scale * e, this.scale * d, this.scale * e)
        },
        a
    } ();
    a.Scenery = b
} (Elements || (Elements = {}));
var Elements; !
function(a) {
    var b = function() {
        function a(a, b, c, d) {
            this.speed = 300,
            this.oImgData = a,
            this.canvasWidth = c,
            this.canvasHeight = d,
            this.id = b,
            this.sideMultiplier = .7 * Math.random() + .15,
            this.scale = .01,
            this.rowNum = 0
        }
        return a.prototype.render = function(a) {
            var b = this.oImgData.oData.oAtlasData[this.id].x,
            c = this.oImgData.oData.oAtlasData[this.id].y,
            d = this.oImgData.oData.oAtlasData[this.id].width,
            e = this.oImgData.oData.oAtlasData[this.id].height;
            a.drawImage(this.oImgData.img, b, c, d, e, this.x - this.scale * d / 2, this.y - this.scale * e, this.scale * d, this.scale * e)
        },
        a
    } ();
    a.Nitro = b
} (Elements || (Elements = {}));
var Utils; !
function(a) {
    var b = function() {
        function a(a, b) {
            this.saveDataId = a,
            this.totalLevels = b,
            this.clearData(),
            this.setInitialData()
        }
        return a.prototype.clearData = function() {
            this.aLevelStore = new Array,
            this.aLevelStore.push(1),
            this.aLevelStore.push(20),
            this.aLevelStore.push(0);
            for (var a = 0; a < this.totalLevels - 1; a++) this.aLevelStore.push(0),
            this.aLevelStore.push(20),
            this.aLevelStore.push(0);
            for (var a = 0; 4 > a; a++) this.aLevelStore.push(0);
            this.aLevelStore.push(0)
        },
        a.prototype.setInitialData = function() {
            if ("undefined" != typeof Storage) if (null != localStorage.getItem(this.saveDataId)) {
                this.aLevelStore = localStorage.getItem(this.saveDataId).split(",");
                for (var a in this.aLevelStore) this.aLevelStore[a] = parseInt(this.aLevelStore[a])
            } else this.saveData()
        },
        a.prototype.saveData = function() {
            if ("undefined" != typeof Storage) {
                for (var a = "",
                b = 0; b < this.aLevelStore.length; b++) a += this.aLevelStore[b],
                b < this.aLevelStore.length - 1 && (a += ",");
                localStorage.setItem(this.saveDataId, a)
            }
        },
        a
    } ();
    a.SaveDataHandler = b
} (Utils || (Utils = {}));
var requestAnimFrame = function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(a) {
        window.setTimeout(a, 1e3 / 60, (new Date).getTime())
    }
} (),
previousTime,
canvas = document.getElementById("canvas"),
ctx = canvas.getContext("2d");
canvas.width = 700,
canvas.height = 400;
var canvasX, canvasY, canvasScaleX, canvasScaleY, div = document.getElementById("viewporter"),
sound,
music,
audioType = 0,
muted = !1,
splash,
splashTimer = 0,
assetLib,
preAssetLib,
rotatePause = !1,
manualPause = !1,
isMobile = !1,
gameState = "loading",
aLangs = new Array("EN"),
curLang = "",
isBugBrowser = !1,
isIE10 = !1;
navigator.userAgent.match(/MSIE\s([\d]+)/) && (isIE10 = !0);
var deviceAgent = navigator.userAgent.toLowerCase(); (deviceAgent.match(/(iphone|ipod|ipad)/) || deviceAgent.match(/(android)/) || deviceAgent.match(/(iemobile)/) || deviceAgent.match(/iphone/i) || deviceAgent.match(/ipad/i) || deviceAgent.match(/ipod/i) || deviceAgent.match(/blackberry/i) || deviceAgent.match(/bada/i)) && (isMobile = !0, deviceAgent.match(/(android)/) && !/Chrome/.test(navigator.userAgent) && (isBugBrowser = !0));
var userInput = new Utils.UserInput(canvas, isBugBrowser);
resizeCanvas(),
window.onresize = function() {
    setTimeout(function() {
        resizeCanvas()
    },
    1)
},
document.addEventListener("visibilitychange",
function() {
    document.hidden ? Howler.mute() : muted || Howler.unmute()
},
!1),
window.addEventListener("load",
function() {
    setTimeout(function() {
        resizeCanvas()
    },
    0),
    window.addEventListener("orientationchange",
    function() {
        setTimeout(function() {
            resizeCanvas()
        },
        500)
    },
    !1)
}),
isIE10 || "undefined" == typeof window.AudioContext && "undefined" == typeof window.webkitAudioContext && -1 != navigator.userAgent.indexOf("Android") ? audioType = 0 : (audioType = 1, sound = new Howl({
    urls: ["audio/sound.ogg", "audio/sound.m4a"],
    sprite: {
        start1: [0, 700],
        start2: [1e3, 700],
        crash1: [2e3, 1200],
        crash2: [3500, 1e3],
        crash3: [5e3, 1200],
        nitroStart: [7e3, 2500],
        nitroEnd: [1e4, 1500],
        click: [12e3, 300],
        overtake: [13e3, 1e3],
        undertake: [14500, 700],
        offRoad: [16e3, 2e3],
        raceEnd: [19e3, 2e3],
        skid1: [22e3, 800],
        skid2: [23500, 700],
        skid3: [25500, 1100],
        upgrade: [27500, 1e3]
    }
}), music = new Howl({
    urls: ["audio/music.ogg", "audio/music.m4a"],
    volume: .2,
    loop: !0
}));
var panel, hud, background, totalScore = 0,
levelScore = 0,
levelNum = 0,
road, userCar, speed, steerX, targSteerX, rightSteer, leftSteer, turnRate, curveTween, hillTween, curveAmount, tweenScaleTimer, maxSpeed, flexMaxSpeed = maxSpeed,
nitroSpeed = 650,
nitroTimer, rightSteerSimple = 0,
leftSteerSimple = 0,
hillAmount, saveDataHandler = new Utils.SaveDataHandler("sprintclubnitro1", 9),
aMapPointData = new Array([55, 136], [101, 249], [192, 140], [348, 107], [264, 272], [407, 304], [532, 221], [509, 53], [648, 213]),
levelTheme,
nitroMode,
raceProgress,
leadProgress,
leadHeadStart = .2,
raceLength,
enemySpeed,
racePos,
carReleasedNum,
carReleaseDelay,
speedDifferencial,
overtakenInc,
bridgeDistanceTarg,
firstPlay = !0,
startTimer,
aPowerUpBarData = new Array(0, 0, 0, 0),
aPowerUpButsData = new Array(100, 100, 250, 250, 500, 500, 1e3, 1e3, 1e3),
winnings = 0,
accRate,
nitroLength,
endSoundPlayed,
offRoad,
startStage,
musicTween,
justSkid;
loadPreAssets();