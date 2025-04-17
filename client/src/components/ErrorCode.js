import React, { useEffect, useState } from 'react';

const ErrorCode = ({ length }) => {
    const [code, setCode] = useState('');

    useEffect(() => {
        const generateHex = () => {
            const hexChars = '0123456789ABCDEF';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
            }
            return result;
        };

        setCode(generateHex());
    }, [length]);

    return <span>{code}</span>;
};

export default ErrorCode; 