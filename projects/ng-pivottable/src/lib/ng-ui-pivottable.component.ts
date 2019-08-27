import { Component, OnInit, Input } from '@angular/core';
import { Options, DEFAULT_OPTIONS } from './options'

@Component({
	selector: 'ng-ui-pivottable',
	templateUrl: './ng-ui-pivottable.component.html',
	styleUrls: ['./ng-ui-pivottable.component.scss']
})
export class NgUIPivottableComponent implements OnInit {

	@Input('input')
	input

	@Input('locale')
	locale: string = 'en';

	@Input('options')
	options: Options

	@Input('overwrite')
	overwrite: boolean = false

	get renderers() { return this.opts.renderers };
	get aggregators() { return this.opts.aggregators }

	opts: Options
	attrValues: {[key:string]: any[]}
	get attrKeys(): string[] { return Object.keys( this.attrValues ) }
		localeStrings: {}

	protected _shownAttributes: string[] = null
	get shownAttributes(): string[] {
		return this._shownAttributes = (this._shownAttributes ||
			this.attrKeys.filter( (attr) => !this.opts.hiddenAttributes.includes(attr) ));
	};

	protected _shownInAggregators: string[] = null
	get shownInAggregators(): string[] {
		return this._shownInAggregators = (this._shownInAggregators || 
			this.shownAttributes.filter( (attr) => !this.opts.hiddenFromAggregators.includes(attr) ));
	}

	protected _shownInDragDrop: string[] = null
	get shownInDragDrop() {
		return this._shownInDragDrop = (this._shownInDragDrop || 
			this.shownAttributes.filter( (attr) => !this.opts.hiddenFromDragDrop.includes(attr) ));
	}
	
	protected _attrLength: number = null;
	get attrLength() { return this._attrLength == null ? 
		( this.shownInDragDrop.length ? this.shownInDragDrop.map((str)=>str.length).reduce((prev,curr)=>prev+curr) : 0 ) :
		this._attrLength }

	get unusedAttrsVerticalAutoCutoff() { return this.opts.unusedAttrsVertical == 'auto' ? 120 : this.opts.unusedAttrsVertical }
	get unusedAttrsVerticalAutoOverride() { return this.attrLength > this.unusedAttrsVerticalAutoCutoff }

	constructor() { }

	ngOnInit() {
		this.opts = {...DEFAULT_OPTIONS, ...this.options}
		//this.localeStrings = {...{}, locales.en.localeStrings, locales[locale].localeStrings);

		this.proccessDataRecords();
	}

	proccessDataRecords() {
		this.attrValues = {};
		let materializedInput = [];
		let recordsProcessed = 0;
		this.input.forEachRecord(this.opts.derivedAttributes, function(record) {
			var attr, base, ref, value;
			if (this.opts.filter(record)) {
				materializedInput.push(record);
				for (attr in record) {
					this.attrValues[attr] = this.attrValues[attr] || {};
					if (recordsProcessed > 0)
						this.attrValues[attr]["null"] = recordsProcessed;
				}

				for (attr in this.attrValues) {
					let a = this.attrValues[attr];
					value = record[attr] != null ? record[attr] : "null";
					this.a[value] = this.a[value] ? this.a[value] + 1 : 1 
				}

				return recordsProcessed++;
			}
		})
	}

	changeRenderer( renderer ) {

	}

	changeAggregator( aggregator ) {
		
	}
}
