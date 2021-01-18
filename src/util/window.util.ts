import { setDimensions } from '../store/reducers/window';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export const WindowUtil = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let timer: number | null;
        const handleResize = () => {
            timer && window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                timer = null;
                dispatch(setDimensions());
            }, 100);
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    });

    return null;
};
