"use strict";

var splash = {
    canvas: document.getElementById("splash"),
    ctx: null,
    data: {
        score: {
            "onderzoeken": 4.8,
            "conceptualiseren": 3.25,
            "concretiseren": 7.5,
            "itereren": 6,
            "samenwerken": 4.5,
            "organiseren": 3,
            "ontwikkelen": 5.3
        },
        scoremax: 10
    },

    init: function init() {
        var _this = this;

        this.ctx = this.canvas.getContext("2d");

        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "center";

        this.redraw();

        window.addEventListener("resize", function () {

            _this.redraw();
        });
    },

    redraw: function redraw() {
        this.canvas.height = this.canvas.width = Math.min(window.innerWidth, window.innerHeight);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawOuterShape();
        this.drawSplash();
    },

    drawOuterShape: function drawOuterShape() {
        var data = this.data.score,
            sides = Object.keys(data).length,
            size = this.canvas.width / 3,
            xCenter = this.canvas.width / 2,
            yCenter = this.canvas.height / 2;

        for (var j = 1; j <= this.data.scoremax; j++) {

            var thisSize = size / this.data.scoremax * j;
            this.ctx.beginPath();
            this.ctx.moveTo(xCenter + thisSize * Math.cos(0), yCenter + thisSize * Math.sin(0));

            for (var i = 1; i <= sides; i++) {

                var x = xCenter + thisSize * Math.cos(i * 2 * Math.PI / sides),
                    y = yCenter + thisSize * Math.sin(i * 2 * Math.PI / sides);

                if (j === this.data.scoremax) this.ctx.fillText(Object.keys(data)[i - 1], x, y);

                this.ctx.lineTo(x, y);
            }

            if (j != this.data.scoremax) {
                this.ctx.strokeStyle = "#ccc";
            } else {
                this.ctx.strokeStyle = "#000";
                //this.ctx.fillText(Object.keys(data)[i - 1], x, y);
            }
            this.ctx.stroke();
        }
    },

    drawSplash: function drawSplash() {
        var data = this.data.score,
            sides = Object.keys(data).length,
            size = this.canvas.width / 3,
            xCenter = this.canvas.width / 2,
            yCenter = this.canvas.height / 2,
            radAngle = 2 * Math.PI / sides,
            radHalfAngle = radAngle / 2;

        this.ctx.beginPath();

        for (var i = 1; i <= sides; i++) {

            var prev = i > 1 ? i - 2 : sides - 1;
            var scalarPrev = data[Object.keys(data)[prev]] / this.data.scoremax;
            var scalar = data[Object.keys(data)[i - 1]] / this.data.scoremax;

            var targetLength = size * scalar;
            var previousLength = size * scalarPrev;
            var halfwayLength = size * Math.min(scalar, scalarPrev) * .75;

            var delta1 = previousLength - halfwayLength;
            var delta2 = targetLength - halfwayLength;

            var cp1 = this.canvas.height / this.map(delta1, 220, 30, 10, 50);
            var cp2 = this.canvas.height / this.map(delta2, 220, 30, 10, 50);

            console.log(previousLength, targetLength);

            var target = {
                x: xCenter + targetLength * Math.cos(i * radAngle),
                y: yCenter + targetLength * Math.sin(i * radAngle)
            };

            var previous = {
                x: xCenter + previousLength * Math.cos((i - 1) * radAngle),
                y: yCenter + previousLength * Math.sin((i - 1) * radAngle)
            };

            var halfway = {
                x: xCenter + halfwayLength * Math.cos(i * radAngle - radHalfAngle),
                y: yCenter + halfwayLength * Math.sin(i * radAngle - radHalfAngle)
            };

            var previousAngle = Math.atan2(previous.y - yCenter, previous.x - xCenter);
            var halfwayAngle = Math.atan2(halfway.y - yCenter, halfway.x - xCenter);

            var controlA = {
                x: previous.x + cp1 * Math.cos(previousAngle + Math.PI / 2),
                y: previous.y + cp1 * Math.sin(previousAngle + Math.PI / 2)
            };

            var controlB = {
                x: halfway.x + cp1 * Math.cos(halfwayAngle - Math.PI / 2),
                y: halfway.y + cp1 * Math.sin(halfwayAngle - Math.PI / 2)
            };

            var controlC = {
                x: halfway.x + cp2 * Math.cos(halfwayAngle + Math.PI / 2),
                y: halfway.y + cp2 * Math.sin(halfwayAngle + Math.PI / 2)
            };

            var targetAngle = Math.atan2(target.y - yCenter, target.x - xCenter);

            var controlD = {
                x: target.x + cp2 * Math.cos(targetAngle - Math.PI / 2),
                y: target.y + cp2 * Math.sin(targetAngle - Math.PI / 2)
            };

            if (i == 1) this.ctx.moveTo(previous.x, previous.y);

            this.ctx.bezierCurveTo(controlA.x, controlA.y, controlB.x, controlB.y, halfway.x, halfway.y);
            this.ctx.bezierCurveTo(controlC.x, controlC.y, controlD.x, controlD.y, target.x, target.y);
        }
        this.ctx.stroke();
        this.ctx.fill();
    },

    map: function map(src, in_min, in_max, out_min, out_max) {
        return (src - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
};

window.addEventListener("load", function () {
    splash.init();
});

//# sourceMappingURL=splash.js.map