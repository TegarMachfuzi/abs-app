import React from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { ChartSegmentationProps } from "~/type";

const BarChartSegment: React.FC<{ data: ChartSegmentationProps[] }> = ({
    data,
}) => {
    return (
        <BarChart height={300} width={850} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Segmentation" fill="#6d28d9" barSize={100} />
        </BarChart>
    );
};

export default BarChartSegment;
