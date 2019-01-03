
export class ThermostatDialOptions {
  diameter: number;
  minValue: number;
  maxValue: number;
  numTicks: number;
  onSetTargetTemperature: (targetTemperature: number) => void;
}

class ThermostatDialProperties {
  tickDegrees: number;
  rangeValue: number;
  radius: number;
  ticksOuterRadius: number;
  ticksInnerRadius: number;
  hvac_states: string[];
  dragLockAxisDistance: number;
  lblAmbientPosition: number[];
  offsetDegrees: number;
}

class ThermostatDialState {
  constructor(public target_temperature: number,
              public ambient_temperature: number,
              public hvac_state: string,
              public has_leaf: boolean,
              public away: boolean,
              public loading: boolean
  ){}
}

export class ThermostatDial {

	/*
	 * Utility functions
	 */

	// Create an element with proper SVG namespace, optionally setting its attributes and appending it to another element
	private createSVGElement(tag,attributes,appendTo): SVGAElement {
		var element = document.createElementNS('http://www.w3.org/2000/svg',tag);
		this.attr(element,attributes);
		if (appendTo) {
			appendTo.appendChild(element);
		}
		return element;
	}

	// Set attributes for an element
  private attr(element,attrs) {
		for (var i in attrs) {
			element.setAttribute(i,attrs[i]);
		}
	}

	// Rotate a cartesian point about given origin by X degrees
  private rotatePoint(point, angle, origin) {
		var radians = angle * Math.PI/180;
		var x = point[0]-origin[0];
		var y = point[1]-origin[1];
		var x1 = x*Math.cos(radians) - y*Math.sin(radians) + origin[0];
		var y1 = x*Math.sin(radians) + y*Math.cos(radians) + origin[1];
		return [x1,y1];
	}

	// Rotate an array of cartesian points about a given origin by X degrees
  private rotatePoints(points, angle, origin) {
	  const that = this;
		return points.map(function(point) {
			return that.rotatePoint(point, angle, origin);
		});
	}

	// Given an array of points, return an SVG path string representing the shape they define
  private pointsToPath(points) {
		return points.map(function(point, iPoint) {
			return (iPoint>0?'L':'M') + point[0] + ' ' + point[1];
		}).join(' ')+'Z';
	}

  private circleToPath(cx, cy, r) {
		return [
			"M",cx,",",cy,
			"m",0-r,",",0,
			"a",r,",",r,0,1,",",0,r*2,",",0,
			"a",r,",",r,0,1,",",0,0-r*2,",",0,
			"z"
		].join(' ').replace(/\s,\s/g,",");
	}

  private donutPath(cx,cy,rOuter,rInner) {
		return this.circleToPath(cx,cy,rOuter) + " " + this.circleToPath(cx,cy,rInner);
	}

	// Restrict a number to a min + max range
  private restrictToRange(val,min,max) {
		if (val < min) return min;
		if (val > max) return max;
		return val;
	}

	// Round a number to the nearest 0.5
  private roundHalf(num) {
		return Math.round(num*2)/2;
	}

  private setClass(el, className, state) {
		el.classList[state ? 'add' : 'remove'](className);
	}

  /*
   * Property getter / setters
   */
  get target_temperature(): number {
    return this.state.target_temperature;
  }

  set target_temperature(val: number) {
    this.state.target_temperature = this.restrictTargetTemperature(+val);
    this.render();
  }

  get ambient_temperature(): number {
    return this.state.ambient_temperature;
  }

  set ambient_temperature(val: number) {
    this.state.ambient_temperature = this.roundHalf(+val);
    this.render();
  }

  get hvac_state(): string {
    return this.state.hvac_state;
  }

  set hvac_state(val: string) {
    if (this.properties.hvac_states.indexOf(val)>=0) {
      this.state.hvac_state = val;
      this.render();
    }
  }

  get has_leaf(): boolean {
    return this.state.has_leaf;
  }

  set has_leaf(val: boolean) {
    this.state.has_leaf = !!val;
    this.render();
  }

  get away(): boolean {
    return this.state.away;
  }

  set away(val: boolean) {
    this.state.away = !!val;
    this.render();
  }

  get loading(): boolean {
    return this.state.loading;
  }

  set loading(val: boolean) {
    this.state.loading = !!val;
    this.render();
  }

  private targetElement: Element;
  private options: ThermostatDialOptions;
  private state: ThermostatDialState;
  private properties: ThermostatDialProperties;

