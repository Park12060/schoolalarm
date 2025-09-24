
// 서버의 오류 응답 형식을 정의합니다.
interface ErrorResponse {
    message: string;
}

function DeleteAccount() {

    const handleDelete = async () => {
        try {
            const response = await fetch('/back/withdraw', {
                method: 'POST',
                // 브라우저가 세션 쿠키를 자동으로 전송하므로 헤더는 비워둡니다.
                // 요청 본문(body)도 비어 있어야 합니다.
            });

            if (response.ok) {
                alert('회원 탈퇴가 완료되었습니다.');
                // 성공 시 메인 페이지로 리디렉션
                window.location.href = '/';
            } else {
                // 서버에서 받은 에러 메시지를 파싱하여 표시합니다.
                const errorData: ErrorResponse | null = await response.json().catch(() => null);
                const errorMessage = errorData?.message || '회원 탈퇴에 실패했습니다.';
                alert(errorMessage);
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('회원 탈퇴 중 오류가 발생했습니다.');
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
