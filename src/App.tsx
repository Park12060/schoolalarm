
import { useEffect } from "react";
import './App.css';
import { useNavigate } from 'react-router-dom';
import kakaoLoginImage from './assets/kakao_login_large_narrow.png'; // 이미지를 import 합니다.

// 카카오 SDK 타입을 공식 문서를 참고하여 상세하게 정의합니다.
interface KakaoAuth {
    authorize(options: {
        redirectUri: string;
        state?: string;
        scope?: string;
        prompt?: string;
    }): void;
    getAccessToken(): string | null;
    setAccessToken(token: string): void;
    getStatusInfo(callback: (statusInfo: unknown) => void): void;
}

interface KakaoAPI {
    request(options: {
        url: string;
        data?: unknown;
        success?: (response: unknown) => void;
        fail?: (error: unknown) => void;
    }): Promise<unknown>;
}

interface KakaoSDK {
    init(apiKey: string): void;
    isInitialized(): boolean;
    Auth: KakaoAuth;
    API: KakaoAPI;
}

declare global {
    interface Window {
        Kakao: KakaoSDK;
    }
}

function App() {
    const navigate = useNavigate();

    // Kakao SDK 스크립트 로드
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.8/kakao.min.js';
        script.integrity = 'sha384-WUSirVbD0ASvo37f3qQZuDap8wy76aJjmGyXKOYgPL/NdAs8HhgmPlk9dz2XQsNv';
        script.crossOrigin = 'anonymous';
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (window.Kakao) {
                const kakaoid = import.meta.env.VITE_KAKAO_ID;
                if (kakaoid && !window.Kakao.isInitialized()) {
                    window.Kakao.init(kakaoid);
                }
            }
        };

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handleLoginClick = () => {
        if (window.Kakao && window.Kakao.isInitialized()) {
            window.Kakao.Auth.authorize({
                redirectUri: window.location.origin
            });
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
