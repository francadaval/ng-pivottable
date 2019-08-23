import { Formatter, US_FMT } from '../formats'
import { AbstractAggregator } from './aggregator' 

export class RunningStatAggregator extends AbstractAggregator{
	
	protected n = 0.0
	protected m = 0.0
	protected s = 0.0
	
	constructor( protected attr, protected mode: string, protected ddof: number, protected format:Formatter = US_FMT ) {
		super(format)
	}

	newAggregator() {
		return new RunningStatAggregator(this.attr, this.mode, this.ddof, this.format)
	}

	push(record) {
		var m_new, x;
		x = parseFloat(record[this.attr]);
		if (isNaN(x)) {
		  return;
		}
		this.n += 1.0;
		if (this.n === 1.0) {
		  return this.m = x;
		} else {
		  m_new = this.m + (x - this.m) / this.n;
		  this.s = this.s + (x - this.m) * (x - m_new);
		  return this.m = m_new;
		}
	}
	
	value() {
		if (this.mode === "mean")
			return (this.n === 0) ? 0 / 0 : this.m

		if (this.n <= this.ddof)
			return 0;

		switch (this.mode) {
			case "var":
				return this.s / (this.n - this.ddof);
			case "stdev":
				return Math.sqrt(this.s / (this.n - this.ddof));
		}
	}
}

export class AverageAggregator extends RunningStatAggregator {
	constructor(attr, format) {
		super( attr, 'mean', 1, format )
	}
}

export class VarianceAggregator extends RunningStatAggregator {
	constructor(attr, ddof, format) {
		super( attr, 'var', ddof, format )
	}
}

export class StandardDeviationAggregator extends RunningStatAggregator {
	constructor(attr, ddof, format) {
		super( attr, 'stdev', ddof, format )
	}
}
