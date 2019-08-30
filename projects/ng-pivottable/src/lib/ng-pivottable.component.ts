import { Component, OnInit, Input } from '@angular/core';
import { PivotData } from './pivot-data'
import { TableOptions, TABLE_OPTION_DEFAULTS } from './options'

@Component({
	selector: 'ng-pivottable',
	templateUrl: './ng-pivottable.component.html',
	styleUrls: ['./ng-pivottable.component.scss']
})
export class NgPivottableComponent {

	get colAttrs() { return this.pivotData.colAttrs }
	get rowAttrs() { return this.pivotData.rowAttrs }
	get colKeys() { return this.pivotData.colKeys }
	get rowKeys() { return this.pivotData.rowKeys }

	@Input('pivotData')
	pivotData: PivotData

	@Input('locale')
	locale: string = 'en';

	protected _options: TableOptions
	@Input('options')
	set options(opts) {
		this._options = {...TABLE_OPTION_DEFAULTS, ...this.options}
	}
	get options(): TableOptions { return this._options }

	// TODO: Location service
	localeStrings = {
		totals: "Totals"
	}

	drawable(arr,i,j) {
		if (i !== 0) {
			let noDraw = true;
			for (let x = 0, l = 0; 0 <= j ? l <= j : l >= j; x = 0 <= j ? ++l : --l) {
				if (arr[i - 1][x] !== arr[i][x]) {
					noDraw = false;
				}
			}
			if (noDraw) return false;
		}

		return true;
	}

	spanSize(arr, i, j) {
		if( !this.drawable(arr,i,j) ) return -1;
		
		let len = 0;
		while (i + len < arr.length) {
			let stop = false;
			for (let x = 0, n = 0; 0 <= j ? n <= j : n >= j; x = 0 <= j ? ++n : --n) {
				if (arr[i][x] !== arr[i + len][x]) {
					stop = true;
				}
			}
			if (stop) break;

			len++;
		}

		return len;
	};

	value(rk,ck): number {
		return this.pivotData.getAggregator(rk,ck).value()
	}

	formattedValue(rk,ck): string {
		return this.pivotData.getAggregator(rk,ck).formattedValue()
	}

	getClickHandler = function(value, rk, ck) {
		var attr, filters, i;
		filters = {};
		for (i in this.colAttrs) {
			if (ck[i] != null) {
				filters[this.colAttrs[i]] = ck[i];
			}
		}
		for (i in this.rowAttrs) {
			if (rk[i] != null) {
				filters[this.rowAttrs[i]] = rk[i];
			}
		}

		return this.options.clickCallback ? (e) => this.options.clickCallback(e, value, filters, this.pivotData) : null;
	};

	clickCallback(rk,ck,event) {
		let handler = this.getClickHandler(this.value(rk,ck),rk,ck)
		if( handler ) handler(event);
	}
}
