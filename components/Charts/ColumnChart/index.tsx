import React, { Component } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

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
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
                panY: false,
                wheelX: "panX",
                wheelY: "zoomX",
                layout: root.verticalLayout,
            })
        );
        let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);
        let legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50,
            })
        );

        let yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                maxDeviation: 0.3,
                renderer: am5xy.AxisRendererY.new(root, {
                    strokeOpacity: 0.1,
                    minGridDistance: 50,
                }),
                numberFormatter: am5.NumberFormatter.new(root, {
                    numberFormat: "#",
                    precision: 0, // Isso garante que apenas valores inteiros sejam exibidos
                }),
                maxPrecision: 0,
            })
        ); // Create X-Axis
        let xAxis = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                renderer: am5xy.AxisRendererX.new(root, {
                    minGridDistance: 30, // Ajusta o espaçamento entre as categorias
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9,
                }),
                categoryField: "dia",
                tooltip: am5.Tooltip.new(root, {
                    labelText: "Dia {dia}",
                }),
            })
        );

        xAxis.data.setAll(this.props.data);
        // Make stuff animate on load// Create series
        let series2 = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Mês passado",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "mesPassado",
                sequencedInterpolation: true,
                categoryXField: "dia",
                clustered: true,
                tooltip: am5.Tooltip.new(root, {
                    labelText: "{mesPassado}",
                }),
            })
        );
        let series1 = chart.series.push(
            am5xy.ColumnSeries.new(root, {
                name: "Este mês",
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: "esteMes",
                categoryXField: "dia",
                sequencedInterpolation: true,
                clustered: true,
                tooltip: am5.Tooltip.new(root, {
                    labelText: "{esteMes}",
                }),
            })
        );

        series1.data.setAll(this.props.data); // Add legend
        series2.data.setAll(this.props.data);
        legend.data.setAll(chart.series.values);
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series1.appear(1000);
        series2.appear(1000);
        chart.appear(1000, 100);
        //this.series = series;
        this.root = root;
    }

    componentDidUpdate(oldProps) {
        // if (oldProps.data !== this.props.data) {
        //     let data = this.props.data?.map((item) => {
        //         return {
        //             ...item,
        //             columnSettings: {
        //                 fill: am5.Color.fromString(item.cor),
        //             },
        //         };
        //     });
        //     this.series?.data?.setAll(data);
        //     this.series?.data?.setAll(data);
        // }
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
