export type Formatter = (x:number) => string

function addSeparators(nStr: string, thousandsSep: string, decimalSep: string) : string {
		nStr += ''
		let x = nStr.split('.')
		let x1 = x[0]
		let x2 = x.length > 1 ? decimalSep + x[1] : ''
		let rgx = /(\d+)(\d{3})/

		while( rgx.test(x1) )
			x1 = x1.replace(rgx, '$1' + thousandsSep + '$2') 

		return x1 + x2
}

function numberFormat(opts?): Formatter {
		let defaults = {
				digitsAfterDecimal: 2,
				scaler: 1,
				thousandsSep: ",",
				decimalSep: ".",
				prefix: "",
				suffix: ""
		}

		opts = {...defaults, ...opts}
		
		return (x:number): string => {
				if( isNaN(x) || !isFinite(x) )
					return ""

				let result = addSeparators((opts.scaler*x).toFixed(opts.digitsAfterDecimal), opts.thousandsSep, opts.decimalSep)
				
				return "" + opts.prefix + result + opts.suffix
		}
}

export const US_FMT: Formatter = numberFormat();

export const US_FMT_INT: Formatter = numberFormat({
	digitsAfterDecimal: 0
})

export const US_FMT_PCT: Formatter = numberFormat({
	digitsAfterDecimal: 1,
	scaler: 100,
	suffix: "%"
});
