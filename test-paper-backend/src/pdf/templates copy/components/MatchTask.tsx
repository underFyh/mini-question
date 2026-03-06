import * as React from 'react';

interface MatchTaskProps {
    title: string;
    data: {
        left: string[];
        right: string[];
    };
}

export const MatchTask: React.FC<MatchTaskProps> = ({ title, data }) => {
    return (
        <div className="section">
            <style dangerouslySetInnerHTML={{
                __html: `
                .task-match {
                    display: flex;
                    width: 300px;
                    margin-left: 40px;
                    justify-content: space-between;
                }
                .match-col {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }
                .match-item {
                    display: flex;
                    align-items: center;
                    font-family: "Kaiti", "楷体", serif;
                    font-size: 24px;
                }
                .match-col.left .match-item {
                    justify-content: flex-end;
                }
                .match-col.right .match-item {
                    justify-content: flex-start;
                }
                .dot {
                    width: 10px;
                    height: 10px;
                    background: #333;
                    border-radius: 50%;
                    display: inline-block;
                    margin: 0 15px;
                }
                `
            }} />
            <div className="section-title">{title}</div>
            <div className="task-match">
                <div className="match-col left">
                    {data.left.map((text, index) => (
                        <div className="match-item" key={index}>
                            <span>{text}</span>
                            <span className="dot"></span>
                        </div>
                    ))}
                </div>
                <div className="match-col right">
                    {data.right.map((text, index) => (
                        <div className="match-item" key={index}>
                            <span className="dot"></span>
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
