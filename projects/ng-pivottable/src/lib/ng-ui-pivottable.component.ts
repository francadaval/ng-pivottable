import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Options, DEFAULT_OPTIONS } from './options'
import { PivotData } from './pivot-data'
import { NgPivottableComponent } from './ng-pivottable.component'
import { AggregatorsFactory } from './aggregators'

const ORDERING = {
	key_a_to_z: {
		value: "key_a_to_z",
		rowSymbol: "↕",
		colSymbol: "↔",
		next: "value_a_to_z"
	},
	value_a_to_z: {
		value: "value_a_to_z",
		rowSymbol: "↓",
		colSymbol: "→",
		next: "value_z_to_a"
	},
	value_z_to_a: {
		value: "value_z_to_a",
		rowSymbol: "↑",
		colSymbol: "←",
		next: "key_a_to_z"
	}
}

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

	pivotData: PivotData

	get renderers() { return this.opts.renderers };
	get aggregators(): AggregatorsFactory { return this.opts.aggregators }

	opts: Options
	attrValues: {[key:string]: {[key:string]: number}}
	get attrKeys(): string[] { return this.attrValues ?  Object.keys( this.attrValues ) : null }
	localeStrings: {}

	protected _shownAttributes: string[] = null
	get shownAttributes(): string[] {
		return this._shownAttributes = (this._shownAttributes || ( this.attrKeys ? 
			this.attrKeys.filter( (attr) => !this.opts.hiddenAttributes.includes(attr) ) : null ));
	};

	protected _shownInAggregators: string[] = null
	get shownInAggregators(): string[] {
		return this._shownInAggregators = (this._shownInAggregators || ( this.shownAttributes ? 
			this._shownAttributes.filter( (attr) => !this.opts.hiddenFromAggregators.includes(attr) ) : null ));
	}

	protected _shownInDragDrop: string[] = null
	get shownInDragDrop() {
		return this._shownInDragDrop = (this._shownInDragDrop || ( this.shownAttributes ?
			this._shownAttributes.filter( (attr) => !this.opts.hiddenFromDragDrop.includes(attr) ) : null ));
	}
	
	protected _attrLength: number = null;
	get attrLength() { return this._attrLength == null ? 
		( this.shownInDragDrop.length ? this.shownInDragDrop.map((str)=>str.length).reduce((prev,curr)=>prev+curr) : 0 ) :
		this._attrLength }

	get unusedAttrsVerticalAutoCutoff(): number { return this.opts.unusedAttrsVertical == 'auto' ? 120 : (this.opts.unusedAttrsVertical ? this.opts.unusedAttrsVertical : null ) }
	get unusedAttrsVerticalAutoOverride() { return this.attrLength > this.unusedAttrsVerticalAutoCutoff }

	constructor() { }

	ngOnInit() {
		this.opts = {...DEFAULT_OPTIONS, ...this.options}
		//this.localeStrings = {...{}, locales.en.localeStrings, locales[locale].localeStrings);
		this.pivotData = new PivotData(this.input,this.opts);
		this.proccessDataRecords()
	}

	ngAfterViewInit() {
		this.proccessDataRecords();
	}

	proccessDataRecords() {
		this.attrValues = {};
		let materializedInput = [];
		let recordsProcessed = 0;
		this.pivotData.forEachRecord(this.opts.derivedAttributes, (record) => {
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
					a[value] = a[value] ? a[value] + 1 : 1 
				}

				return recordsProcessed++;
			}
		})
	}

	changeRenderer( renderer ) {

	}

	changeAggregator( aggregator ) {
		
	}

	get colOrderSymbol() {
		return ORDERING[this.opts.colOrder].colSymbol
	}

	get rowOrderSymbol() {
		return ORDERING[this.opts.rowOrder].rowSymbol
	}

	switchColOrder() {
		this.opts.colOrder = ORDERING[this.opts.colOrder].next
		this.refresh()
	}

	switchRowOrder() {
		this.opts.rowOrder = ORDERING[this.opts.rowOrder].next
		this.refresh()
	}

	refresh() {
		this._shownAttributes = null
		this._shownInAggregators = null
		this._shownInDragDrop = null
		this._attrLength = null
		this.pivotData = new PivotData(this.input,this.opts);
	}
}
