import { Formatter, US_FMT_INT } from '../formats/formats'
import { AbstractAggregator } from './aggregator' 

export class CountAggregator extends AbstractAggregator {

	protected count: number = 0

	numInputs = 0

	constructor( format:Formatter = US_FMT_INT ) {
		super(format)
	}

	newAggregator() {
		return new CountAggregator( this.format )
	}

	push() {
		return this.count++
	}
	
	value() {
		return this.count
	}
}
