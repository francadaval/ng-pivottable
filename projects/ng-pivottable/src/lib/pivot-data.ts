import { Aggregator, VoidAggregator, CountAggregator, AGGREGATORS } from './aggregators'
import { Sorter, naturalSort } from './sorters'

export class PivotData {
	protected aggregator: Aggregator
	protected aggregatorName: string
	public colAttrs: string[]
	public rowAttrs: string[]
	protected valAttrs: string[]
	protected sorters: {[key: string]: Sorter}
	protected rowOrder: string
	protected colOrder: string
	protected derivedAttributes: {[key: string]: (record) => any}
	protected filter: (record) => boolean

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

	protected tree: {[key: string]: {[key: string]: Aggregator}} = {};
	protected rowTotals:{[key: string]: Aggregator} = {};
	protected colTotals:{[key: string]: Aggregator} = {};
	protected allTotal: Aggregator
	protected sorted: boolean = false

	constructor(protected input, public opts) {
		if (!this.opts)
			this.opts = {};

		this.aggregator = opts.aggregator ? opts.aggregator : (opts.aggregatorName ? AGGREGATORS[opts.aggregatorName](opts.vals) : new CountAggregator());
		this.aggregatorName = opts.aggregatorName ? opts.aggregatorName : "Count";
		this.colAttrs = opts.cols ? opts.cols : [];
		this.rowAttrs = opts.rows ? opts.rows : [];
		this.valAttrs = opts.vals ? opts.vals : [];
		this.sorters = opts.sorters ? opts.sorters : {};
		this.rowOrder = opts.rowOrder ? opts.rowOrder : "key_a_to_z";
		this.colOrder = opts.colOrder ? opts.colOrder : "key_a_to_z";
		this.derivedAttributes = opts.derivedAttributes ? opts.derivedAttributes : {};
		this.filter = opts.filter ? opts.filter : (record) => true;
		this.allTotal = this.aggregator.newAggregator(this, [], []);
		this.sorted = false;
		
		this.forEachRecord(this.input, this.derivedAttributes, (record) => {
			if (this.filter(record)) {
				return this.processRecord(record);
			}
		})
	}

	protected forEachRecord = function(input, derivedAttributes: {[key: string]: (record) => any}, f) {
		//var compactRecord, i, j, k, l, len1, record, ref, results, results1, tblCols;

		let addRecord = f;
		if (Object.keys(derivedAttributes).length != 0) {
			addRecord = function(record) {
				var ref, v;
				for (let dAttr in derivedAttributes) {
					let value = derivedAttributes[dAttr](record)
					record[dAttr] = value != null ? value : record[dAttr];
				}
				return f(record);
			};
		}

		if (typeof input == 'function') {
			return input(addRecord);
		} else if (Array.isArray(input)) {
			if (Array.isArray(input[0])) {
				let results = [];
				for(let i = 1; i < input.length; ++i) {
					let compactRecord = input[i];
					let record = {};
					let ref = input[0];
					for(let j in ref) {
						let key = ref[j];
						record[key] = compactRecord[j];
					}
					results.push(addRecord(record));
				}
				return results;
			} else {
				let results = [];
				for (let record of input) {
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
		return this.forEachRecord(this.input, this.derivedAttributes, (record) => {
			if (this.filter(record)) {
				for (let k in criteria) {
					if (criteria[k] !== (record[k]) != null ? record[k] : "null") {
						return;
					}
				}
				return callback(record);
			}
		})
	};

	protected sorter(attr): Sorter {
		return this.sorters[attr] || naturalSort;
	};

	protected arrSort(attrs): Sorter {
		let sortersArr = [];
		for(let l = 0, len1 = attrs.length; l < len1; l++) {
			let a = attrs[l];
			sortersArr.push(this.sorter(a));
		}
		
		return function(a, b) {
			var comparison, i, sorter;
			for (i in sortersArr) {
				if (!sortersArr.hasOwnProperty(i)) continue;
				sorter = sortersArr[i];
				comparison = sorter(a[i], b[i]);
				if (comparison !== 0) {
					return comparison;
				}
			}
			return 0;
		};
	};

	protected sortKeys() {
		if (!this.sorted) {
			this.sorted = true;
			let v = (r, c) => this.getAggregator(r, c).value();

			switch (this.rowOrder) {
				case "value_a_to_z":
					this._rowKeys.sort((a,b) => naturalSort(v(a, []), v(b, [])));
					break;
				case "value_z_to_a":
					this._rowKeys.sort((a,b) => -naturalSort(v(a, []), v(b, [])));
					break;
				default:
					this._rowKeys.sort(this.arrSort(this.rowAttrs));
			}
			switch (this.colOrder) {
				case "value_a_to_z":
					return this._colKeys.sort((a,b) => naturalSort(v([], a), v([], b)));
				case "value_z_to_a":
					return this._colKeys.sort((a,b) => -naturalSort(v([], a), v([], b)));
				default:
					return this._colKeys.sort(this.arrSort(this.colAttrs));
			}
		}
	};

	protected processRecord(record) {
		let colKey: string[] = [];
		let rowKey: string[] = [];
		for (let l = 0, len1 = this.colAttrs.length; l < len1; l++) {
			let x = this.colAttrs[l];
			colKey.push(record[x] != null ? record[x] : "null");
		}

		for (let n = 0, len2 = this.rowAttrs.length; n < len2; n++) {
			let x = this.rowAttrs[n];
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

	getAggregator(rowKey, colKey): Aggregator {
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