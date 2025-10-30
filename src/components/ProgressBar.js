import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { View, Animated } from 'react-native';

const ProgressBar = forwardRef(({ duration = 5000, onComplete, isPaused }, ref) => {
    const progress = useRef(new Animated.Value(0)).current;
    const animationRef = useRef(null);

    useImperativeHandle(ref, () => ({
        pause: () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        },
        resume: () => {
            const remaining = duration * (1 - progress._value);
            startAnimation(remaining);
        },
        reset: () => {
            progress.setValue(0);
            startAnimation(duration);
        }
    }));

    const startAnimation = (animationDuration) => {
        animationRef.current = Animated.timing(progress, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: false
        });

        animationRef.current.start(({ finished }) => {
            if (finished && onComplete) {
                onComplete();
            }
        });
    };

    useEffect(() => {
        startAnimation(duration);

        return () => {
            if (animationRef.current) {
                animationRef.current.stop();
            }
        };
    }, []);

    const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.progress, { width }]} />
        </View>
    );
});

const styles = {
    container: {
        height: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: '100%'
    },
    progress: {
        height: '100%',
        backgroundColor: '#fff'
    }
};

export default ProgressBar;