  private startDelay;
  /*
   * Drag to control
   */
  private _drag = {
    inProgress: false,
    startPoint: null,
    startTemperature: 0,
    lockAxis: undefined
  };

  private theta: number;

  private tickPointsLarge: number[][];
  private tickPoints: number[][];

  private svg: Element;
  private tickArray: Element[];
  private lblAmbient: Element;
  private lblAmbient_text: Text;
  private lblTarget_text: Text;
  private lblTargetHalf: Element;

  /*
   * The "MEAT"
   */

	public constructor(targetElement: Element, options?: ThermostatDialOptions) {
		/*
		 * Options
		 */
		if (!options)
		  options = new ThermostatDialOptions();

		options = {
			diameter: options.diameter || 400,
			minValue: options.minValue || 10, // Minimum value for target temperature
			maxValue: options.maxValue || 30, // Maximum value for target temperature
			numTicks: options.numTicks || 150, // Number of tick lines to display around the dial
			onSetTargetTemperature: options.onSetTargetTemperature || function() {}, // Function called when new target temperature set by the dial
		};
		this.options = options;
		this.targetElement = targetElement;

		/*
		 * Properties - calculated from options in many cases
		 */
		this.properties = new ThermostatDialProperties();
    this.properties.tickDegrees = 300; //  Degrees of the dial that should be covered in tick lines
    this.properties.rangeValue = options.maxValue - options.minValue;
    this.properties.radius = options.diameter/2;
    this.properties.ticksOuterRadius = options.diameter / 30;
    this.properties.ticksInnerRadius = options.diameter / 8;
    this.properties.hvac_states = ['off', 'heating', 'cooling'];
    this.properties.dragLockAxisDistance = 15;
    this.properties.lblAmbientPosition = [this.properties.radius, this.properties.ticksOuterRadius-(this.properties.ticksOuterRadius-this.properties.ticksInnerRadius)/2];
    this.properties.offsetDegrees = 180-(360-this.properties.tickDegrees)/2;

		/*
		 * Object state
		 */
		this.state = new ThermostatDialState(
			options.minValue,
			options.minValue,
      this.properties.hvac_states[0],
			false,
			false,
      true
    );

    this.tickPointsLarge = [
      [this.properties.radius-1.5, this.properties.ticksOuterRadius],
      [this.properties.radius+1.5, this.properties.ticksOuterRadius],
      [this.properties.radius+1.5, this.properties.ticksInnerRadius+20],
      [this.properties.radius-1.5, this.properties.ticksInnerRadius+20]
    ];
    this.tickPoints = [
      [this.properties.radius-1, this.properties.ticksOuterRadius],
      [this.properties.radius+1, this.properties.ticksOuterRadius],
      [this.properties.radius+1, this.properties.ticksInnerRadius],
      [this.properties.radius-1, this.properties.ticksInnerRadius]
    ];

		/*
		 * SVG
		 */
		this.svg = this.createSVGElement('svg',{
			width: '100%', //options.diameter+'px',
			height: '100%', //options.diameter+'px',
			viewBox: '0 0 '+options.diameter+' '+options.diameter,
			class: 'dial'
		},targetElement);
		// CIRCULAR DIAL
		const circle = this.createSVGElement('circle',{
			cx: this.properties.radius,
			cy: this.properties.radius,
			r: this.properties.radius,
			class: 'dial__shape'
		},this.svg);
		// EDITABLE INDICATOR
		const editCircle = this.createSVGElement('path',{
			d: this.donutPath(this.properties.radius,this.properties.radius,this.properties.radius-4,this.properties.radius-8),
			class: 'dial__editableIndicator',
		},this.svg);

		/*
		 * Ticks
		 */
		const ticks = this.createSVGElement('g',{
			class: 'dial__ticks'
		},this.svg);
		this.theta = this.properties.tickDegrees/options.numTicks;
		this.tickArray = [];
		for (var iTick=0; iTick<options.numTicks; iTick++) {
			this.tickArray.push(this.createSVGElement('path',{d:this.pointsToPath(this.tickPoints)},ticks));
		}

		/*
		 * Labels
		 */
		var lblTarget = this.createSVGElement('text',{
			x: this.properties.radius,
			y: this.properties.radius,
			class: 'dial__lbl dial__lbl--target'
		},this.svg);
		this.lblTarget_text = document.createTextNode('');
		lblTarget.appendChild(this.lblTarget_text);
		//
		this.lblTargetHalf = this.createSVGElement('text',{
			x: this.properties.radius + this.properties.radius/2.5,
			y: this.properties.radius - this.properties.radius/8,
			class: 'dial__lbl dial__lbl--target--half'
		},this.svg);
		var lblTargetHalf_text = document.createTextNode('5');
		this.lblTargetHalf.appendChild(lblTargetHalf_text);
		//
		this.lblAmbient = this.createSVGElement('text',{
			class: 'dial__lbl dial__lbl--ambient'
		},this.svg);
		this.lblAmbient_text = document.createTextNode('');
		this.lblAmbient.appendChild(this.lblAmbient_text);
		//
		var lblAway = this.createSVGElement('text',{
			x: this.properties.radius,
			y: this.properties.radius,
			class: 'dial__lbl dial__lbl--away'
		},this.svg);
		var lblAway_text = document.createTextNode('AWAY');
		lblAway.appendChild(lblAway_text);
		//
		var icoLeaf = this.createSVGElement('path',{
			class: 'dial__ico__leaf'
		},this.svg);

		/*
		 * LEAF
		 */
		var leafScale = this.properties.radius/5/100;
		var leafDef = ["M", 3, 84, "c", 24, 17, 51, 18, 73, -6, "C", 100, 52, 100, 22, 100, 4, "c", -13, 15, -37, 9, -70, 19, "C", 4, 32, 0, 63, 0, 76, "c", 6, -7, 18, -17, 33, -23, 24, -9, 34, -9, 48, -20, -9, 10, -20, 16, -43, 24, "C", 22, 63, 8, 78, 3, 84, "z"].map(function(x: number) {
			return isNaN(x) ? x : x*leafScale;
		}).join(' ');
		var translate = [this.properties.radius-(leafScale*100*0.5),this.properties.radius*1.5];
		var icoLeaf = this.createSVGElement('path',{
			class: 'dial__ico__leaf',
			d: leafDef,
			transform: 'translate('+translate[0]+','+translate[1]+')'
		},this.svg);

    this.svg.addEventListener('mousedown',this.dragStart.bind(this));
    this.svg.addEventListener('touchstart',this.dragStart.bind(this));

    this.svg.addEventListener('mouseup',this.dragEnd.bind(this));
    this.svg.addEventListener('mouseleave',this.dragEnd.bind(this));
    this.svg.addEventListener('touchend',this.dragEnd.bind(this));

    this.svg.addEventListener('mousemove',this.dragMove.bind(this));
    this.svg.addEventListener('touchmove',this.dragMove.bind(this));
		//

    this.render();
	};

