import { US_FMT_INT } from '../formats'
import { Aggregator } from './aggregator'
import { CountAggregator } from './count-aggregator'
import { MinAggregator, MaxAggregator, FirstAggregator, LastAggregator} from './extremes-aggregator'
import { FractionOfAggregator } from './fraction-of-aggregator'
import { MedianAggregator } from './quantile-aggregator'
import { AverageAggregator, VarianceAggregator, StandardDeviationAggregator } from './running-stat-aggregator'
import { SumAggregator } from './sum-aggregator'
import { SumOverSumAggregator } from './sum-over-sum-aggregator'
import { SumOverSumBound80Aggregator } from './sum-over-sum-bound80-aggregator'
import { CountUniqueAggregator, ListUniqueAggregator } from './uniques-aggregator'

export type AggregatorsFactory = {[key:string]: (attrs:string[]) => Aggregator }
export const AGGREGATORS: AggregatorsFactory = {
    "Count": (attrs:string[]) => new CountAggregator(),
    "Count Unique Values": (attrs:string[]) => new CountUniqueAggregator(attrs[0]),
    "List Unique Values": (attrs:string[]) => new ListUniqueAggregator(", ", attrs[0]),
    "Sum": (attrs:string[]) => new SumAggregator(attrs[0]),
    "Integer Sum": (attrs:string[]) => new SumAggregator(attrs[0], US_FMT_INT),
    "Average": (attrs:string[]) => new AverageAggregator(attrs[0]),
    "Median": (attrs:string[]) => new MedianAggregator(attrs[0]),
    "Sample Variance": (attrs:string[]) => new VarianceAggregator(attrs[0], 1),
    "Sample Standard Deviation": (attrs:string[]) => new StandardDeviationAggregator(attrs[0], 1),
    "Minimum": (attrs:string[]) => new MinAggregator(attrs[0]),
    "Maximum": (attrs:string[]) => new MaxAggregator(attrs[0]),
    "First": (attrs:string[]) => new FirstAggregator(attrs[0]),
    "Last": (attrs:string[]) => new LastAggregator(attrs[0]),
    "Sum over Sum": (attrs:string[]) => new SumOverSumAggregator(attrs[0],attrs[1]),
    "80% Upper Bound": (attrs:string[]) => new SumOverSumBound80Aggregator(attrs[0],attrs[1],true),
    "80% Lower Bound": (attrs:string[]) => new  SumOverSumBound80Aggregator(attrs[0],attrs[1],false),
    "Sum as Fraction of Total": (attrs:string[]) => new FractionOfAggregator( new SumAggregator(attrs[0]), 'total' ),
    "Sum as Fraction of Rows": (attrs:string[]) => new FractionOfAggregator( new SumAggregator(attrs[0]), 'row' ),
    "Sum as Fraction of Columns": (attrs:string[]) => new FractionOfAggregator( new SumAggregator(attrs[0]), 'col' ),
    "Count as Fraction of Total": (attrs:string[]) => new FractionOfAggregator( new CountAggregator(), 'total' ),
    "Count as Fraction of Rows": (attrs:string[]) => new FractionOfAggregator( new CountAggregator(), 'row' ),
    "Count as Fraction of Columns": (attrs:string[]) => new  FractionOfAggregator( new CountAggregator(), 'col' ),
};