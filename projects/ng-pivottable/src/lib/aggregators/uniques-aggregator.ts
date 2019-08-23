import { Formatter, US_FMT_INT } from '../formats/formats'
import { naturalSort } from '../sorters/sorters'
import { AbstractAggregator } from './aggregator' 

export class UniquesAggregator extends AbstractAggregator {

	constructor( protected fn, protected attr, format:Formatter = US_FMT_INT ) {
		super(format)
	}

	newAggregator() {
		return new UniquesAggregator(this.fn, this.attr, this.format)
	}

	protected uniq: any[] = [];

	push(record) {
		let ref = record[this.attr];
		if (this.uniq.indexOf(ref) < 0) {
			return this.uniq.push(ref);
		}
	}

	value() {
		return this.fn(this.uniq);
	}
}

export class CountUniqueAggregator extends UniquesAggregator {
	constructor( attr, format:Formatter ) {
		super( (x) => x.length, attr, format)
	}
}

export class ListUniqueAggregator extends UniquesAggregator {
	constructor( s, attr, format: Formatter ) {
		super( ((x) => x.sort(naturalSort).join(s)), ((x)=>x))
	}
}
