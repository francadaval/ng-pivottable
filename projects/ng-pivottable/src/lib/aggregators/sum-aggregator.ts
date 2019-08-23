import { Formatter, US_FMT } from '../formats'
import { AbstractAggregator } from './aggregator' 

export class SumAggregator extends AbstractAggregator {
	
	protected sum: 0
	
	constructor( protected attr, protected format:Formatter = US_FMT ) {
		super(format)
	}

	newAggregator() {
		return new SumAggregator(this.attr, this.format);
	}

	push(record) {
		if (!isNaN(parseFloat(record[this.attr]))) {
			return this.sum += parseFloat(record[this.attr]);
		}
	}
	
	value() {
		return this.sum;
	}
}
