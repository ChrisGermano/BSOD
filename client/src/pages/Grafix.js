import React, { useEffect, useRef, useState } from 'react';

const Grafix = () => {
    const c = useRef(null);
    const f = useRef(null);
    const p = useRef([]);
    const t = useRef(0);
    const [fs, setFs] = useState(false);

    const C = [
        '#1F214D',
        '#50366F',
        '#BF3475',
        '#EE6C45',
        '#FFCE61'
    ];

    const g = (w, h, n) => {
        const p = [];
        for (let i = 0; i < n; i++) {
            p.push({
                x: Math.random() * w,
                y: Math.random() * h,
                bx: Math.random() * w,
                by: Math.random() * h,
                s: 0.2 + Math.random() * 0.3,
                ph: Math.random() * Math.PI * 2
            });
        }
        return p;
    };

    const d = (a, b) => {
        const x = a.x - b.x;
        const y = a.y - b.y;
        return Math.sqrt(x * x + y * y);
    };

    const fc = (x, y, p) => {
        let m = Infinity;
        let n = null;
        for (const o of p) {
            const r = d({ x, y }, o);
            if (r < m) {
                m = r;
                n = o;
            }
        }
        return n;
    };

    const r = (ctx, w, h) => {
        const tm = t.current;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, w, h);

        const s = 10;
        const gw = 30;
        const gh = 30;

        p.current.forEach((points, index) => {
            points.forEach(point => {
                point.x = point.bx + Math.sin(tm * point.s + point.ph) * 10;
                point.y = point.by + Math.cos(tm * point.s + point.ph) * 10;
            });

            const ci = Math.floor(index / 2);
            const cl = C[ci];
            
            ctx.fillStyle = cl;
            for (let y = 0; y < gh; y++) {
                for (let x = 0; x < gw; x++) {
                    const wx = x * s;
                    const wy = y * s;
                    
                    const cur = fc(wx, wy, points);
                    const r = fc(wx + s, wy, points);
                    const d = fc(wx, wy + s, points);
                    
                    if (cur !== r || cur !== d) {
                        ctx.fillRect(wx, wy, s, s);
                    }
                }
            }
        });

        t.current += 0.01;
    };

    useEffect(() => {
        const cnv = c.current;
        const ctx = cnv.getContext('2d');
        const w = fs ? window.innerWidth : 300;
        const h = fs ? window.innerWidth : 300;
        
        cnv.width = w;
        cnv.height = h;

        p.current = C.flatMap(() => [
            g(w, h, 15),
            g(w, h, 15)
        ]);

        const a = () => {
            r(ctx, w, h);
            f.current = requestAnimationFrame(a);
        };
        a();

        return () => {
            if (f.current) {
                cancelAnimationFrame(f.current);
            }
        };
    }, [fs]);

    return (
        <div>
            <h1 className="bsod-header" onClick={() => setFs(!fs)} style={{ cursor: 'pointer' }}>Grafix</h1>
            <p className="bsod-details">Just some art</p>
            <div style={{
                width: fs ? '100vw' : '300px',
                height: fs ? '100vw' : '300px',
                border: '1px solid black',
                margin: '20px auto',
                overflow: 'hidden'
            }}>
                <canvas
                    ref={c}
                    style={{
                        display: 'block'
                    }}
                />
            </div>
        </div>
    );
};

export default Grafix; 