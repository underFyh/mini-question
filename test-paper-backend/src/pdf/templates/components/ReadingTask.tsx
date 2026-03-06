import * as React from 'react';

interface ReadingTaskProps {
    title: string;
    data: string;
}

export const ReadingTask: React.FC<ReadingTaskProps> = ({ title, data }) => {
    return (
        <div className="section">
            <div className="section-title">{title}</div>
            <div className="task-reading">
                {data}
            </div>
        </div>
    );
};
