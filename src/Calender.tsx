
import { useEffect, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

// 전체 캘린더 데이터를 위한 타입 정의
interface AllCalendarData {
    [className: string]: CalendarEvent[];
}

function Calender() {
    const location = useLocation();
    const navigate = useNavigate();
    const className = location.state?.className as string;

    const [context, setContext] = useState<CalendarEvent[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [mode, setMode] = useState(0); // 0: add, 1: delete

    // 반 정보가 없으면 로그인 페이지로 리디렉션
    useEffect(() => {
        if (!className) {
            alert("잘못된 접근입니다. 로그인 페이지로 이동합니다.");
            navigate('/login');
        }
    }, [className, navigate]);

    // 컴포넌트가 마운트되거나 className이 변경될 때 서버에서 캘린더 데이터를 가져옵니다.
    useEffect(() => {
        if (!className) return;

        const fetchCalendarData = async () => {
            try {
                const response = await axios.get<AllCalendarData>('https://alarmback-f9vr6.ondigitalocean.app/calender');
                const allData = response.data;
                setContext(allData[className] || []);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
                setContext([]);
            }
        };

        fetchCalendarData();
    }, [className]);

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
        if (!className) return;
        try {
            await axios.post('https://alarmback-f9vr6.ondigitalocean.app/calender', {
                className,
                events: context
            });
            alert(`[${className}] 캘린더가 성공적으로 저장되었습니다!`);
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

    // className이 없는 경우 렌더링을 방지
    if (!className) {
        return <div>로그인 페이지로 이동 중...</div>;
    }

    return (
        <div>
            <h1>{className} 캘린더 관리</h1>
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
