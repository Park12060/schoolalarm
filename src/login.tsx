
import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        // .env 파일에 정의된 관리자 비밀번호와 비교합니다.
        if (password === import.meta.env.VITE_ADMIN_KEY) {
            navigate('/calender');
        } else {
            alert('Incorrect password');
        }
    };

    return (
        <div>
            <h1>Admin Login</h1>
            <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password"
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
