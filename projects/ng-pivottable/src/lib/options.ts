import { PivotData } from './pivot-data'
import { Sorter } from './sorters'
import { Deriver } from './derivers'
import { AggregatorsFactory, AGGREGATORS } from './aggregators'

export interface Options {
	cols: string[];
	rows: string[];
	vals: string[];

    aggregators: AggregatorsFactory;
    renderers: any;
    
    exclusions: string[];
    inclusions: string[];

	rowOrder: string;
	colOrder: string;

	filter: (record) => boolean;
	aggregatorName: string;
	sorters: {[key:string]: Sorter},
	
    onRefresh: any;
    showUI: boolean;
	derivedAttributes: {[derAttr:string]:Deriver};
	hiddenAttributes: string[];
	hiddenFromAggregators: string[];
	hiddenFromDragDrop: string[];
    menuLimit: number;

	unusedAttrsVertical: 'auto' | number | false;
    autoSortUnusedAttrs: boolean,
	
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

	aggregators: AGGREGATORS,
	// TODO: Provisional
	renderers: 	{
		"Table": 1,
		"Heatmap Table": 2
	},

	exclusions: [],
    inclusions: [],

	rowOrder: "key_a_to_z",
	colOrder: "key_a_to_z",

	filter: function() {
		return true;
	},
	aggregatorName: "Count",
	sorters: {},

	onRefresh: null,
	showUI: true,
	derivedAttributes: {},
	hiddenAttributes: [],
	hiddenFromAggregators: [],
	hiddenFromDragDrop: [],
	menuLimit: 500,

	unusedAttrsVertical: false,
	autoSortUnusedAttrs: false,

	table: {
		clickCallback: null,
		rowTotals: true,
		colTotals: true
	},

	localeStrings: {
		totals: "Totals"
	}
};