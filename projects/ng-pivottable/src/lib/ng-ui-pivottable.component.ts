import { Component, OnInit, Input } from '@angular/core';
import { Options, DEFAULT_OPTIONS } from './options'

@Component({
	selector: 'ng-ui-pivottable',
	templateUrl: './ng-ui-pivottable.component.html',
	styleUrls: ['./ng-ui-pivottable.component.scss']
})
export class NgUIPivottableComponent implements OnInit {

	renderers = {
		"Table": 1,
		"Heatmap Table": 2
	}

	@Input()
	options

	opts: Options

	attrValues: any[]

	protected _shownAttributes: string[] = null
	get shownAttributes(): string[] {
		return this._shownAttributes = (this._shownAttributes ||
			this.attrValues.filter( (attr) => !this.opts.hiddenAttributes.includes(attr) ));
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
	}

	changeRenderer( renderer ) {

	}
}
