import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Card from "../shard-dashboard/card/Card.jsx";
import CardBody from "../shard-dashboard/card/CardBody.jsx";
import LineChart from "../../views/UserProfile/LineChart.jsx";
import "./SmallStats.css";

const SmallStats = ({ variation, chartData, chartLabels, label, value, percentage, increase, isLoading}) => {

    const cardClasses = classNames(
        "stats-small",
        variation && `stats-small--${variation}`
    );

    const cardBodyClasses = classNames(
        variation === "1" ? "p-0 d-flex" : "px-0 pb-0"
    );

    const innerWrapperClasses = classNames(
        "d-flex",
        variation === "1" ? "flex-column m-auto" : "px-3"
    );

    const dataFieldClasses = classNames(
        "stats-small__data",
        variation === "1" && "text-center"
    );

    const labelClasses = classNames(
        "stats-small__label",
        "text-uppercase",
        variation !== "1" && "mb-1"
    );

    const valueClasses = classNames(
        "stats-small__value",
        "count",
        variation === "1" ? "my-3" : "m-0",
        isLoading && `loading-skeleton`
    );

    const innerDataFieldClasses = classNames(
        "stats-small__data",
        variation !== "1" && "text-right align-items-center"
    );

    const percentageClasses = classNames(
        "stats-small__percentage",
        `stats-small__percentage--${increase === undefined ? "" : increase ? "increase" : "decrease"}`
    );

    return (
        <Card small className={cardClasses}>
            <CardBody className={cardBodyClasses}>
                <div className={innerWrapperClasses}>
                    <div className={dataFieldClasses}>
                        <span className={labelClasses}>{label}</span>
                        <h1 className={valueClasses}>{value}</h1>
                    </div>
                    <div className={innerDataFieldClasses}>
                        <span className={percentageClasses}>{percentage}</span>
                    </div>
                    <LineChart chartData={{
                        labels: chartLabels.map(() => ""),
                        datasets: chartData
                    }}/>
                </div>
            </CardBody>
        </Card>
    );
}

SmallStats.propTypes = {
    /**
     * The Small Stats variation.
     */
    variation: PropTypes.string,
    /**
     * The label.
     */
    label: PropTypes.string,
    /**
     * The value.
     */
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * The percentage number or string.
     */
    percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /**
     * Whether is a value increase, or not.
     */
    increase: PropTypes.bool,
    /**
     * The Chart.js configuration object.
     */
    chartConfig: PropTypes.object,
    /**
     * The Chart.js options object.
     */
    chartOptions: PropTypes.object,
    /**
     * The chart data.
     */
    chartData: PropTypes.array.isRequired,
    /**
     * The chart labels.
     */
    chartLabels: PropTypes.array
};

SmallStats.defaultProps = {
    value: 0,
    label: "Label",
    chartOptions: Object.create(null),
    chartConfig: Object.create(null),
    chartData: [],
    chartLabels: []
};

export default SmallStats;
