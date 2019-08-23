import { Formatter, US_FMT } from '../formats'
import { AbstractAggregator } from './aggregator' 

export class QuantileAggregator extends AbstractAggregator {
	protected vals = []

	constructor( protected attr, protected quantile: number, protected format:Formatter = US_FMT ) {
		super(format)
	}

	newAggregator() {
		return new QuantileAggregator( this.attr, this.quantile, this.format )
	}

	push(record) {
		let x = parseFloat(record[this.attr]);
		if (!isNaN(x)) {
			return this.vals.push(x);
		}
	}

	value() {
		if (this.vals.length === 0)
			return null;

		this.vals.sort( (a, b) => a - b );
		let i = (this.vals.length - 1) * this.quantile;
		return (this.vals[Math.floor(i)] + this.vals[Math.ceil(i)]) / 2.0;
	}
}

export class MedianAggregator extends QuantileAggregator {
	constructor(attr, format: Formatter = US_FMT) {
		super(attr, 0.5, format)
	}
}
