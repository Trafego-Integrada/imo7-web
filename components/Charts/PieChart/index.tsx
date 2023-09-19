import React, { Component } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5stock from "@amcharts/amcharts5/stock";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import moment from "moment";
import { randomUUID } from "crypto";

class App extends Component {
    id: string;

    constructor(props) {
        super(props);
        this.id = self.crypto.randomUUID();
    }

    componentDidMount() {
        /* Chart code */
        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        let root = am5.Root.new(this.id);

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([am5themes_Animated.new(root)]);

        // Create chart
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/
        let chart = root.container.children.push(
            am5percent.PieChart.new(root, { layout: root.horizontalLayout })
        );

        // Create series
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
        let series = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "value",
                categoryField: "label",
                templateField: "columnSettings",
                fill: root.interfaceColors.get("alternativeBackground"),
            })
        );
        series.slices.template.setAll({
            templateField: "columnSettings",
        });
        series.labels.template.set("forceHidden", true);
        // series.labels.template.set(
        //     "text",
        //     "{category}: {value}  ([bold]{valuePercentTotal.formatNumber('0.00')}%[/])"
        // );
        series.slices.template.set(
            "tooltipText",
            "{category}: {value}  ([bold]{valuePercentTotal.formatNumber('0.00')}%[/])"
        );
        // Set data
        // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
        series.data.setAll(this.props.data);

        // Create legend
        // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
        let legend = chart.children.push(
            am5.Legend.new(root, {
                y: am5.percent(50),
                centerY: am5.percent(50),
                layout: root.verticalLayout,
                templateField: "columnSettings",
            })
        );
        legend.valueLabels.template.set("forceHidden", true);
        legend.markerRectangles.template.setAll({
            cornerRadiusTL: 10,
            cornerRadiusTR: 10,
            cornerRadiusBL: 10,
            cornerRadiusBR: 10,
        });
        legend.data.setAll(series.dataItems);

        // Play initial series animation
        // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
        series.appear(1000, 100);
        this.series = series;
        this.root = root;
    }
    componentDidUpdate(oldProps) {
        if (oldProps.data !== this.props.data) {
            let data = this.props.data?.map((item) => {
                return {
                    ...item,
                    columnSettings: {
                        fill: am5.Color.fromString(item.cor),
                    },
                };
            });
            this.series?.data?.setAll(data);
            this.series?.data?.setAll(data);
        }
    }

    componentWillUnmount() {
        if (this.root) {
            this.root.dispose();
        }
    }

    render() {
        return (
            <div id={this.id} style={{ width: "100%", height: "500px" }}></div>
        );
    }
}

export default App;