  /*
   * RENDER
   */
  private render() {
    this.renderAway();
    this.renderHvacState();
    this.renderTicks();
    if (!this.loading) {
      this.renderTargetTemperature();
      this.renderAmbientTemperature();
    }
    this.renderLeaf();
  }

  /*
   * RENDER - ticks
   */
  private renderTicks() {
    var vMin, vMax;
    if (this.away) {
      vMin = this.ambient_temperature;
      vMax = vMin;
    } else {
      vMin = Math.min(this.ambient_temperature, this.target_temperature);
      vMax = Math.max(this.ambient_temperature, this.target_temperature);
    }
    var min = this.restrictToRange(Math.round((vMin-this.options.minValue)/this.properties.rangeValue * this.options.numTicks),0,this.options.numTicks-1);
    var max = this.restrictToRange(Math.round((vMax-this.options.minValue)/this.properties.rangeValue * this.options.numTicks),0,this.options.numTicks-1);
    //
    const that = this;
    this.tickArray.forEach(function(tick,iTick) {
      var isLarge = iTick==min || iTick==max;
      var isActive = iTick >= min && iTick <= max;
      that.attr(tick,{
        d: that.pointsToPath(that.rotatePoints(isLarge ? that.tickPointsLarge: that.tickPoints,iTick*that.theta-that.properties.offsetDegrees,[that.properties.radius, that.properties.radius])),
        class: isActive ? 'active' : ''
      });
    });
  }

  /*
   * RENDER - ambient temperature
   */
  private renderAmbientTemperature() {
    this.lblAmbient_text.nodeValue = Math.floor(this.ambient_temperature).toString();
    if (this.ambient_temperature%1!=0) {
      this.lblAmbient_text.nodeValue += '⁵';
    }
    var peggedValue = this.restrictToRange(this.ambient_temperature, this.options.minValue, this.options.maxValue);
    let degs = this.properties.tickDegrees * (peggedValue-this.options.minValue)/this.properties.rangeValue - this.properties.offsetDegrees;
    if (peggedValue > this.target_temperature) {
      degs += 8;
    } else {
      degs -= 8;
    }
    var pos = this.rotatePoint(this.properties.lblAmbientPosition,degs,[this.properties.radius, this.properties.radius]);
    this.attr(this.lblAmbient,{
      x: pos[0],
      y: pos[1]
    });
  }

