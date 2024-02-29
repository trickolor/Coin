import './chart.scss';

const { el, setChildren } = require('redom');

export class Chart {
    constructor(title, values, months) {
        this.title = title;
        this.values = values;
        this.months = months;
    }

    simpleBar(barHeight) {
        const bar = el('.chart__bar');
        bar.style.height = barHeight + 'px';
        return bar;
    }

    monthArray() {
        return this.months.map((month) => { return el('span', { class: 'chart__category', textContent: month }) })
    }

    simpleChart(gridHeight) {
        const max = Math.max(...this.values);

        const maxValue = el('span', { class: 'chart__max-point', textContent: max >= 1000000 ? (Math.floor(max / 1000000)) + ' M' : max });
        const minValue = el('span', { class: 'chart__min-point', textContent: 0 });

        const yScale = el('.chart__y-scale', [
            maxValue,
            minValue
        ]);

        const barArray = this.values.map((value) => { return this.simpleBar(gridHeight * (value / max)) });
        const monthArray = this.monthArray();

        const grid = el('.chart__grid');
        grid.style.height = gridHeight + 'px';
        setChildren(grid, barArray);

        const xScale = el('.chart__x-scale', monthArray);

        const container = el('.chart__container', [
            el('.chart__left-half', [
                el('h3.chart__title', { textContent: this.title }),
                grid,
                xScale,
            ]),
            yScale
        ]);

        if (this.months.length > 6) {
            grid.classList.add('chart__grid--extended');
            container.classList.add('chart__container--extended');
            xScale.classList.add('chart__x-scale--extended');
            yScale.classList.add('chart__y-scale--extended');
        }

        return container;
    }

    advancedBar(lossRation, profitRation) {
        const lossBar = el('div', { class: 'chart__loss-bar' });
        lossBar.style.height = lossRation + 'px';

        const profitBar = el('div', { class: 'chart__profit-bar' });
        profitBar.style.height = profitRation + 'px';

        if (lossRation !== profitRation) {
            if (profitRation > lossRation) {
                lossBar.classList.add('chart__loss-bar--secondary');
            } else if (profitRation < lossRation) {
                profitBar.classList.add('chart__profit-bar--secondary');
            }

            return el('.chart__advanced-bar', [
                lossBar,
                profitBar
            ]);
        } else {
            const neutralBar = el('.chart__advanced-bar.chart__neutral-bar');
            neutralBar.style.height = profitRation + 'px';
            return neutralBar;
        }
    }

    advancedChart(gridHeight, lossValues, profitValues) {
        const maxLoss = Math.max(...lossValues);
        const maxProfit = Math.max(...profitValues);

        const advancedMax = Math.max(maxLoss, maxProfit);
        const medium = maxProfit > maxLoss ? maxLoss : maxProfit;
        console.log(medium);

        let mediumPoint = null;
        if (maxProfit !== maxLoss) {
            mediumPoint = el('span.chart__medium-point', { textContent: medium > 1000000 ? Math.floor(medium / 1000000) + ' M' : medium });
            mediumPoint.style.bottom = ((gridHeight * medium / advancedMax) + 23) + 'px';
        }

        const maxPoint = el('span.chart__max-point', { textContent: advancedMax > 1000000 ? Math.floor(advancedMax / 1000000) + ' M' : advancedMax });
        const minPoint = el('span.chart__min-point', { textContent: 0 })

        const points = mediumPoint ?
            [
                maxPoint,
                mediumPoint,
                minPoint
            ] :
            [
                maxPoint,
                minPoint
            ];

        const barArray = [];
        for (let i = 0; i < profitValues.length; ++i) {
            let lossRation = (gridHeight * lossValues[i] / advancedMax);
            let profitRation = (gridHeight * profitValues[i] / advancedMax);
            barArray.push(this.advancedBar(lossRation, profitRation));
        }

        const grid = el('.chart__grid.chart__grid--extended', barArray);
        grid.style.height = gridHeight + 'px';

        const monthArray = this.monthArray();
        const xScale = el('.chart__x-scale.chart__x-scale--extended', monthArray);

        const yScale = el('.chart__y-scale.chart__y-scale--extended', points);

        return el('.chart__container.chart__container--extended', [
            el('.chart__left-half', [
                el('h3.chart__title', { textContent: this.title }),
                grid,
                xScale
            ]),
            yScale
        ]);
    }
}
