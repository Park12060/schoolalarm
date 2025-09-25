

// 각 과목의 이름과 이동할 URL을 정의합니다.
// 중요: 이 URL들을 실제 이동하고 싶은 사이트 주소로 수정해야 합니다.
const subjects = [
    { name: '과학', url: 'https://drive.google.com/drive/folders/1EEWPmGikmdieOZp2o0inYi2yvs5qmYer?usp=sharing' },
    { name: '한국사', url: 'https://drive.google.com/drive/folders/1l5lLQB4OwdGmIZG8ygj58E9KSQstY-6B?usp=sharing' },
    { name: '미술', url: 'https://drive.google.com/drive/folders/1oT0xDx3TGSsRpFI7rRbQCs_vZoJXCHLg?usp=sharing' },
    { name: '영어', url: 'https://drive.google.com/drive/folders/1YVQdAIoGzGoOvferbRfz-UkRMeN4BCJx?usp=sharing' },
    { name: '수학', url: 'https://drive.google.com/drive/folders/1_z2ardJ5d50FROi7Rc18HMbBKWJc7XM8?usp=sharing' },
    { name: '국어', url: 'https://drive.google.com/drive/folders/1oL46frtuMkpOFFydN2F6epa6KrrdvOXP?usp=sharing' },
    { name: '한문', url: 'https://drive.google.com/drive/folders/14-Jrkuferz5BR392q4-uuXrncJYFKsIW?usp=sharing' },
    { name: '사회', url: 'https://drive.google.com/drive/folders/1kOv4pJhjDmDOIkhi1C50AAOzj7YbFufT?usp=sharing' }
];

function SubjectLinks() {
    const handleRedirect = (url: string) => {
        // 새 탭에서 링크를 엽니다.
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div>
            <h2>과목별 바로가기</h2>
            <div className="subject-buttons-container">
                {subjects.map((subject) => (
                    <button
                        key={subject.name}
                        className="subject-button"
                        onClick={() => handleRedirect(subject.url)}
                    >
                        {subject.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SubjectLinks;
