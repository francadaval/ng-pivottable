import { Aggregator, VoidAggregator, CountAggregator, AGGREGATORS } from './aggregators'
import { Sorter, naturalSort } from './sorters'
import { Deriver, DerivedAttributes } from './derivers'
import { Record, Data } from './types'
import { DataOptions, DEFAULT_DATA_OPTIONS } from './options'

export class PivotData {
	protected aggregator: Aggregator

	protected derivedAttributes: DerivedAttributes

	protected _rowKeys: string[][] = [];
	protected _colKeys: string[][] = [];
	public get colKeys(): string[][] {
		this.sortKeys();
		return this._colKeys;
	};

	public get rowKeys(): string[][] {
		this.sortKeys();
		return this._rowKeys;
	};
	public get colAttrs(): string [] { return this.opts.cols }
	public get rowAttrs(): string [] { return this.opts.rows }

	protected tree: {[key: string]: {[key: string]: Aggregator}} = {};
	protected rowTotals:{[key: string]: Aggregator} = {};
	protected colTotals:{[key: string]: Aggregator} = {};
	protected allTotal: Aggregator
	protected sorted: boolean = false

	constructor(protected input, public opts: any) {
		this.opts = {...DEFAULT_DATA_OPTIONS,...this.opts}

		this.aggregator = opts.aggregator ? opts.aggregator : (opts.aggregatorName ? AGGREGATORS[opts.aggregatorName](opts.vals) : new CountAggregator());

		this.allTotal = this.aggregator.newAggregator(this, [], []);
		this.sorted = false;
		
		this.forEachRecord(this.opts.derivedAttributes, (record:Record) => {
			if (this.opts.filter(record)) {
				return this.processRecord(record);
			}
		})
	}

	forEachRecord = function(derivedAttributes: DerivedAttributes, f: (record: Record) => any) {
		//var compactRecord, i, j, k, l, len1, record, ref, results, results1, tblCols;

		let addRecord = f;
		if (Object.keys(derivedAttributes).length != 0) {
			addRecord = function(record:Record) {
				var ref, v;
				for (let dAttr in derivedAttributes) {
					let value = derivedAttributes[dAttr](record)
					record[dAttr] = value != null ? value : record[dAttr];
				}
				return f(record);
			};
		}

		// TODO: Type 'function' for data
		/*if (typeof input == 'function') {
			return input(addRecord);
		} else*/ if (Array.isArray(this.input)) {
			if (Array.isArray(this.input[0])) {
				let results = [];
				for(let i = 1; i < this.input.length; ++i) {
					let compactRecord = this.input[i];
					let record = {};
					let ref = this.input[0];
					for(let j in ref) {
						let key = ref[j];
						record[key] = compactRecord[j];
					}
					results.push(addRecord(record));
				}
				return results;
			} else {
				let results = [];
				for (let record of this.input) {
					results.push(addRecord(record));
				}
				return results;
			}
		} /* else if (input instanceof $) {
			tblCols = [];
			$("thead > tr > th", input).each(function(i) {
				return tblCols.push($(this).text());
			});
			return $("tbody > tr", input).each(function(i) {
				record = {};
				$("td", this).each(function(j) {
					return record[tblCols[j]] = $(this).text();
				});
				return addRecord(record);
			});
		}*/ else {
			throw new Error("unknown input format");
		}
	};

	protected forEachMatchingRecord(criteria, callback) {
		return this.forEachRecord(this.derivedAttributes, (record:Record) => {
			if (this.opts.filter(record)) {
				for (let k in criteria) {
					if (criteria[k] !== (record[k]) != null ? record[k] : "null") {
						return;
					}
				}
				return callback(record);
			}
		})
	};

	protected sorter(attr:string): Sorter {
		return this.opts.sorters[attr] || naturalSort;
	};

	protected arrSort(attrs:string[]): Sorter {
		let sortersArr = attrs.map((attr) => this.sorter(attr));
		
		return function(a:any[], b:any[]) {
			for (let i in sortersArr) {
				let c = sortersArr[i](a[i], b[i]);
				if( c ) return c;
			}

			return 0;
		};
	};

	protected sortKeys() {
		if (!this.sorted) {
			this.sorted = true;
			let v = (r, c) => this.getAggregator(r, c).value();

			switch (this.opts.rowOrder) {
				case "value_a_to_z":
					this._rowKeys.sort((a,b) => naturalSort(v(a, []), v(b, [])));
					break;
				case "value_z_to_a":
					this._rowKeys.sort((a,b) => -naturalSort(v(a, []), v(b, [])));
					break;
				default:
					this._rowKeys.sort(this.arrSort(this.opts.rows));
			}
			switch (this.opts.colOrder) {
				case "value_a_to_z":
					return this._colKeys.sort((a,b) => naturalSort(v([], a), v([], b)));
				case "value_z_to_a":
					return this._colKeys.sort((a,b) => -naturalSort(v([], a), v([], b)));
				default:
					return this._colKeys.sort(this.arrSort(this.opts.cols));
			}
		}
	};

	protected processRecord(record:Record) {
		let colKey: string[] = [];
		let rowKey: string[] = [];
		for (let l = 0, len1 = this.opts.cols.length; l < len1; l++) {
			let x = this.opts.cols[l];
			colKey.push(record[x] != null ? record[x] : "null");
		}

		for (let n = 0, len2 = this.opts.rows.length; n < len2; n++) {
			let x = this.opts.rows[n];
			rowKey.push(record[x] != null ? record[x] : "null");
		}

		let flatRowKey:string = rowKey.join(String.fromCharCode(0));
		let flatColKey:string = colKey.join(String.fromCharCode(0));

		this.allTotal.push(record);
		if (rowKey.length !== 0) {
			if (!this.rowTotals[flatRowKey]) {
				this._rowKeys.push(rowKey);
				this.rowTotals[flatRowKey] = this.aggregator.newAggregator(this, rowKey, []);
			}
			this.rowTotals[flatRowKey].push(record);
		}

		if (colKey.length !== 0) {
			if (!this.colTotals[flatColKey]) {
				this._colKeys.push(colKey);
				this.colTotals[flatColKey] = this.aggregator.newAggregator(this, [], colKey);
			}
			this.colTotals[flatColKey].push(record);
		}

		if (colKey.length !== 0 && rowKey.length !== 0) {
			this.tree[flatRowKey] = this.tree[flatRowKey] || {};
			this.tree[flatRowKey][flatColKey] = this.tree[flatRowKey][flatColKey] || this.aggregator.newAggregator(this, rowKey, colKey);

			return this.tree[flatRowKey][flatColKey].push(record);
		}
	};

	getAggregator(rowKey:string[], colKey:string[]): Aggregator {
		let agg: Aggregator
		let flatRowKey = rowKey.join(String.fromCharCode(0));
		let flatColKey = colKey.join(String.fromCharCode(0));

		if (rowKey.length === 0 && colKey.length === 0) {
			agg = this.allTotal;
		} else if (rowKey.length === 0) {
			agg = this.colTotals[flatColKey];
		} else if (colKey.length === 0) {
			agg = this.rowTotals[flatRowKey];
		} else {
			agg = this.tree[flatRowKey][flatColKey];
		}

		return agg ? agg : new VoidAggregator();
	};
}