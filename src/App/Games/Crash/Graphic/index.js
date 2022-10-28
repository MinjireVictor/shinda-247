/* eslint-disable */
import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Row, Col, Card } from "react-bootstrap";
import storage from "../../../../Storage";
import { __, wait, isMobile, getElement, Game } from "../../../../Helper";
import Engine from "../Engine";

const AXIS_NUMBER_COLOR = "#f5f5f5";
const AXIS_LINE_COLOR = "#ddd";
const COUNTER_COLOR = "#F8F8F8";
const LINE_COLOR = "#FFF";
const IN_GAME_COLOR = "#1ecab8";
const WAITING_COLOR = "#F8F8F8";
const EDGE_COLOR = "#FFF";
const BUSTED_COLOR = "#dc3545";
const WINNER_COLOR = "#03a9f4";
const FONT = "Titillium Web";

let cFont = null;

import BackgroundImage from "../../../../assets/graph_bg.jpg";

class Canvas extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      engine: Engine,
      gameCanvas: new GameCanvas(),
      canvasWidth: 950,
      canvasHeight: 280,
      connecting: true,
      status: "",
      timer: "",
      rate: "",
    };
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    let { engine } = this.state;
    engine.getStatus();
    this.handleResize();
    this.setState({ width: window.innerWidth });
    window.addEventListener("resize", this.handleResize);

    //let height = this.state.canvasHeight;
    let height = 700;

    //        if(isMobile()){
    //            height = 350;
    //        }

    wait(500).then(() => {
      this.initCanvas(height);
    });
    // console.log("trying to log graph data")
    // console.log(JSON.stringify(this.state.gameCanvas));
    engine.trigger.on("finish_crash", (data) => this.finish(data));
    engine.trigger.on("waiting_crash", (data) => this.waiting(data));
    engine.trigger.on("started_crash", (data) => this.started(data));
    engine.trigger.on("busted_crash", (data) => this.busted(data));
    engine.trigger.on("game_status", (data) => this.status(data));
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener("resize", this.handleResize);
    this.state.engine.trigger.removeAllListeners();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.profit) {
      this.state.gameCanvas.setAddons(nextProps.profit, nextProps.im_in_game);
    }
  }

  handleResize() {
    this.setState({ width: window.innerWidth });

    let canvasFont = 70;

    if (isMobile()) {
      canvasFont = 100;
    }

    cFont = canvasFont;
    storage.setKey("cFont", canvasFont);
  }

  initCanvas = (height) => {
    if (this._isMounted) {
      this.state.gameCanvas.init(height, this.state.canvasWidth);
    }
  };

  finish(data) {
    if (this._isMounted) {
      let { name } = data;
      this.state.gameCanvas.setFinisher(name);
    }
  }

  waiting(data) {
    if (this._isMounted) {
      let { time } = data;
      this.setState({ status: "waiting" });
      this.state.gameCanvas.setAddons(this.props.profit, this.props.im_in_game);
      this.state.gameCanvas.setWaiting(time);
    }
  }

  started(data) {
    if (this._isMounted) {
      let { time, md5 } = data;
      this.setState({ status: "started" });
      this.state.gameCanvas.setAddons(this.props.profit, this.props.im_in_game);
      this.state.gameCanvas.setPlaying(time, md5);
    }
  }

  busted(data) {
    if (this._isMounted) {
      let { amount, time, force } = data;
      let rate = (amount / 100).toFixed(2);
      this.state.gameCanvas.setAddons(this.props.profit, this.props.im_in_game);
      this.state.gameCanvas.setBusted(rate, time, force);
      this.setState({
        status: "busted",
        timer: time,
        rate: rate,
        force: force,
      });
    }
  }

  status(data) {
    if (this._isMounted) {
      let { amount, time, status } = data;

      this.setState({ status: status, timer: time, connecting: false });

      this.state.gameCanvas.setAddons(this.props.profit, this.props.im_in_game);

      switch (status) {
        case "started":
          this.state.gameCanvas.setPlaying(time);
          break;

        case "waiting":
          this.state.gameCanvas.setWaiting(time);
          break;

        case "busted":
          let rate = (amount / 100).toFixed(2);
          this.state.gameCanvas.setBusted(rate, time);
          break;
      }
    }
  }

  render() {
    let check = {
      display: "unset",
    };

    if (this.state.connecting) {
      check = {
        display: "none",
      };
    }
    return (
      <Card className={"no-shadow m-0"}>
        <Card.Body
          className="bg-body game-aria text-center no-shadow p-1 static-snow"
          id="canvasPart"
        >
          <div
            className="game-holder"
            style={{
              backgroundImage: `url(${BackgroundImage})`,
              backgroundPosition: "center center",
              bacgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            {this.state.connecting && (
              <div>
                <h3 className={"text-success font-35 my-5 d-block mb-5"}>
                  CONNECTING
                </h3>
                <b className={"mt-1 d-block mt-2 mb-5"}>
                  <div
                    className="spinner-grow text-success my-5"
                    role="status"
                  />
                </b>
              </div>
            )}
            <>
              <Card className={"mb-0 bg-transparent"}>
                <Card.Body className={"p-0"}>
                  <canvas id="graph" style={check} />
                </Card.Body>
              </Card>

              {/* <img src='/assets/images/jp.jpeg' className='jp-image'></img> */}
            </>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

function nr(value) {
  return null == value ? value : (0.5 + value) | 0;
}

function GameCanvas() {
  let self = this,
    i = 0;
  (self.nextround_text = "Next round in {time}s"),
    (self.busted_title = "@Chapaa"),
    (self.edge_text = null),
    (self.winner_text = null),
    (self.im_in_game = null),
    (self.maximum_text = ""),
    (self.game_status = 0),
    (self.start_time = 0),
    (self.started_time = 0),
    (self.time_passed = 0),
    (self.current_amount = 0),
    (self.busted_amount = 0),
    (self.cashin_amount = 0),
    (self.warning_text = null),
    (self.busted_text = null),
    (self.time_part = null),
    (self.amount_part = null),
    (self.graph_part = null),
    (self.canvas_size = null),
    (self.canvasWidth = false),
    (self.canvasHeight = false),
    (self.cashOuter = []),
    (self.coors = null),
    (self.setFinisher = function (name) {
      self.cashOuter.push(name);
    }),
    (self.setWaiting = function (value) {
      self.warning_text =
        self.time_part =
        self.amount_part =
        self.graph_part =
        self.busted_text =
          null;
      self.game_status = 1;
      self.start_time = new Date()["getTime"]() + value;
      self.time_passed = 0;
      self.started_time = 0;
      self.cashOuter = [];
    }),
    (self.setAddons = function (profit, in_game) {
      self.winner_text = profit;
      self.im_in_game = in_game;
    }),
    (self.setPlaying = function (value) {
      self.warning_text =
        self.time_part =
        self.amount_part =
        self.graph_part =
        self.busted_text =
          null;
      self.game_status = 2;
      self.started_time = new Date()["getTime"]() - value;
      self.time_passed = value;
    }),
    (self.setBusted = function (value, time, force) {
      self.warning_text =
        self.time_part =
        self.amount_part =
        self.graph_part =
        self.busted_text =
          null;
      self.game_status = 3;
      self.busted_amount = value;
      self.started_time = new Date()["getTime"]() - time;
      self.time_passed = time;
    }),
    // The

    (self.init = function (height, width) {
      self.canvas = getElement("#graph");
      self.context = self.canvas.getContext("2d");
      self.canvas_size = height;
      self.resize(height, width);
      self.rtimer = true;
      window.requestAnimationFrame(self.render);
    }),
    //added the padding here
    (self.resize = function (height, width) {
      null != height && (self.canvas_size = height);
      self.canvas.width = width * 1;
      self.canvas.height = height * 1;
      self.canvas.style.width = width + "px";
      self.canvas.style.maxWidth = "100%";
      self.canvas.style.maxHeight = "100%";
      self.canvas.style.padding = "20px";
      self.canvasWidth = width;
      //change the height of the graph from here
      self.canvasHeight = 500;
      self.coors = null;
    }),
    (self.render = function () {
      if (!self.rtimer) {
        return false;
      }
      self.context.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
      self.draw(self.context);
      window.requestAnimationFrame(self.render);
    }),
    (self.draw = function (value) {
      // console.log("Loggins self coors" + JSON.stringify(value))
      // console.log(JSON.stringify(self.coors));
      if (null == self.coors) {
        self.coors = {
          width: self.canvasWidth,
          height: self.canvasHeight,
        };

        let h = self.canvasHeight - 40;

        self.coors.origin = {
          x: nr(0.12 * h),
          y: nr(h - 0.07),
        };

        let font = nr(0.09 * h);
        let ttm = nr(0.08 * h);
        let dooGal = nr(h - 0.07);

        // Waiting Font
        self.coors.info = {
          x: nr((self.coors.width + ttm) / 2),
          y: nr(0.48 * self.coors.height),
          font: font,
          by: nr(0.36 * self.coors.height),
          bh: nr(1.7 * font),
        };

        // Busted Font
        // change font for Chapa here size here
        self.coors.busted = {
          x: nr((self.coors.width + ttm) / 2),
          y1: nr(0.51 * self.coors.height),
          y2: nr(0.65 * self.coors.height),
          font: nr(0.1 * h),
        };

        // Current Hash / BankRoll / Profit Font
        let UpFontSize = nr(0.05 * h);

        let getx2 = UpFontSize,
          getx24537 = nr(1.6 * ttm),
          getx24 = nr(0.6 * ttm - getx2),
          getx245372 = nr(getx24 + 1.5 * getx2),
          getx2453 = nr(getx245372 + 1.5 * getx2),
          getx245 = nr(getx2453 + 1.5 * getx2);

        self.coors.profit = {
          x: getx24537,
          y1: getx24,
          y2: getx245372,
          y3: getx2453,
          y4: getx245,
          font: getx2,
        };

        let spaceInBelowNumbers = self.canvasWidth + 60;

        // You can change the axis parameters from here
        let gety1 = nr(spaceInBelowNumbers + ttm),
          gety12 = nr(dooGal),
          gety123 = nr(0.055 * h), // Axis Font Size
          gety1234 = nr(ttm - -0.5 * gety123), // Y AXIS LEFT AND RIGHT
          gety12345 = nr(dooGal + 1.0 * gety123), // X AXIS UP AND DOWN
          gety123457 = nr(0.3 * gety123),
          gety123457891 = nr(dooGal - 0.2 * gety123), // min axis down
          gety12345789 = nr(ttm + 1.1 * gety123); // min axis left

        self.coors.axis = {
          x: gety1,
          y: gety12,
          font: gety123,
          tx: gety1234,
          th: gety123457,
          ty: gety12345,
          lx: gety12345789,
          ly: gety123457891,
        };

        // Counter Number Font
        let gety1z221 = nr(0.2 * h),
          gety1z = nr((self.coors.width + ttm) / 2),
          gety1z2 = nr(0.56 * self.coors.height);

        self.coors.amount = {
          x: gety1z,
          y: gety1z2,
          font: gety1z221,
        };
      }

      if (
        (self.drawAxis(value),
        self.drawMaximum(value),
        self.drawAxisLabels(value),
        1 === self.game_status)
      ) {
        self.drawWaiting(value);
      } else {
        if (2 === self.game_status) {
          self.drawGraph(value);
          self.drawAmount(value);
        } else {
          3 === self.game_status && self.drawBusted(value);
        }
      }
    }),
    // change the line width of the graphs from here
    (self.drawAxis = function (value) {
      value.lineWidth = 1;
      value.strokeStyle = AXIS_LINE_COLOR;
      value.beginPath();
      value.moveTo(self.coors.origin.x, 0);
      value.lineTo(self.coors.origin.x, self.coors.origin.y);
      value.lineTo(self.coors.width, self.coors.origin.y);
      value.stroke();
      value.closePath();
    }),
    (self.drawMaximum = function (value) {
      (value.fillStyle = "#b0b3c1"), (value.textAlign = "left");
      null != self.maximum_text &&
        ((value.font = self.coors.profit.font + "px " + FONT + " , " + FONT),
        value.fillText(
          self.maximum_text,
          self.coors.profit.x,
          self.coors.profit.y1
        )),
        null != self.winner_text &&
          ((value.fillStyle = WINNER_COLOR),
          (value.font = self.coors.profit.font + "px " + FONT + " , " + FONT),
          value.fillText(
            self.winner_text,
            self.coors.profit.x,
            self.coors.profit.y2
          )),
        null != self.edge_text &&
          ((value.fillStyle = EDGE_COLOR),
          (value.font = `lighter normal 300 ${self.coors.profit.font}px/1 "${FONT}"`),
          value.fillText(
            self.edge_text,
            self.coors.profit.x,
            self.coors.profit.y4
          ));
    }),
    (self.drawAxisLabels = function (value) {
      self.game_status === 2 &&
        self.warning_text === null &&
        (self.time_passed = new Date()["getTime"]() - self.started_time),
        (value.strokeStyle = AXIS_NUMBER_COLOR);
      value.fillStyle = AXIS_NUMBER_COLOR;
      value.textAlign = "center";
      //change the size of the graph numbers here
      //value.font = `small-caps ${self.coors.axis.font}px ` + FONT;
      value.font = `small-caps 20px ` + FONT;

      let ttm = self.time_passed < 1e4 ? 10 : nr(self.time_passed / 1e3);

      if (
        (null == self.time_part && (self.time_part = 2),
        ttm > 20 && ttm > 7 * self.time_part)
      ) {
        for (
          self.time_part === 2 && (self.time_part = 10);
          !(ttm < 3 * self.time_part);

        ) {
          self.time_part += 10;
        }
      }

      for (value.beginPath(), i = 0; i < Math.ceil(ttm / self.time_part); i++) {
        let dooGal = self.time_part * i * 1e3,
          dooGalw =
            self.coors.origin.x +
            (self.coors.axis.x * dooGal) /
              (self.time_passed < 1e4 ? 1e4 : self.time_passed);
        value.fillText(self.time_part * i, dooGalw, self.coors.axis.ty),
          i > 0 &&
            (value.moveTo(dooGalw, self.coors.origin.y),
            value.lineTo(dooGalw, self.coors.axis.ly));
      }

      value.stroke(), value.closePath(), (value.textAlign = "right");
      self.current_amount = Math.pow(Math.E, 6e-5 * self.time_passed).toFixed(
        2
      );
      let getws = nr(100 * self.current_amount) - 100,
        getby = getws < 100 ? 100 : getws;

      if (
        (null == self.amount_part && (self.amount_part = 20),
        getby > 150 && getby > 6 * self.amount_part)
      ) {
        for (self.amount_part = 100; !(getby <= 6 * self.amount_part); ) {
          self.amount_part *= 2;
        }
      }

      for (
        value.beginPath(), i = 0;
        i < Math["ceil"](getby / self.amount_part);
        i++
      ) {
        if (0 !== i) {
          let getbyh =
              self.coors.origin.y -
              (self.coors.axis.y * self.amount_part * i) /
                (getws < 100 ? 100 : getws),
            getbyhxf = (self.amount_part * i + 100) / 100 + "x";
          value.fillText(
            getbyhxf,
            self.coors.axis.tx,
            getbyh + self.coors.axis.th
          ),
            value.moveTo(self.coors.origin.x, getbyh),
            value.lineTo(self.coors.axis.lx, getbyh);
        }
      }

      value.stroke(), value.closePath();
    });

  self.drawGraph = function (value) {
    var gradient = value.createLinearGradient(0, 0, self.canvasWidth, 0);
    gradient.addColorStop("0", "#F5A358");
    gradient.addColorStop("0.5", "#D67509");
    gradient.addColorStop("1.0", "#ff490f");
    for (
      value.strokeStyle = self.im_in_game ? IN_GAME_COLOR : gradient,
        //Adjust the line width for the graph from here
        value.lineWidth = 2,
        value.beginPath(),
        value.moveTo(self.coors.origin.x, self.coors.origin.y),
        null == self.graph_part && (self.graph_part = 100),
        self.time_passed > 100 * self.graph_part && (self.graph_part *= 2),
        i = 0;
      i < self.time_passed;
      i += self.graph_part
    ) {
      Game["current_amount"] = self.current_amount;

      let ttm =
          self.coors.origin.x +
          (self.coors.axis.x * i) /
            (self.time_passed < 1e4 ? 1e4 : self.time_passed),
        dooGal =
          self.coors.origin.y -
          (self.coors.axis.y * (nr(100 * Math.pow(Math.E, 6e-5 * i)) - 100)) /
            (self.current_amount < 2 ? 100 : 100 * self.current_amount - 100);
      value.lineTo(ttm, dooGal);
    }
    let ttm =
      self.coors.origin.x +
      (self.coors.axis.x * i) /
        (self.time_passed < 1e4 ? 1e4 : self.time_passed);
    let dooGal =
      self.coors.origin.y -
      (self.coors.axis.y * (nr(100 * Math.pow(Math.E, 6e-5 * i)) - 100)) /
        (self.current_amount < 2 ? 100 : 100 * self.current_amount - 100);

    if (ttm > 950) ttm = 950;

    if (dooGal < 30) dooGal = 30;

    if (self.cashOuter.length !== 0) {
      self.cashOuter.forEach((name, i) => {
        value.fillStyle = "#FFF";
        value.fillText(name, ttm, dooGal + 20 * i);
        var ti = setTimeout(() => {
          self.cashOuter.splice(i, 1);
          clearTimeout(ti);
        }, 700);
      });
    }

    value.stroke();
    value.closePath();
  };

  self.drawAmount = function (value) {
    self.canvas.style.fontWeight = 700;
    self.canvas.style.textShadow = 0;
    value.fontWeight = 700;
    // The burst is calculated here
    let ttm = Math.pow(Math.E, 6e-5 * self.time_passed).toFixed(2);
    value.fillStyle = self.im_in_game ? IN_GAME_COLOR : COUNTER_COLOR;
    value.textAlign = "center";
    let canvasFont = cFont !== null ? cFont : storage.getKey("cFont");
    //change the counter size from this line
    // value.font = `normal normal 700 ${canvasFont}px/1 "${FONT}"`;
    value.font = `normal normal 700 160px "${FONT}"`;
    value.fillText(ttm + "x", self.coors.amount.x, self.coors.amount.y);
  };

  self.drawBusted = function (value) {
    null == self.busted_text &&
      (self.busted_text = {
        // Modify the Busted text from here
        line1: self.busted_title + " " + self.busted_amount + "x",
      });
    value.fillStyle = BUSTED_COLOR;
    value.textAlign = "center";
    var s = self.coors.busted.font;
    value.font = `normal normal 700 ${s}px/1 "${FONT}"`;
    value.fillText(
      self.busted_text.line1,
      self.coors.busted.x,
      self.coors.busted.y1
    );
  };

  self.drawWaiting = function (value) {
    let timer = (self.start_time - new Date()["getTime"]()) / 1e3;
    timer = timer <= 0 ? "0.0" : timer.toFixed(1);
    value.fillStyle = WAITING_COLOR;
    value.textAlign = "center";
    var s = self.coors.info.font;
    value.font = `normal normal 700 ${s}px/1 "${FONT}"`;
    value.fillText(
      self.nextround_text.replace("{time}", timer),
      self.coors.info.x,
      self.coors.info.y
    );
  };
}

Canvas.propTypes = {
  profit: PropTypes.string,
  //    im_in_game: PropTypes.string
};

const mapStateToProps = (state) => ({
  profit: state.items.profit,
  im_in_game: state.items.im_in_game,
});

export default connect(mapStateToProps, {})(Canvas);
