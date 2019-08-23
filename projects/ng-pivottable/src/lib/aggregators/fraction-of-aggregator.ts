import { Formatter, US_FMT_PCT } from '../formats'
import { AbstractAggregator, Aggregator } from './aggregator' 

export class FractionOfAggregator extends AbstractAggregator {

	protected selector: string[][];
	protected data;

	constructor(protected inner: Aggregator, protected type: string = 'total', protected format: Formatter = US_FMT_PCT) {
		super(format)
		this.selector = null
		this.data = null
	}

	newAggregator( data, rowKey: string[], colKey: string[] ) {
		let agg = new FractionOfAggregator( this.inner.newAggregator(data,rowKey,colKey), this.type, this.format )
		agg.selector = {
			total: [[], []],
			row: [rowKey, []],
			col: [[], colKey]
		}[this.type]
		agg.data = data

		return agg;
	}
	
	push(record) {
		return this.inner.push(record);
	}
	
	value() {
		return this.data ? (this.innerValue / (<FractionOfAggregator>this.data.getAggregator(this.selector)).innerValue) : 1;
	}

	get innerValue() { return this.inner.value() }

	get numInputs() { return this.inner.numInputs }
}
