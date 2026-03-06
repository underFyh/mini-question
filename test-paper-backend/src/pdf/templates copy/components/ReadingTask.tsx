import * as React from 'react';

interface ReadingTaskProps {
    title: string;
    data: string;
}

export const ReadingTask: React.FC<ReadingTaskProps> = ({ title, data }) => {
    return (
        <div className="section">
            <style dangerouslySetInnerHTML={{
                __html: `
                .task-reading {
                    font-family: "Kaiti", "楷体", serif;
                    font-size: 24px;
                    line-height: 1.8;
                    padding: 0 20px;
                }
                `
            }} />
            <div className="section-title">{title}</div>
            <div className="task-reading">
                {data}
            </div>
        </div>
    );
};
