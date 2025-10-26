
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// 서버의 오류 응답 형식을 정의합니다.
interface ErrorResponse {
    message: string;
}

function LoginSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const loginStatus = searchParams.get('login');
    const userId = searchParams.get('user_id');

    useEffect(() => {
        // login=success 파라미터와 user_id가 없으면 잘못된 접근으로 처리하여 홈으로 리디렉션
        if (loginStatus !== 'success' || !userId) {
            alert('로그인 정보가 없거나 잘못된 접근입니다. 메인 페이지로 이동합니다.');
            navigate('/');
            return; // useEffect 훅의 실행을 여기서 중단
        }

        const registerUser = async () => {
            try {
                await axios.post('/api/register-user', { userId });
                alert('등록이 완료되었습니다! 이제부터 서비스를 이용하실 수 있습니다.');
                // 등록 성공 후, 사용자를 서비스 메인 페이지 등으로 보냅니다.
                navigate('/SubjectLinks');
            } catch (error) {
                console.error('Error during registration:', error);
                let errorMessage = '등록에 실패했습니다.';
                if (axios.isAxiosError(error) && error.response) {
                    const errorData: ErrorResponse | null = error.response.data;
                    errorMessage = errorData?.message || errorMessage;
                }
                alert(errorMessage);
                // 실패 시 홈으로 보낼 수도 있습니다.
                navigate('/');
            }
        };

        registerUser();
    }, [loginStatus, userId, navigate]);

    // 컴포넌트는 사용자에게 프로세스가 진행 중임을 알리는 메시지를 보여줄 수 있습니다.
    return (
        <div>
            <h1>등록 처리 중...</h1>
            <p>사용자 정보를 등록하고 있습니다. 잠시만 기다려주세요.</p>
        </div>
    );
}

export default LoginSuccess;
