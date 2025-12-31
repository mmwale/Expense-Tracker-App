/*
  ChartComponent
  - Minimal bar chart helper used by Dashboard; expects `dataPoints` array of {label, value}.
  - Scales bars relative to the maximum value in the dataset.
*/
import './ChartComponent.css';

const ChartComponent = ({ dataPoints }) => {
    // Find the highest value for scale calculations (avoid division by 0)
    const totalMaximum = Math.max(...dataPoints.map(dp => dp.value)) || 1;

    // Render simple vertical bars
    return (
        <div className="chart">
            {dataPoints.map(dataPoint => (
                <div key={dataPoint.label} className="chart-bar">
                    <div
                        className="chart-bar__fill"
                        style={{
                            height: `${(dataPoint.value / totalMaximum) * 100}%`,
                        }}
                    ></div>
                    <div className="chart-bar__label">{dataPoint.label}</div>
                </div>
            ))}
        </div>
    );
};

export default ChartComponent;