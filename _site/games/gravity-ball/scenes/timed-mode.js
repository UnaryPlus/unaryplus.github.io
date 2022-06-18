class TimedMode extends Phaser.Scene {
    constructor() {
        super("timed-mode")
    }
    
    create() {
        //create timed mode text
        this.add.text(300, 100, "timed", fontStyle).setOrigin(0.5, 0.5)
        this.timeText = this.add.text(300, 160, "mode", fontStyle).setOrigin(0.5, 0.5)

        //create level select button
        const levelSelectButton = this.add.image(75, 150, "level-select-button").setInteractive()
        levelSelectButton.on("pointerdown", () => {
            levelSelectButton.setScale(1.1)
        })
        levelSelectButton.on("pointerover", (pointer) => {
            if(pointer.isDown) {
                levelSelectButton.setScale(1.1)
            }
        })
        levelSelectButton.on("pointerout", () => {
            levelSelectButton.setScale(1)
        })
        levelSelectButton.once("pointerup", () => {
            this.scene.start("level-select", Math.floor((data.lastUnlockedLevel - 1) / 8) + 1)
        })

        //create costume select button
        const costumeSelectButton = this.add.image(525, 150, "costume-select-button").setInteractive()
        costumeSelectButton.on("pointerdown", () => {
            costumeSelectButton.setScale(1.1)
        })
        costumeSelectButton.on("pointerover", (pointer) => {
            if(pointer.isDown) {
                costumeSelectButton.setScale(1.1)
            }
        })
        costumeSelectButton.on("pointerout", () => {
            costumeSelectButton.setScale(1)
        })
        costumeSelectButton.once("pointerup", () => {
            this.scene.start("costume-select", { sceneNumber: 1, levelNumber: "timed-mode" })
        })

        //create mode select button
        const modeSelectButton = this.add.image(75, 250, "mode-select-button").setInteractive()
        modeSelectButton.on("pointerdown", () => {
            modeSelectButton.setScale(1.1)
        })
        modeSelectButton.on("pointerover", (pointer) => {
            if(pointer.isDown) {
                modeSelectButton.setScale(1.1)
            }
        })
        modeSelectButton.on("pointerout", () => {
            modeSelectButton.setScale(1)
        })
        modeSelectButton.once("pointerup", () => {
            this.scene.start("mode-select")
        })

        //create how to play button
        const howToPlayButton = this.add.image(525, 250, "how-to-play-button").setInteractive()
        howToPlayButton.on("pointerdown", () => {
            howToPlayButton.setScale(1.1)
        })
        howToPlayButton.on("pointerover", (pointer) => {
            if(pointer.isDown) {
                howToPlayButton.setScale(1.1)
            }
        })
        howToPlayButton.on("pointerout", () => {
            howToPlayButton.setScale(1)
        })
        howToPlayButton.once("pointerup", () => {
            this.scene.start("how-to-play", "timed-mode")
        })

        //create player
        this.player = this.matter.add.image(300, 250, "costumes", data.costume)
        .setCircle(25)
        .setBounce(0.5)
        .setFriction(0)

        if(data.scores.timedMode.length > 0) {
            //calculate best, previous, and average scores
            const best = data.scores.timedMode.reduce((a, b) => Math.max(a, b), 0)
            const previous = data.scores.timedMode[data.scores.timedMode.length - 1]
            const average = data.scores.timedMode.reduce((a, b) => a + b, 0) / data.scores.timedMode.length

            //add line and text for best score
            this.add.line(300, best, 0, 0, 600, 0, 0xffffff).setDepth(1)
            this.add.text(5, best - 25, "best score", fontStyle).setFontSize(20).setDepth(1)

            //add line and text for previous score (unless the lines would be too close)
            if(previous + 75 < best || previous - 75 > best) {
                this.add.line(300, previous, 0, 0, 600, 0, 0xffffff).setDepth(1)
                this.add.text(5, previous - 25, "previous score", fontStyle).setFontSize(20).setDepth(1)
            }

            //add line and text for average score (unless the lines would be too close)
            if(average + 100 < best || average - 100 > best) {
                if(average + 75 < previous || average - 75 > previous) {
                    this.add.line(300, average, 0, 0, 600, 0, 0xffffff).setDepth(1)
                    this.add.text(5, average - 25, "average score", fontStyle).setFontSize(20).setDepth(1)
                }
            }
        }
        
        const onStart = f => {
            if(mobile) this.input.once("pointerup", f)
            else this.input.keyboard.once("keydown", f)
        }
        
        //start game and timer when key is pressed
        this.started = false
        this.gameOver = false
        onStart(() => {
            this.started = true
            this.timeLeft = 20
            this.timeText.setX(255).setText("20.0").setOrigin(0, 0.5).setDepth(1)
            this.time.addEvent({
                delay: 100,
                callback: () => { 
                    this.timeLeft -= 0.1
                    this.timeLeft = Math.round(this.timeLeft * 10) / 10
                    this.timeLeft = Math.max(this.timeLeft, 0)
                    if(Number.isInteger(this.timeLeft)) {
                        this.timeText.setText(this.timeLeft + ".0")
                    }
                    else {
                        this.timeText.setText(this.timeLeft)
                    }
                },
                repeat: -1,
            })
            this.time.addEvent({
                delay: 2000,
                callback: () => {
                    this.tweens.add({
                        targets: this.timeText,
                        x: 30,
                        duration: 1500
                    })
                }
            })
        })
        
        //set gravity to 0
        this.matter.world.setGravity(0, 0)
        
        if(!mobile) {
            //object for detecting if arrow keys are pressed
            this.keys = this.input.keyboard.createCursorKeys()
        }
        
        //stuff for creating obstacles
        this.obstacleFactory = new ObstacleFactory(this)
        this.nextObstacleY = 400
        
        //downward speed of camera
        this.cameraSpeed = 2
    }
    
    update() {
        //create obstacles before they appear on screen
        if(this.cameras.main.scrollY > this.nextObstacleY - gameHeight - 200) {
            this.nextObstacleY += this.obstacleFactory.createEndlessModeObstacle(this.nextObstacleY, true)
        }

        if(!this.started) {
            return
        }

        if(mobile) {
            //control player by changing gravity if the screen is pressed
            if(this.input.activePointer.isDown) {
                if(this.input.activePointer.x < 300) {
                    this.matter.world.setGravity(-1, 1)
                }
                else {
                    this.matter.world.setGravity(1, 1)
                }
            }
            else {
                this.matter.world.setGravity(0, 1)
            }
        }
        else {
            //control player by changing gravity if arrow keys are pressed
            this.matter.world.setGravity(this.keys.left.isDown ? -1 : this.keys.right.isDown ? 1 : 0, 1)
        }
        this.player.setAngularVelocity(this.player.body.velocity.x / 50)
        
        //keep player from going off left or right side of screen
        this.matter.world.setBounds(0, this.cameras.main.scrollY - 200, 600, gameHeight + 200, 50, true, true, false, false)

        //move camera downward and increase speed
        this.cameras.main.scrollY += this.cameraSpeed
        if(this.cameraSpeed < 3) this.cameraSpeed += 0.001

        //have camera follow player if it is close to the bottom of the viewport
        if(this.cameras.main.scrollY < this.player.y - gameHeight + 100) {
            this.cameras.main.scrollY = this.player.y - gameHeight + 100
        }

        //move time text downward so it stays in a fixed place on the screen
        this.timeText.setY(Math.max(this.cameras.main.scrollY + 50, this.timeText.y))
        
        //restart and add score to list of scores if player is out of the viewport
        if((this.cameras.main.scrollY > this.player.y + 30 || this.timeLeft === 0) && !this.gameOver) {
            this.gameOver = true
            this.cameras.main.shake(1000, 0.02)
            data.scores.timedMode.push(this.player.y)

            //save data to local storage
            window.localStorage.setItem("gravity-ball-data", JSON.stringify(data))

            this.tweens.add({
                targets: this.cameras.main,
                alpha: -1,
                onComplete: () => this.scene.restart()
            })
        }
    }
}