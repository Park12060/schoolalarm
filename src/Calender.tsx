
import React, { useEffect, useState, ChangeEvent } from "react";
import './App.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {type DateClickArg} from "@fullcalendar/interaction"

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
}

// 서버의 오류 응답 형식을 정의합니다.
interface ErrorResponse {
    message: string;
}

function Calender() {
    const getContext = (): CalendarEvent[] => {
        const savedContext = localStorage.getItem("context");
        if (!savedContext) return [];
        try {
            return JSON.parse(savedContext);
        } catch (error) {
            console.error("Error parsing context from localStorage:", error);
            return [];
        }
    }

    const [context, setContext] = useState<CalendarEvent[]>(getContext);
    const [inputValue, setInputValue] = useState('');
    const [mode, setMode] = useState(0); // 0: add, 1: delete

    useEffect(() => {
        localStorage.setItem("context", JSON.stringify(context));
    }, [context]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleButtonClick = () => {
        setMode(prevMode => (prevMode === 0 ? 1 : 0));
    }

    const handleDateClick = (arg: DateClickArg) => {
        if (mode === 0) { // Add mode
            if (inputValue.trim() === '') {
                alert('내용을 입력해주세요.');
                return;
            }
            setContext([...context, {id: arg.dateStr, title: inputValue, date: arg.dateStr}]);
            setInputValue('');
        } else { // Delete mode
            const updatedContext = context.filter((event) => event.id !== arg.dateStr);
            setContext(updatedContext);
        }
    }

    const handleSaveToServer = async () => {
        try {
            const response = await fetch('/back/calender', { // 백엔드 엔드포인트
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(context),
            });

            if (response.ok) {
                alert('Calendar saved successfully!');
            } else {
                const errorData: ErrorResponse | null = await response.json().catch(() => null);
                const errorMessage = errorData?.message || 'Failed to save calendar.';
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error saving calendar:', error);
            alert('An error occurred while saving the calendar.');
        }
    };

    return (
        <div>
            <h1>Calendar</h1>
            <h2> {mode === 0 ? "추가 모드" : "삭제 모드"}</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                dateClick={handleDateClick}
                events={context}
            />
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="할 일을 입력하세요"
                disabled={mode === 1}
            />
            <button onClick={handleButtonClick}>
                모드 변경
            </button>
            <button onClick={handleSaveToServer}>
                Save to Server
            </button>
        </div>
    )
}

export default Calender;
