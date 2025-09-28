
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
                const response = await fetch('https://alarmback-f9vr6.ondigitalocean.app/calender');
                if (response.ok) {
                    const allData: AllCalendarData = await response.json();
                    // 현재 반에 해당하는 데이터만 상태에 설정합니다.
                    setContext(allData[className] || []);
                } else {
                    console.error('Failed to fetch calendar data');
                    // 데이터를 가져오지 못했을 경우 빈 배열로 설정
                    setContext([]);
                }
            } catch (error) {
                console.error('Error fetching calendar data:', error);
                setContext([]);
            }
        };

        fetchCalendarData();
    }, [className]); // className이 변경될 때마다 데이터를 다시 가져옵니다.

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
            // 새 이벤트를 로컬 상태에 추가합니다.
            const newEvent = {id: arg.dateStr, title: inputValue, date: arg.dateStr};
            setContext([...context, newEvent]);
            setInputValue('');
        } else { // Delete mode
            // 로컬 상태에서 이벤트를 제거합니다.
            const updatedContext = context.filter((event) => event.id !== arg.dateStr);
            setContext(updatedContext);
        }
    }

    const handleSaveToServer = async () => {
        if (!className) return;
        try {
            const response = await fetch('https://alarmback-f9vr6.ondigitalocean.app/calender', { // 백엔드 엔드포인트
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'origin': "https://schoolalarm-5z2et.ondigitalocean.app"
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
