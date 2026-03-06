import * as React from 'react';
import { TraceTask } from './components/TraceTask.js';
import { DictationTask } from './components/DictationTask.js';
import { MatchTask } from './components/MatchTask.js';
import { ReadingTask } from './components/ReadingTask.js';

export const PaperLayout: React.FC<{ data: any; cssStyle: string }> = ({ data, cssStyle }) => {
    return (
        <html lang="zh-CN">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{data.tittle || '每日通关微练习'}</title>
                <style dangerouslySetInnerHTML={{
                    __html: cssStyle
                }} />
            </head>
            <body>
                <div className="paper-container" id="paper">
                    <div className="header">
                        <h1>🌟 {data.tittle || '每日通关微练习'} 🌟</h1>
                        <div className="date">挑战日期：{data.date}</div>
                    </div>

                    {data.tasks && data.tasks.length > 0 && data.tasks.map((task: any, index: number) => {
                        if (task.type === 'trace') {
                            return <TraceTask key={index} title={task.title} data={task.data} />;
                        } else if (task.type === 'dication' || task.type === 'dictation') {
                            return <DictationTask key={index} title={task.title} data={task.data} />;
                        } else if (task.type === 'match') {
                            return <MatchTask key={index} title={task.title} data={task.data} />;
                        } else if (task.type === 'reading') {
                            return <ReadingTask key={index} title={task.title} data={task.data} />;
                        }
                        return <div key={index}>未知的题目类型：{task.type}</div>;
                    })}
                </div>
            </body>
        </html>
    );
};
