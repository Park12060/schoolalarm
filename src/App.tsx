
import './App.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {type DateClickArg} from "@fullcalendar/interaction"
import {useEffect, useState} from "react";

interface CalendarEvent {
    id: string;
    title: string;
    date: string;
}

function Calender() {
    const kakaoid = import.meta.env.VITE_KAKAO_ID;
    const kakao = new window.Kakao;
    kakao.init(kakaoid);
    kakao.isInitialized();
    const handleloginClick=()=>{
        kakao.Auth.authorize({
            redirectUri: "https://park12060.github.io"
        })
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code){
            localStorage.setItem("code",code);
            kakao.Auth.setAccessToken(code);
        }

    }


    const getContext = (): CalendarEvent[] => {
        const savedContext = localStorage.getItem("context");
        return savedContext ? JSON.parse(savedContext) : [];
    }

    const [context, setContext] = useState<CalendarEvent[]>(getContext);
    const [inputValue, setInputValue] = useState('');
    const [mode, setMode] = useState(0); // 0: add, 1: delete

    useEffect(() => {
        localStorage.setItem("context", JSON.stringify(context));
    }, [context]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <button onClick={handleloginClick}>
                로그인
            </button>



        </div>
    )
}

export default Calender;
