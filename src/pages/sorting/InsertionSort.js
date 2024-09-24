import React, { useEffect, useState } from 'react';
import useAnimator from '@/hooks/useAnimator';
import useAlgorithm from '@/hooks/useAlgorithm';
import { InputNumbers, Numbox } from '@/components/numbers';
import { Colors } from '@/common/constants';
import { sleep } from '@/common/utils';

var arr, delay = 800;

export default function InsertionSort() {
    const [numbers, setNumbers] = useState([]);
    const [scope, { tx, ty, bgcolor }] = useAnimator();
    const [algorithm, setCurrentStep] = useAlgorithm(`
    for i = 1 to (n - 1):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j = j - 1
        arr[j + 1] = key
    `);

    if (!numbers.length) arr = undefined;

    const pickNumber = async (i) => {
        bgcolor(`#box${i}`, Colors.compare);
        setCurrentStep('1,2');
        await sleep(delay);
        await ty(`#box${i}`, -50, 0.5);
    };

    const sortNumbers = async () => {
        await sleep(delay);
        bgcolor(`#box${0}`, Colors.sorted);
        for (let i = 1; i < arr.length; i++) {
            setCurrentStep('0');
            await sleep(delay);
            await pickNumber(i);
            setCurrentStep('3');
            await sleep(delay);
            let num = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > num) {
                arr[j + 1] = arr[j];
                setCurrentStep('3,4,5');
                await tx(`#box${j}`, 60, 0.5);
                j--;
            }
            if (j < i - 1) {
                arr[j + 1] = num;
                let k = i - (j + 1);
                await tx(`#box${i}`, -k * 60, k * 0.2);
            }
            setCurrentStep('6');
            await ty(`#box${i}`, 0, 0.5);
            await bgcolor(`#box${i}`, Colors.sorted);
            setNumbers(arr.slice());
        }
        setCurrentStep('');
    };

    useEffect(() => {
        numbers.forEach((_, i) => tx(`#box${i}`, 0, 0));
    }, [numbers]);

    const handleStart = (values) => {
        setNumbers(values);
        arr = values.slice();
        sortNumbers().catch(() => setCurrentStep(''));
    };

    const handleStop = () => setNumbers([]);

    return (
        <>
            <section>
                <p>
                    Ever organized a hand of playing cards? Then you already
                    know <strong>Insertion Sort</strong>! This algorithm takes
                    each element from the unsorted part and slides it into its
                    correct position in the sorted part. It is like placing a
                    new card in the right spot of a sorted hand, making it
                    intuitive and efficient for small dataset, especially for
                    partially sorted lists.
                </p>
                {algorithm}
            </section>
            <InputNumbers onStart={handleStart} onStop={handleStop} />
            <div className="d-flex py-5" ref={scope}>
                {numbers.map((num, i) => (
                    <Numbox key={i} index={i} value={num} />
                ))}
            </div>
        </>
    );
}
