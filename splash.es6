let splash = {
    canvas: document.createElement("canvas"),
    parent: null,
    ctx: null,
    data: {},

    init: function (parentId, data) {
        this.parent = document.getElementById(parentId);
        this.parent.appendChild(this.canvas);

        this.data = data;

        this.ctx = this.canvas.getContext("2d");

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
            chk.checked = set.enabled;
            chk.id = set.name.replace(" ","_").toLowerCase();
            chk.onclick = (e) => {console.log(e.srcElement.checked);this.setEnabled(set.name,e.srcElement.checked)}
            let lbl = document.createElement("label");
            lbl.htmlFor = set.name.replace(" ","_").toLowerCase();
            lbl.innerHTML = set.name;
            this.parent.appendChild(chk)
            this.parent.appendChild(lbl)
        });
    },

    redraw: function () {
        this.canvas.width = this.parent.clientWidth;
        this.canvas.height = this.parent.clientHeight;
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
            yCenter = this.canvas.height/2,
            scale = this.data.scoremax - this.data.scoremin;

        for (let j = 1; j <= scale; j++) {

            let thisSize = (size / scale) * j;
            this.ctx.beginPath();
            this.ctx.moveTo(xCenter + thisSize * Math.cos(0), yCenter + thisSize * Math.sin(0));

            for (let i = 1; i <= sides; i++) {

                let x = xCenter + thisSize * Math.cos(i * 2 * Math.PI / sides),
                    y = yCenter + thisSize * Math.sin(i * 2 * Math.PI / sides);


                if (j === scale) {
                    this.ctx.font= "14x Lato";
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
            sides = this.data.descriptions.length,
            size = Math.min(this.canvas.width,this.canvas.height)/3,
            xCenter = this.canvas.width/2,
            yCenter = this.canvas.height/2,
            radAngle = 2 * Math.PI / sides,
            radHalfAngle = radAngle / 2,
            scale = this.data.scoremax - this.data.scoremin;

        this.ctx.save();

        this.ctx.beginPath();

        for (let i = 1; i <= sides; i++){

            let score = data.find( item => item["tags"] === this.data.descriptions[i-1] )["average"],
                prev = (i>1 ? i-2 : sides-1),
                scorePrev = data.find( item => item["tags"] === this.data.descriptions[prev] )["average"];

            let scalarPrev = (scorePrev-this.data.scoremin) / scale;
            let scalar = (score-this.data.scoremin) / scale;

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
            this.ctx.stroke()
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

//splash.init("splash",{"descriptions":["Onderzoeken","Concretiseren","Conceptualiseren","Itereren","Samenwerken","Organiseren","Ontwikkelen"],"scoreSets":[{"name":"Je peerscore","fillstyle":"red","strokestyle":"none","enabled":true,"score":[{"tags":"Conceptualiseren","average":"6.6875"},{"tags":"Concretiseren","average":"6.75"},{"tags":"Itereren","average":"7.5"},{"tags":"Onderzoeken","average":"7.333333333333333"},{"tags":"Ontwikkelen","average":"7.375"},{"tags":"Organiseren","average":"6.875"},{"tags":"Samenwerken","average":"7.392857142857143"}]},{"name":"Je zelfreflectie","fillstyle":"none","strokestyle":"blue","enabled":false,"score":[{"tags":"Conceptualiseren","average":"7.25"},{"tags":"Concretiseren","average":"7.75"},{"tags":"Itereren","average":"7.333333333333333"},{"tags":"Onderzoeken","average":"6.666666666666667"},{"tags":"Ontwikkelen","average":"8"},{"tags":"Organiseren","average":"6.25"},{"tags":"Samenwerken","average":"7.428571428571429"}]},{"name":"De gemiddelde score","fillstyle":"none","strokestyle":"black","enabled":false,"score":[{"tags":"Conceptualiseren","average":"6.978472222222222"},{"tags":"Concretiseren","average":"7.01875"},{"tags":"Itereren","average":"7.071296296296296"},{"tags":"Onderzoeken","average":"6.997222222222222"},{"tags":"Ontwikkelen","average":"7.052083333333333"},{"tags":"Organiseren","average":"7.020833333333333"},{"tags":"Samenwerken","average":"7.01984126984127"}]}],"scoremax":10,"scoremin":5})