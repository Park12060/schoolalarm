
import { useEffect } from "react";
import './App.css';
import { useNavigate } from 'react-router-dom';
import kakaoLoginImage from './assets/kakao_login_large_narrow.png'; // 이미지를 import 합니다.

// --- 카카오 SDK 타입 정의 ---
interface KakaoAuth {
    authorize(options: { redirectUri: string; state?: string; scope?: string; prompt?: string; }): void;
    getAccessToken(): string | null;
    setAccessToken(token: string): void;
    getStatusInfo(callback: (statusInfo: unknown) => void): void;
}
interface KakaoAPI { request(options: { url: string; data?: unknown; success?: (response: unknown) => void; fail?: (error: unknown) => void; }): Promise<unknown>; }
interface KakaoSDK { init(apiKey: string): void; isInitialized(): boolean; Auth: KakaoAuth; API: KakaoAPI; }
declare global { interface Window { Kakao: KakaoSDK; } }

// --- 애플리케이션 실행 시 즉시 카카오 SDK 초기화 ---
const kakaoid = import.meta.env.VITE_KAKAO_ID;
console.log('VITE_KAKAO_ID:', kakaoid);
if (kakaoid) {
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.8/kakao.min.js';
    script.integrity = 'sha384-WUSirVbD0ASvo37f3qQZuDap8wy76aJjmGyXKOYgPL/NdAs8HhgmPlk9dz2XQsNv';
    script.crossOrigin = 'anonymous';
    script.async = false; // 동기적으로 실행하여 SDK를 즉시 사용할 수 있도록 설정

    script.onload = () => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            console.log('Kakao.init()을 호출합니다.');
            window.Kakao.init(kakaoid);
            console.log('Kakao.isInitialized() after init:', window.Kakao.isInitialized());
        }
    };
    document.head.appendChild(script);
} else {
    console.error('VITE_KAKAO_ID가 정의되지 않았습니다. .env.local 파일을 확인해주세요.');
}
// -----------------------------------------------------

function App() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        console.log('handleLoginClick 함수 호출됨');
        console.log('window.Kakao 객체:', window.Kakao);
        if (window.Kakao) {
            console.log('Kakao.isInitialized():', window.Kakao.isInitialized());
        }

        if (window.Kakao && window.Kakao.isInitialized()) {
            console.log('Kakao.Auth.authorize()를 호출합니다.');
            window.Kakao.Auth.authorize({
                redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI
            });
        } else {
            console.error('카카오 SDK가 초기화되지 않았거나, 로그인 함수를 호출할 수 없습니다.');
        }
    };

    // 로그인 리디렉션 시 URL에서 인증 코드 가져오기
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
            localStorage.setItem("code", code);
        }
    }, []);

    return (
        <div>
            <h1>Kakao Login</h1>
            <div className="button-container">
                <button onClick={handleLoginClick}>
                    <img src={kakaoLoginImage} alt="카카오 로그인" />
                </button>
                <button onClick={() => navigate('/login')}>Admin Login</button>
                <button onClick={() => navigate('/delete-account')}>회원 탈퇴</button>
            </div>
        </div>
    );
}

export default App;
