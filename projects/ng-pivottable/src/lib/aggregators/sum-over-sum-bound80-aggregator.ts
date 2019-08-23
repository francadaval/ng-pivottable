import { Formatter, US_FMT } from '../formats/formats'
import { AbstractAggregator } from './aggregator' 

export class SumOverSumBound80Aggregator extends AbstractAggregator {
	
	sumNum = 0
	sumDenom = 0
	numInputs = 2

	constructor( protected num: string, protected denom: string, format: Formatter ) {
		super(format)
	}

	newAggregator() {
		return new SumOverSumBound80Aggregator(this.num, this.denom, this.format)
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
