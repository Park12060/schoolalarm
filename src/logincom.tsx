
import { useState, type ChangeEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

// 1반부터 12반까지의 배열을 동적으로 생성합니다.
const classes = Array.from({ length: 12 }, (_, i) => `${i + 1}반`);

// 서버의 오류 응답 형식을 정의합니다.
interface ErrorResponse {
    message: string;
}

function LoginSuccess() {
    const [searchParams] = useSearchParams();
    const loginStatus = searchParams.get('login');
    const userId = searchParams.get('user_id');

    const [selectedClass, setSelectedClass] = useState(classes[0]);

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
            const response = await fetch('/back/register-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    className: selectedClass,
                }),
            });

            if (response.ok) {
                alert(`[${selectedClass}]으로 등록이 완료되었습니다! 이제부터 서비스를 이용하실 수 있습니다.`);
                // 등록 성공 후, 사용자를 서비스 메인 페이지 등으로 보낼 수 있습니다.
                // 예: window.location.href = '/';
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

    // login=success 파라미터와 user_id가 없으면 잘못된 접근으로 처리
    if (loginStatus !== 'success' || !userId) {
        return <h1>로그인 실패 또는 잘못된 접근입니다.</h1>;
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
