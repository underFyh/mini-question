import * as React from 'react';
import { Tianzige } from './Tianzige.js';

interface DictationTaskProps {
    title: string;
    data: Array<{ words: string[]; pinyins: string[] }>;
}

export const DictationTask: React.FC<DictationTaskProps> = ({ title, data }) => {
    return (
        <div className="section">
            <div className="section-title">{title}</div>
            <div className="task-dictation">
                {data.map((group, index) => (
                    <div className="dictation-group" key={index}>
                        {group.pinyins.map((py, j) => (
                            <Tianzige key={j} pinyin={py} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};
