import React from "react";
import { Pie, PieChart, Tooltip } from "recharts";
import { ChartSegmentationProps } from "~/type";

const PieChartSegment: React.FC<{ data: ChartSegmentationProps[] }> = ({
    data,
}) => {
    return (
        <PieChart width={300} height={230}>
            <Tooltip />
            <Pie
                data={data}
                dataKey="Segmentation"
                nameKey="name"
                fill="#6d28d9"
                label
            />
        </PieChart>
    );
};
export default PieChartSegment;
