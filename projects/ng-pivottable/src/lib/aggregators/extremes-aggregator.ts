import { Formatter, US_FMT } from '../formats/formats'
import { Sorter } from '../sorters/sorters'
import { AbstractAggregator } from './aggregator' 

export class ExtremesAggregator extends AbstractAggregator {

	protected val = null
	protected sorter: Sorter = null
	
	constructor( protected attr, protected mode: string, format:Formatter = US_FMT ) {
		super(format)
	}

	newAggregator(data) {
		let agg = new ExtremesAggregator( this.attr, this.mode, this.format )
		agg.sorter = this.sorter || data.sorter(this.attr);
		return agg;
	}

	push(record) {
		let x = record[this.attr];
		if (this.mode === "min" || this.mode === "max") {
			x = parseFloat(x);
			if (!isNaN(x)) {
				this.val = Math[this.mode](x, this.val != null ? this.val : x);
			}
		}
		if (this.mode === "first") {
			if (this.sorter(x, this.val != null ? this.val : x) <= 0) {
				this.val = x;
			}
		}
		if (this.mode === "last") {
			if (this.sorter(x, this.val != null ? this.val : x) >= 0) {
				return this.val = x;
			}
		}
	}
	
	value() { return this.val }

	formattedValue() { 
		let v = this.value();
		return isNaN(v) ? v.toString() : this.format(v)
	}
}

export class MaxAggregator extends ExtremesAggregator {
	constructor( attr, format: Formatter = US_FMT ) {
		super(attr,'max',format)
	}
}

export class MinAggregator extends ExtremesAggregator {
	constructor( attr, format: Formatter = US_FMT ) {
		super(attr,'min',format)
	}
}

export class FirstAggregator extends ExtremesAggregator {
	constructor( attr, format: Formatter = US_FMT ) {
		super(attr,'first',format)
	}
}

export class LastAggregator extends ExtremesAggregator {
	constructor( attr, format: Formatter = US_FMT ) {
		super(attr,'last',format)
	}
}
