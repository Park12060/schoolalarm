
import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// 1반부터 12반까지의 배열을 동적으로 생성합니다.
const classes = Array.from({ length: 12 }, (_, i) => `${i + 1}반`);

function Login() {
    const [password, setPassword] = useState('');
    const [selectedClass, setSelectedClass] = useState(classes[0]); // 기본으로 첫 번째 반을 선택
    const navigate = useNavigate();

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleClassChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedClass(e.target.value);
    };

    const handleLogin = () => {
        // .env 파일에 정의된 관리자 비밀번호와 비교합니다.
        if (password === import.meta.env.VITE_ADMIN_KEY) {
            // 로그인 성공 시, 선택된 반 정보를 state와 함께 캘린더 페이지로 전달합니다.
            navigate('/calender', { state: { className: selectedClass } });
        } else {
            alert('Incorrect password');
        }
    };

    return (
        <div>
            <h1>Admin Login</h1>
            <div>
                <select value={selectedClass} onChange={handleClassChange}>
                    {classes.map(className => (
                        <option key={className} value={className}>
                            {className}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Enter password"
                />
            </div>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
