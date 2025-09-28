
import { useState, type ChangeEvent, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// 1반부터 12반까지의 배열을 동적으로 생성합니다.
const classes = Array.from({ length: 12 }, (_, i) => `${i + 1}반`);

// 서버의 오류 응답 형식을 정의합니다.
interface ErrorResponse {
    message: string;
}

function LoginSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const loginStatus = searchParams.get('login');
    const userId = searchParams.get('user_id');

    const [selectedClass, setSelectedClass] = useState(classes[0]);

    useEffect(() => {
        // login=success 파라미터와 user_id가 없으면 잘못된 접근으로 처리하여 홈으로 리디렉션
        if (loginStatus !== 'success' || !userId) {
            alert('로그인 정보가 없거나 잘못된 접근입니다. 메인 페이지로 이동합니다.');
            navigate('/');
        }
    }, [loginStatus, userId, navigate]);

    const handleClassChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedClass(e.target.value);
    };

    const handleRegister = async () => {
        if (!userId) {
            alert('사용자 ID가 없어 등록할 수 없습니다.');
            return;
        }

        try {
            // 중요: 이 URL을 실제 백엔드 엔드포인트로 수정해야 합니다.
            const response = await fetch('https://alarmback-f9vr6.ondigitalocean.app/register-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'origin': "https://schoolalarm-5z2et.ondigitalocean.app"
                },
                body: JSON.stringify({
                    userId: userId,
                    className: selectedClass,
                }),
            });

            if (response.ok) {
                alert(`[${selectedClass}]으로 등록이 완료되었습니다! 이제부터 서비스를 이용하실 수 있습니다.`);
                // 등록 성공 후, 사용자를 서비스 메인 페이지 등으로 보낼 수 있습니다.
                navigate('/calender');
            } else {
                const errorData: ErrorResponse | null = await response.json().catch(() => null);
                const errorMessage = errorData?.message || '등록에 실패했습니다.';
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    // useEffect에서 리디렉션이 처리되므로, 렌더링 시에는 로딩 상태나 null을 반환할 수 있습니다.
    if (loginStatus !== 'success' || !userId) {
        return null; // 리디렉션이 실행되기 전에 아무것도 렌더링하지 않음
    }

    return (
        <div>
            <h1>환영합니다!</h1>
            <p>서비스를 이용하려면, 먼저 반을 선택해주세요.</p>
            <p>사용자 ID: {userId}</p>
            <div>
                <select value={selectedClass} onChange={handleClassChange}>
                    {classes.map(className => (
                        <option key={className} value={className}>
                            {className}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleRegister}>등록하기</button>
        </div>
    );
}

export default LoginSuccess;
