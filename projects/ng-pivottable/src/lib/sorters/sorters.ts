export type Sorter = (a,b) => number

export const naturalSort:Sorter = function(as, bs) {
	let rx = /(\d+)|(\D+)/g;
	let rd = /\d/;
	let rz = /^0/;

	if ((bs != null) && (as == null)) {
	  return -1;
	}
	if ((as != null) && (bs == null)) {
	  return 1;
	}
	if (typeof as === "number" && isNaN(as)) {
	  return -1;
	}
	if (typeof bs === "number" && isNaN(bs)) {
	  return 1;
	}
	let nas = +as;
	let nbs = +bs;
	if (nas < nbs) {
	  return -1;
	}
	if (nas > nbs) {
	  return 1;
	}
	if (typeof as === "number" && typeof bs !== "number") {
	  return -1;
	}
	if (typeof bs === "number" && typeof as !== "number") {
	  return 1;
	}
	if (typeof as === "number" && typeof bs === "number") {
	  return 0;
	}
	if (isNaN(nbs) && !isNaN(nas)) {
	  return -1;
	}
	if (isNaN(nas) && !isNaN(nbs)) {
	  return 1;
	}

	let a:any = String(as);
	let b:any = String(bs);
	if (a === b) {
	  return 0;
	}
	if (!(rd.test(a) && rd.test(b))) {
	  return (a > b ? 1 : -1);
	}

	a = a.match(rx);
	b = b.match(rx);
	while (a.length && b.length) {
	  let a1 = a.shift();
	  let b1 = b.shift();
	  if (a1 !== b1) {
		if (rd.test(a1) && rd.test(b1)) {
		  return a1.replace(rz, ".0") - b1.replace(rz, ".0");
		} else {
		  return (a1 > b1 ? 1 : -1);
		}
	  }
	}
	return a.length - b.length;
};

export function sortAs(order: any[]):Sorter {
	var i, l_mapping, mapping, x;
	mapping = {};
	l_mapping = {};
	for (i in order) {
		x = order[i];
		mapping[x] = i;
		if (typeof x === "string") {
			l_mapping[x.toLowerCase()] = i;
		}
	}

	return function(a, b) {
		if ((mapping[a] != null) && (mapping[b] != null)) {
			return mapping[a] - mapping[b];
		} else if (mapping[a] != null) {
			return -1;
		} else if (mapping[b] != null) {
			return 1;
		} else if ((l_mapping[a] != null) && (l_mapping[b] != null)) {
			return l_mapping[a] - l_mapping[b];
		} else if (l_mapping[a] != null) {
			return -1;
		} else if (l_mapping[b] != null) {
			return 1;
		} else {
			return naturalSort(a, b);
		}
	};
}