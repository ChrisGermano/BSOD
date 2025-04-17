import React, { useState, useEffect } from 'react';

const ReferrerText = () => {
    const [referrer, setReferrer] = useState('Windows');

    useEffect(() => {
        if (document.referrer) {
            try {
                const url = new URL(document.referrer);
                setReferrer(url.hostname);
            } catch (e) {
                // If URL parsing fails, keep 'Windows' as default
                console.error('Error parsing referrer URL:', e);
            }
        }
    }, []);

    return <span className="bsod-ref">{referrer}</span>;
};

export default ReferrerText; 