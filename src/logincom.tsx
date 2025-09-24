
import React from 'react';
import { useSearchParams } from 'react-router-dom';

function LoginSuccess() {
    const [searchParams] = useSearchParams();
    const loginStatus = searchParams.get('login');

    return (
        <div>
            {loginStatus === 'success' ? (
                <h1>로그인 성공!</h1>
            ) : (
                <h1>로그인 실패 또는 잘못된 접근입니다.</h1>
            )}
        </div>
    );
}

export default LoginSuccess;
