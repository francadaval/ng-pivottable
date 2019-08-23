import { Formatter, US_FMT } from '../formats'
import { AbstractAggregator } from './aggregator' 

export class SumOverSumAggregator extends AbstractAggregator {
	
	sumNum = 0
	sumDenom = 0
	numInputs = 2

	constructor( protected num: string, protected denom: string, format: Formatter = US_FMT ) {
		super(format)
	}

	newAggregator() {
		return new SumOverSumAggregator(this.num, this.denom, this.format)
	}

	push(record) {
		if (!isNaN(parseFloat(record[this.num]))) {
			this.sumNum += parseFloat(record[this.num]);
		}
		if (!isNaN(parseFloat(record[this.denom]))) {
			return this.sumDenom += parseFloat(record[this.denom]);
		}
	}

	value() {
		return this.sumNum / this.sumDenom;
	}
}
