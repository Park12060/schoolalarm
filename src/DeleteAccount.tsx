
import axios from 'axios';

// 서버의 오류 응답 형식을 정의합니다.
interface ErrorResponse {
    message: string;
}

function DeleteAccount() {

    const handleDelete = async () => {
        try {
            await axios.post('/api/withdraw');
            alert('회원 탈퇴가 완료되었습니다.');
            // 성공 시 메인 페이지로 리디렉션
            window.location.href = '/';
        } catch (error) {
            console.error('Error deleting account:', error);
            let errorMessage = '회원 탈퇴에 실패했습니다.';
            if (axios.isAxiosError(error) && error.response) {
                const errorData: ErrorResponse | null = error.response.data;
                errorMessage = errorData?.message || errorMessage;
            }
            alert(errorMessage);
        }
    };

    return (
        <div>
            <h1>회원 탈퇴</h1>
            <p>정말로 회원 탈퇴를 진행하시겠습니까?</p>
            <p>모든 데이터는 영구적으로 삭제되며 복구할 수 없습니다.</p>
            <button onClick={handleDelete} style={{backgroundColor: 'red', color: 'white'}}>
                회원 탈퇴
            </button>
        </div>
    );
}

export default DeleteAccount;
