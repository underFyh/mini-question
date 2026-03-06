import * as React from 'react';

interface TianzigeProps {
    char?: string;
    pinyin?: string;
    isWatermark?: boolean;
}

export const Tianzige: React.FC<TianzigeProps> = ({ char, pinyin, isWatermark }) => {
    return (
        <div className="grid-group">
            {pinyin ? <div className="pinyin">{pinyin}</div> : <div className="pinyin"></div>}
            <div className="tianzige">
                {char ? (
                    <span className={`char ${isWatermark ? 'watermark' : ''}`}>
                        {char}
                    </span>
                ) : null}
            </div>
        </div>
    );
};
