import { Formatter } from '../formats'

export interface Aggregator {
	push: (record: any) => number;
	value: () => number;
	formattedValue: () => string;
	newAggregator(data,rowKey,colKey): Aggregator;
	numInputs: number;
}

export abstract class AbstractAggregator implements Aggregator {
	constructor( protected format: Formatter ) {}

	abstract push(record)
	abstract value()
	abstract newAggregator(data,rowKey,colKey): Aggregator
	formattedValue() {
		return this.format( this.value() )
	}
	numInputs = 1
}

export class VoidAggregator implements Aggregator {
	push(record: any) { return 0 }
	value() { return 0 }
	formattedValue() { return "" }
	newAggregator(data,rowKey,colKey) {return this}
	numInputs = 0
}
