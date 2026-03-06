import * as React from 'react';
import { Tianzige } from './Tianzige.js';

interface TraceTaskProps {
    title: string;
    data: Array<{ word: string; pinyin: string }>;
}

export const TraceTask: React.FC<TraceTaskProps> = ({ title, data }) => {
    return (
        <div className="section">
            <div className="section-title">{title}</div>
            <div className="task-trace">
                {data.map((item, index) => (
                    <div className="trace-row" key={index}>
                        <Tianzige char={item.word} pinyin={item.pinyin} isWatermark={false} />
                        <Tianzige char={item.word} isWatermark={true} />
                        <Tianzige />
                        <Tianzige />
                    </div>
                ))}
            </div>
        </div>
    );
};
