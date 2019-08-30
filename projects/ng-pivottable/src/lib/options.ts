import { PivotData } from './pivot-data'
import { Sorter } from './sorters'
import { Deriver } from './derivers'
import { Aggregator, AggregatorsFactory, AGGREGATORS } from './aggregators'

export interface DataOptions {
	aggregator?: Aggregator;
	aggregatorName?: string;

	cols: string[];
	rows: string[];
	vals: string[];

	rowOrder: string;
	colOrder: string;
	sorters: {[key:string]: Sorter};

	filter: (record) => boolean;

	derivedAttributes: {[derAttr:string]:Deriver};
}

export interface TableOptions {
	clickCallback: any,
	rowTotals: boolean,
	colTotals: boolean
}

export interface Options extends DataOptions {
	aggregators: AggregatorsFactory;
    renderers: any;
    
    exclusions: string[];
    inclusions: string[];
	
    onRefresh: any;
    showUI: boolean;
	hiddenAttributes: string[];
	hiddenFromAggregators: string[];
	hiddenFromDragDrop: string[];
    menuLimit: number;

	unusedAttrsVertical: 'auto' | number | false;
    autoSortUnusedAttrs: boolean,
	
	localeStrings: {[key:string]:string}

	table: TableOptions
}

export const DEFAULT_DATA_OPTIONS: DataOptions = {
	aggregatorName: "Count",

	cols: [],
	rows: [],
	vals: [],

	rowOrder: "key_a_to_z",
	colOrder: "key_a_to_z",
	sorters: {},

	filter: () => true,

	derivedAttributes: {}
}

export const TABLE_OPTION_DEFAULTS: TableOptions = {
	clickCallback: null,
	rowTotals: true,
	colTotals: true
}

export const DEFAULT_OPTIONS: Options = {
	...DEFAULT_DATA_OPTIONS,

	aggregators: AGGREGATORS,

	renderers: 	{
		"Table": 1,
		"Heatmap Table": 2
	},

	exclusions: [],
    inclusions: [],


	onRefresh: null,
	showUI: true,
	hiddenAttributes: [],
	hiddenFromAggregators: [],
	hiddenFromDragDrop: [],
	menuLimit: 500,

	unusedAttrsVertical: 'auto',
	autoSortUnusedAttrs: false,

	table: TABLE_OPTION_DEFAULTS,

	localeStrings: {
		totals: "Totals"
	}
};