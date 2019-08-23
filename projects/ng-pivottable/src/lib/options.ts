import { PivotData } from './pivot-data'
import { Sorter } from './sorters'
import { Deriver } from './derivers'

export interface Options {
	cols: string[];
	rows: string[];
	vals: string[];

	rowOrder: string;
	colOrder: string;

	filter: (record) => boolean;
	aggregatorName: string;
	sorters: {[key:string]: Sorter},
	
	derivedAttributes: {[derAttr:string]:Deriver};
	hiddenAttributes: string[];
	hiddenFromAggregators: string[];
	hiddenFromDragDrop: string[];

	unusedAttrsVertical: 'auto' | number;
	
	table: {
		clickCallback: any,
		rowTotals: boolean,
		colTotals: boolean
	};

	localeStrings: {[key:string]:string}
}

export const DEFAULT_OPTIONS: Options = {
	cols: [],
	rows: [],
	vals: [],

	rowOrder: "key_a_to_z",
	colOrder: "key_a_to_z",

	filter: function() {
		return true;
	},
	aggregatorName: "Count",
	sorters: {},

	derivedAttributes: {},
	hiddenAttributes: [],
	hiddenFromAggregators: [],
	hiddenFromDragDrop: [],

	unusedAttrsVertical: 'auto',
	
	table: {
		clickCallback: null,
		rowTotals: true,
		colTotals: true
	},

	localeStrings: {
		totals: "Totals"
	}
};