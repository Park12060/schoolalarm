
import { useEffect, useState, type ChangeEvent } from "react";
import './App.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {type DateClickArg} from "@fullcalendar/interaction"
import axios from 'axios';

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
    const [context, setContext] = useState<CalendarEvent[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [mode, setMode] = useState(0); // 0: add, 1: delete

    // 컴포넌트가 마운트될 때 서버에서 캘린더 데이터를 가져옵니다.
    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                const response = await axios.get<CalendarEvent[]>('/api/calender');
                const calendarData = response.data;
                setContext(Array.isArray(calendarData) ? calendarData : []);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
                setContext([]);
            }
        };

        fetchCalendarData();
    }, []);

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
            const newEvent = {id: arg.dateStr, title: inputValue, date: arg.dateStr};
            setContext([...context, newEvent]);
            setInputValue('');
        } else { // Delete mode
            const updatedContext = context.filter((event) => event.id !== arg.dateStr);
            setContext(updatedContext);
        }
    }

    const handleSaveToServer = async () => {
        try {
            await axios.post('/api/calender', { events: context });
            alert(`캘린더가 성공적으로 저장되었습니다!`);
        } catch (error) {
            console.error('Error saving calendar:', error);
            let errorMessage = '캘린더 저장에 실패했습니다.';
            if (axios.isAxiosError(error) && error.response) {
                const errorData: ErrorResponse | null = error.response.data;
                errorMessage = errorData?.message || errorMessage;
            }
            alert(errorMessage);
        }
    };

    return (
        <div>
            <h1>캘린더 관리</h1>
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
                서버에 저장
            </button>
        </div>
    )
}

export default Calender;
