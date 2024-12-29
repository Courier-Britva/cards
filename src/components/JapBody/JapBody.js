import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './japbody.css';
import csvData from './symbols.csv';

function JapBody() {
    const [data, setData] = useState([]);
    const [currentSymbol, setCurrentSymbol] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [feedbackClass, setFeedbackClass] = useState('');

    useEffect(() => {
        fetch(csvData)
            .then(response => response.text())
            .then(csvData => {
                Papa.parse(csvData, {
                    header: true,
                    complete: (result) => setData(result.data),
                });
            });
    }, []);

    useEffect(() => {
        if (data.length > 0) generateNewSymbol();
    }, [data]);

    const generateNewSymbol = () => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setCurrentSymbol(data[randomIndex]);
        setFeedbackClass('');
        setInputValue('');
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const checkAnswer = () => {
        if (inputValue.trim().toLowerCase() === currentSymbol.pronunciation.toLowerCase()) {
            setFeedbackClass('correct');
        } else {
            setFeedbackClass('wrong');
        }
        setTimeout(generateNewSymbol, 3200);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    };

    return (
        <div className='body'>
            <span className='new_head_text'>Your new symbols are:</span>
            <div className="symbol_container">
                {currentSymbol.hiragana && (
                    <div className={`symbol_container_element ${feedbackClass}`}>
                        <span className="type">Hiragana</span>
                        <span className="symbol">{currentSymbol.hiragana}</span>
                    </div>
                )}
                {currentSymbol.katakana && (
                    <div className={`symbol_container_element ${feedbackClass}`}>
                        <span className="type">Katakana</span>
                        <span className="symbol">{currentSymbol.katakana}</span>
                    </div>
                )}
            </div>
            <input
                className='input'
                placeholder='Your answer in English'
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown} 
            />
            {feedbackClass === 'wrong' && (
                <div className='popup popup_wrong'>
                    Nooo <br/>it was: <b>{currentSymbol.pronunciation}</b>
                </div>
            )}
            {feedbackClass === 'correct' && (
                <div className='popup popup_correct'>
                    Yes! <br/>it is <b>{currentSymbol.pronunciation}</b>
                </div>
            )}
        </div>
    );
}

export default JapBody;
