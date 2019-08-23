import { Formatter, US_FMT } from '../formats/formats'
import { AbstractAggregator } from './aggregator' 

export class SumOverSumBound80Aggregator extends AbstractAggregator {
	
	sumNum = 0
	sumDenom = 0
	numInputs = 2

	constructor( protected num: string, protected denom: string, protected upper: boolean = true, format: Formatter = US_FMT ) {
		super(format)
	}

	newAggregator() {
		return new SumOverSumBound80Aggregator( this.num, this.denom, this.upper, this.format )
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
		let sign = this.upper ? 1 : -1;
		return (0.821187207574908 / this.sumDenom + this.sumNum / this.sumDenom + 1.2815515655446004 * sign * Math.sqrt(0.410593603787454 / (this.sumDenom * this.sumDenom) + (this.sumNum * (1 - this.sumNum / this.sumDenom)) / (this.sumDenom * this.sumDenom))) / (1 + 1.642374415149816 / this.sumDenom);
	}
}
