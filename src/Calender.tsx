
import { useEffect, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

// 전체 캘린더 데이터를 위한 타입 정의
interface AllCalendarData {
    [className: string]: CalendarEvent[];
}

function Calender() {
    const location = useLocation();
    const navigate = useNavigate();
    const className = location.state?.className as string;

    // 반 정보가 없으면 로그인 페이지로 리디렉션
    useEffect(() => {
        if (!className) {
            alert("잘못된 접근입니다. 로그인 페이지로 이동합니다.");
            navigate('/login');
        }
    }, [className, navigate]);

    // 특정 반의 데이터를 localStorage에서 가져오는 함수
    const getClassContext = (currentClass: string): CalendarEvent[] => {
        const allDataString = localStorage.getItem("allCalendarData");
        if (!allDataString) return [];
        try {
            const allData: AllCalendarData = JSON.parse(allDataString);
            return allData[currentClass] || [];
        } catch (error) {
            console.error("Error parsing allCalendarData from localStorage:", error);
            return [];
        }
    }

    const [context, setContext] = useState<CalendarEvent[]>(() => getClassContext(className));
    const [inputValue, setInputValue] = useState('');
    const [mode, setMode] = useState(0); // 0: add, 1: delete

    // 현재 반의 데이터가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        if (!className) return; // className이 없으면 저장하지 않음

        const allDataString = localStorage.getItem("allCalendarData");
        const allData: AllCalendarData = allDataString ? JSON.parse(allDataString) : {};
        allData[className] = context;
        localStorage.setItem("allCalendarData", JSON.stringify(allData));
    }, [context, className]);

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
                // 서버에 보낼 때 어떤 반의 데이터인지 함께 보냅니다.
                body: JSON.stringify({ className, events: context }),
            });

            if (response.ok) {
                alert(`[${className}] 캘린더가 성공적으로 저장되었습니다!`);
            } else {
                const errorData: ErrorResponse | null = await response.json().catch(() => null);
                const errorMessage = errorData?.message || '캘린더 저장에 실패했습니다.';
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error saving calendar:', error);
            alert('캘린더 저장 중 오류가 발생했습니다.');
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