  /*
   * RENDER - target temperature
   */
  private renderTargetTemperature() {
    this.lblTarget_text.nodeValue = Math.floor(this.target_temperature).toString();
    this.setClass(this.lblTargetHalf,'shown',this.target_temperature%1!=0);
  }

  /*
   * RENDER - leaf
   */
  private renderLeaf() {
    this.setClass(this.svg,'has-leaf',this.has_leaf);
  }

  /*
   * RENDER - HVAC state
   */
  private renderHvacState() {
    const that = this;
    Array.prototype.slice.call(this.svg.classList).forEach(function(c) {
      if (c.match(/^dial--state--/)) {
        that.svg.classList.remove(c);
      }
    });
    this.svg.classList.add('dial--state--'+this.hvac_state);
  }

  /*
   * RENDER - awau
   */
  private renderAway() {
    this.svg.classList[this.away ? 'add' : 'remove']('away');
  }

  private eventPosition(ev) {
    if (ev.targetTouches && ev.targetTouches.length) {
      return  [ev.targetTouches[0].clientX, ev.targetTouches[0].clientY];
    } else {
      return [ev.x, ev.y];
    }
  }

  private dragStart(ev) {
    const self = this;
    this.startDelay = setTimeout(function() {
      self.setClass(self.svg, 'dial--edit', true);
      self._drag.inProgress = true;
      self._drag.startPoint = self.eventPosition(ev);
      self._drag.startTemperature = self.target_temperature || self.options.minValue;
      self._drag.lockAxis = undefined;
    },1000);
  }

  private dragEnd (ev) {
    clearTimeout(this.startDelay);
    this.setClass(this.svg, 'dial--edit', false);
    if (!this._drag.inProgress) return;
    this._drag.inProgress = false;
    if (this.target_temperature != this._drag.startTemperature) {
      if (typeof this.options.onSetTargetTemperature == 'function') {
        this.options.onSetTargetTemperature(this.target_temperature);
      }
    }
  }

  private dragMove(ev) {
    ev.preventDefault();
    if (!this._drag.inProgress) return;
    var evPos = this.eventPosition(ev);
    var dy = this._drag.startPoint[1]-evPos[1];
    var dx = evPos[0] - this._drag.startPoint[0];
    var dxy;
    if (this._drag.lockAxis == 'x') {
      dxy  = dx;
    } else if (this._drag.lockAxis == 'y') {
      dxy = dy;
    } else if (Math.abs(dy) > this.properties.dragLockAxisDistance) {
      this._drag.lockAxis = 'y';
      dxy = dy;
    } else if (Math.abs(dx) > this.properties.dragLockAxisDistance) {
      this._drag.lockAxis = 'x';
      dxy = dx;
    } else {
      dxy = (Math.abs(dy) > Math.abs(dx)) ? dy : dx;
    }
    var dValue = (dxy*this.getSizeRatio())/(this.options.diameter)*this.properties.rangeValue;
    this.target_temperature = this.roundHalf(this._drag.startTemperature+dValue);
  }

  /*
   * Helper functions
   */
  private restrictTargetTemperature(t) {
    return this.restrictToRange(this.roundHalf(t),this.options.minValue,this.options.maxValue);
  }

  private angle(point) {
    var dx = point[0] - this.properties.radius;
    var dy = point[1] - this.properties.radius;
    var theta = Math.atan(dx/dy) / (Math.PI/180);
    if (point[0]>=this.properties.radius && point[1] < this.properties.radius) {
      theta = 90-theta - 90;
    } else if (point[0]>=this.properties.radius && point[1] >= this.properties.radius) {
      theta = 90-theta + 90;
    } else if (point[0]<this.properties.radius && point[1] >= this.properties.radius) {
      theta = 90-theta + 90;
    } else if (point[0]<this.properties.radius && point[1] < this.properties.radius) {
      theta = 90-theta+270;
    }
    return theta;
  };

  private getSizeRatio() {
    return this.options.diameter / this.targetElement.clientWidth;
  }

}
