let splash = {
    canvas: document.getElementById("splash"),
    ctx: null,
    data: {
        descriptions: [ "onderzoeken",
                        "conceptualiseren",
                        "concretiseren",
                        "itereren",
                        "samenwerken",
                        "organiseren",
                        "ontwikkelen"],
        scoreSets: [{
            name: "Je peerscore",
            fillstyle: "red",
            strokestyle: "none",
            score: [4.8, 3.25, 7.5, 6, 4.5, 3, 5.3],
            enabled: true
            },
            {
            name: "Je zelfreflectie",
            fillstyle: "none",
            strokestyle: "black",
            score: [3.25, 7.5, 6, 4.5, 3, 5.3, 4.8],
            enabled: false
            },
            {
                name: "Het gemiddelde van alle studenten",
                fillstyle: "none",
                strokestyle: "blue",
                score: [7.5, 6, 4.5, 3, 5.3, 4.8, 3.25],
                enabled: false
            }
        ],
        scoremax: 10
    },

    init: function () {

        this.ctx = this.canvas.getContext("2d");

        console.log(this.getNames());
        this.getCheckboxes();

        this.redraw();

        window.addEventListener("resize", () => {

            this.redraw()
        });
    },

    getNames: function() {
        return this.data.scoreSets.map(set => {
           return set.name;
        });
    },
    setEnabled: function(name,to) {
        console.log(name,to);
        this.data.scoreSets.forEach(set => {
            if (set.name === name)
                set.enabled = to;
        });
        this.redraw();
    },
    getCheckboxes: function() {
        this.data.scoreSets.forEach((set, i) => {
            var chk = document.createElement("input");
            chk.type = "checkbox";
            if (i==0) chk.checked = true;
            chk.id = set.name.replace(" ","_").toLowerCase();
            chk.onclick = (e) => {console.log(e.srcElement.checked);this.setEnabled(set.name,e.srcElement.checked)}
            let lbl = document.createElement("label");
            lbl.htmlFor = set.name.replace(" ","_").toLowerCase();
            lbl.innerHTML = set.name;
            document.body.appendChild(chk)
            document.body.appendChild(lbl)
        });
    },

    redraw: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);
        this.drawOuterShape();
        this.data.scoreSets.forEach(set => {
            if (set.enabled)
                this.drawSplash(set);
        });
    },

    drawOuterShape: function () {
        let sides = this.data.descriptions.length,
            size = Math.min(this.canvas.width,this.canvas.height)/3,
            xCenter = this.canvas.width/2,
            yCenter = this.canvas.height/2;

        for (let j = 1; j <= this.data.scoremax; j++) {

            let thisSize = (size / this.data.scoremax) * j;
            this.ctx.beginPath();
            this.ctx.moveTo(xCenter + thisSize * Math.cos(0), yCenter + thisSize * Math.sin(0));

            for (let i = 1; i <= sides; i++) {

                let x = xCenter + thisSize * Math.cos(i * 2 * Math.PI / sides),
                    y = yCenter + thisSize * Math.sin(i * 2 * Math.PI / sides);


                if (j === this.data.scoremax) {
                    this.ctx.font= "16px Arial";
                    this.ctx.textAlign = (x < xCenter ? "right" : "left");
                    this.ctx.fillText(this.data.descriptions[i - 1], x, y);
                }

                this.ctx.lineTo(x, y)
            }

            if (j != this.data.scoremax){
                this.ctx.strokeStyle = "#ccc";
            } else {
                this.ctx.strokeStyle = "#000";
            }
            this.ctx.stroke();
        }



    },

    drawSplash: function(scoreSet) {
        let data = scoreSet.score,
            sides = scoreSet.score.length,
            size = Math.min(this.canvas.width,this.canvas.height)/3,
            xCenter = this.canvas.width/2,
            yCenter = this.canvas.height/2,
            radAngle = 2 * Math.PI / sides,
            radHalfAngle = radAngle / 2;

        this.ctx.save();

        this.ctx.beginPath();


        for (let i = 1; i <= sides; i++){

            let prev = (i>1 ? i-2 : sides-1);
            let scalarPrev = data[Object.keys(data)[prev]] / this.data.scoremax;
            let scalar = data[Object.keys(data)[i-1]] / this.data.scoremax;

            let targetLength = size * scalar;
            let previousLength = size * scalarPrev;
            let halfwayLength = size * Math.min(scalar,scalarPrev) * .75;

            let delta1 = previousLength - halfwayLength;
            let delta2 = targetLength - halfwayLength;

            let cp1 = this.canvas.height / this.map(delta1,220,30,10,50);
            let cp2 = this.canvas.height / this.map(delta2,220,30,10,50);

            let target = {
                x: xCenter + targetLength * Math.cos(i * radAngle),
                y: yCenter + targetLength * Math.sin(i * radAngle)
            };

            let previous = {
                x: xCenter + previousLength * Math.cos((i-1) * radAngle),
                y: yCenter + previousLength * Math.sin((i-1) * radAngle)
            };


            let halfway = {
                x: xCenter + halfwayLength * Math.cos(i * radAngle - radHalfAngle),
                y: yCenter + halfwayLength * Math.sin(i * radAngle - radHalfAngle)
            };
            
            let previousAngle =  Math.atan2(previous.y - yCenter, previous.x - xCenter);
            let halfwayAngle = Math.atan2(halfway.y - yCenter, halfway.x - xCenter);


            let controlA = {
                x: previous.x + (cp1 * Math.cos(previousAngle + Math.PI/2)),
                y: previous.y + (cp1 * Math.sin(previousAngle + Math.PI/2))
            };

            let controlB = {
                x: halfway.x + (cp1 * Math.cos(halfwayAngle - Math.PI/2)),
                y: halfway.y + (cp1 * Math.sin(halfwayAngle - Math.PI/2))
            };

            let controlC = {
                x: halfway.x + (cp2 * Math.cos(halfwayAngle + Math.PI/2)),
                y: halfway.y + (cp2 * Math.sin(halfwayAngle + Math.PI/2))
            };

            let targetAngle = Math.atan2(target.y - yCenter, target.x - xCenter);

            let controlD = {
                x: target.x + (cp2 * Math.cos(targetAngle - Math.PI/2)),
                y: target.y + (cp2 * Math.sin(targetAngle - Math.PI/2))
            };

            if (i==1)
                this.ctx.moveTo(previous.x, previous.y);

            this.ctx.bezierCurveTo(
                controlA.x, controlA.y,
                controlB.x, controlB.y,
                halfway.x, halfway.y
            );
            this.ctx.bezierCurveTo(
                controlC.x, controlC.y,
                controlD.x, controlD.y,
                target.x, target.y
            );
        }

        this.ctx.fillStyle = scoreSet.fillstyle;
        if (scoreSet.strokestyle != "none") {
            this.ctx.strokeStyle = scoreSet.strokestyle;
            this.ctx.stroke();
            console.log("stroke");
        }
        if (scoreSet.fillstyle != "none") {
            this.ctx.fillStyle = scoreSet.fillstyle;
            this.ctx.fill();
        }
    },

    map: function (src, in_min, in_max, out_min, out_max) {
        return (src - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    }
};

window.addEventListener("load", ()=> {splash.init()});