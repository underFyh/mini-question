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
